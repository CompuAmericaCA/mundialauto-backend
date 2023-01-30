const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const emailer = require('../src/emailer')

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchAdministrationPaymentRecord(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchAdministrationPaymentRecord' } });
        });
    }
});

const operationSearchAdministrationPaymentRecord = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ffactura: requestBody.ffactura,
        frecepcion: requestBody.frecepcion,
        fvencimiento: requestBody.fvencimiento
    }
    let searchAdministrationPaymentRecord = await bd.searchAdministrationPaymentRecordQuery(searchData).then((res) => res);
    if(searchAdministrationPaymentRecord.error){ return { status: false, code: 500, message: searchAdministrationPaymentRecord.error }; }
    if(searchAdministrationPaymentRecord.result.rowsAffected > 0){
        let searchSettlementAdministrationPaymentRecord = await bd.searchSettlementAdministrationPaymentRecordQuery(searchData).then((res) => res);
        if(searchSettlementAdministrationPaymentRecord.error){ return { status: false, code: 500, message: searchSettlementAdministrationPaymentRecord.error }; }
        let jsonListSettlement = [];
        for(let i = 0; i < searchSettlementAdministrationPaymentRecord.result.recordset.length; i++){
            jsonListSettlement.push({
                cfactura: searchSettlementAdministrationPaymentRecord.result.recordset[i].CFACTURA,
                xcliente: searchSettlementAdministrationPaymentRecord.result.recordset[i].XCLIENTE,
                xnombre: searchSettlementAdministrationPaymentRecord.result.recordset[i].XNOMBRE,
                mmontofactura: searchSettlementAdministrationPaymentRecord.result.recordset[i].MMONTOFACTURA,
                ncontrol: searchSettlementAdministrationPaymentRecord.result.recordset[i].NCONTROL,
                nfactura: searchSettlementAdministrationPaymentRecord.result.recordset[i].NFACTURA,
                ffactura: searchSettlementAdministrationPaymentRecord.result.recordset[i].FFACTURA,
                frecepcion: searchSettlementAdministrationPaymentRecord.result.recordset[i].FRECEPCION,
                fvencimiento: searchSettlementAdministrationPaymentRecord.result.recordset[i].FVENCIMIENTO,
            });
        }
        let jsonList = [];
        for(let i = 0; i < searchAdministrationPaymentRecord.result.recordset.length; i++){
            jsonList.push({
                cfactura: searchAdministrationPaymentRecord.result.recordset[i].CFACTURA,
                xcliente: searchAdministrationPaymentRecord.result.recordset[i].XCLIENTE,
                xnombre: searchAdministrationPaymentRecord.result.recordset[i].XNOMBRE,
                mmontofactura: searchAdministrationPaymentRecord.result.recordset[i].MMONTOFACTURA,
                ncontrol: searchAdministrationPaymentRecord.result.recordset[i].NCONTROL,
                nfactura: searchAdministrationPaymentRecord.result.recordset[i].NFACTURA,
                ffactura: searchAdministrationPaymentRecord.result.recordset[i].FFACTURA,
                frecepcion: searchAdministrationPaymentRecord.result.recordset[i].FRECEPCION,
                fvencimiento: searchAdministrationPaymentRecord.result.recordset[i].FVENCIMIENTO
            });
        }
        return { status: true, list: jsonList, settlementList: jsonListSettlement };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/change-provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationChangeProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationChangeProvider' } });
        });
    }
});

const operationChangeProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let cproveedor = requestBody.cproveedor;
    let searchProvider = await bd.providerFromBillLoadingQuery(cproveedor).then((res) => res);
    if(searchProvider.error){ return { status: false, code: 500, message: searchProvider.error }; }
    if(searchProvider.result.rowsAffected > 0){
        let razonsocial;
        if(searchProvider.result.recordset[0].XRAZONSOCIAL){
            razonsocial = searchProvider.result.recordset[0].XRAZONSOCIAL
        }else{
            razonsocial = searchProvider.result.recordset[0].XNOMBRE
        }
        return { status: true, 
                 cproveedor: searchProvider.result.recordset[0].CPROVEEDOR,
                 xrazonsocial: razonsocial,
                 nlimite: searchProvider.result.recordset[0].NLIMITE, };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/service-order').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationServiceOrderFromBillLoading(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationServiceOrderFromBillLoading' } });
        });
    }
});

const operationServiceOrderFromBillLoading = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cproveedor: requestBody.cproveedor,
        ccliente: requestBody.ccliente
    }
    console.log(searchData)
    let searchServiceOrderFromBillLoading = await bd.searchServiceOrderFromBillLoadingQuery(searchData).then((res) => res);
    if(searchServiceOrderFromBillLoading.error){ return  { status: false, code: 500, message: searchServiceOrderFromBillLoading.error }; }
    if(searchServiceOrderFromBillLoading.result.rowsAffected > 0){
        let jsonList = [];
        let xservicio, xmonedagrua, xmonedacoti, mmontototal, mtotal;
        for(let i = 0; i < searchServiceOrderFromBillLoading.result.recordset.length; i++){
            if(searchServiceOrderFromBillLoading.result.recordset[i].XSERVICIOADICIONAL){
                xservicio = searchServiceOrderFromBillLoading.result.recordset[i].XSERVICIOADICIONAL
            }else{
                xservicio = searchServiceOrderFromBillLoading.result.recordset[i].XSERVICIO
            }
            if(searchServiceOrderFromBillLoading.result.recordset[i].XMONEDAGRUA){
                xmonedagrua = searchServiceOrderFromBillLoading.result.recordset[i].XMONEDAGRUA
            }else{
                xmonedagrua = 'SIN ESPECIFICACIÓN'
            }
            if(searchServiceOrderFromBillLoading.result.recordset[i].XMONEDACOTI){
                xmonedacoti = searchServiceOrderFromBillLoading.result.recordset[i].XMONEDACOTI
            }else{
                xmonedacoti = 'SIN ESPECIFICACIÓN'
            }
            if(searchServiceOrderFromBillLoading.result.recordset[i].MMONTOTOTAL){
                mmontototal = searchServiceOrderFromBillLoading.result.recordset[i].MMONTOTOTAL
            }else{
                mmontototal = 0
            }
            if(searchServiceOrderFromBillLoading.result.recordset[i].MTOTAL){
                mtotal = searchServiceOrderFromBillLoading.result.recordset[i].MTOTAL
            }else{
                mtotal = 0
            }
            jsonList.push({
                corden: searchServiceOrderFromBillLoading.result.recordset[i].CORDEN,
                ccontratoflota: searchServiceOrderFromBillLoading.result.recordset[i].CCONTRATOFLOTA,
                xcliente: searchServiceOrderFromBillLoading.result.recordset[i].XCLIENTE,
                xnombre: searchServiceOrderFromBillLoading.result.recordset[i].XNOMBRE,
                xservicio: xservicio,
                mtotal: mtotal,
                mmontototal: mmontototal,
                xmonedagrua: xmonedagrua,
                xmonedacoti: xmonedacoti,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/search-exchange-rate').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchExchangeRate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchExchangeRate' } });
        });
    }
});

const operationSearchExchangeRate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        fingreso: requestBody.fingreso ? requestBody.fingreso: undefined,
    }
    let searchExchangeRate = await bd.searchExchangeRateQuery(searchData).then((res) => res);
    if(searchExchangeRate.error){ return  { status: false, code: 500, message: searchExchangeRate.error }; }
    if(searchExchangeRate.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchExchangeRate.result.recordset.length; i++){
            jsonList.push({
                ctasa: searchExchangeRate.result.recordset[i].CTASA,
                mtasa_cambio: searchExchangeRate.result.recordset[i].MTASA_CAMBIO,
                fingreso: searchExchangeRate.result.recordset[i].FINGRESO,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/create-exchange-rate').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateExchangeRate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateExchangeRate' } });
        });
    }
});

const operationCreateExchangeRate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let dataList = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        mtasa_cambio: requestBody.mtasa_cambio,
        fingreso: requestBody.fingreso
    }
    let createCreateExchangeRate = await bd.createCreateExchangeRateQuery(dataList).then((res) => res);
    if(createCreateExchangeRate.error){ return { status: false, code: 500, message: updateCollection.error }; }
    if(createCreateExchangeRate.result.rowsAffected > 0){ return { status: true }; }
    else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
    
}

router.route('/last-exchange-rate').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationGetLastExchangeRate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationGetLastExchangeRate' } });
        });
    }
});

const operationGetLastExchangeRate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let lastExchangeRate = await bd.lastExchangeRateQuery().then((res) => res);
    if(lastExchangeRate.error){ return  { status: false, code: 500, message: lastExchangeRate.error }; }
    if(lastExchangeRate.result.rowsAffected > 0){
        let tasaCambio = {
            ctasa_cambio: lastExchangeRate.result.recordset[0].CTASA,
            mtasa_cambio: lastExchangeRate.result.recordset[0].MTASA_CAMBIO,
            fingreso: lastExchangeRate.result.recordset[0].FINGRESO
        }
        console.log(tasaCambio);
        return { status: true, tasaCambio: tasaCambio };
    }else{ return { status: false, code: 404, message: 'Exchange Rate not found.' }; }
}

router.route('/detail-exchange-rate').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailExchangeRate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailExchangeRate' } });
        });
    }
});

const operationDetailExchangeRate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctasa: requestBody.ctasa
    }
    let detailExchangeRate = await bd.detailExchangeRateQuery(searchData).then((res) => res);
    if(detailExchangeRate.error){ return  { status: false, code: 500, message: detailExchangeRate.error }; }
    if(detailExchangeRate.result.rowsAffected > 0){
        return { status: true, 
                 ctasa: detailExchangeRate.result.recordset[0].CTASA,
                 mtasa_cambio: detailExchangeRate.result.recordset[0].MTASA_CAMBIO,
                 fingreso: detailExchangeRate.result.recordset[0].FINGRESO
               };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/settlement').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSettlementFromBillLoading(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSettlementFromBillLoading' } });
        });
    }
});

const operationSettlementFromBillLoading = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente
    }
    let searchSettlementFromBillLoading = await bd.searchSettlementFromBillLoadingQuery(searchData).then((res) => res);
    if(searchSettlementFromBillLoading.error){ return  { status: false, code: 500, message: searchSettlementFromBillLoading.error }; }
    if(searchSettlementFromBillLoading.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchSettlementFromBillLoading.result.recordset.length; i++){
            jsonList.push({
                cfiniquito: searchSettlementFromBillLoading.result.recordset[i].CFINIQUITO,
                xcliente: searchSettlementFromBillLoading.result.recordset[i].XCLIENTE,
                xdanos: searchSettlementFromBillLoading.result.recordset[i].XDANOS,
                mmontofiniquito: searchSettlementFromBillLoading.result.recordset[i].MMONTOFINIQUITO,
                xmoneda: searchSettlementFromBillLoading.result.recordset[i].xmoneda,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/code-bill-loading').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCodeBillLoading(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCodeBillLoading' } });
        });
    }
});

const operationCodeBillLoading = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let codeBillLoading = await bd.codeBillLoadingQuery().then((res) => res);
    if(codeBillLoading.error){ return  { status: false, code: 500, message: codeBillLoading.error }; }
    if(codeBillLoading.result.rowsAffected > 0){
        return { status: true, 
            cfactura: codeBillLoading.result.recordset[0].CFACTURA + 1,
          };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/create-bill-loading').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateBillLoading(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateBillLoading' } });
        });
    }
});

const operationCreateBillLoading = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let billLoadingData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuario: requestBody.cusuario,
        cproveedor: requestBody.cproveedor,
        xtipopagador: requestBody.xtipopagador,
        xpagador: requestBody.xpagador,
        crecibidor: requestBody.crecibidor ? requestBody.crecibidor: undefined,
        ffactura: requestBody.ffactura,
        frecepcion: requestBody.frecepcion,
        fvencimiento: requestBody.fvencimiento,
        nfactura: requestBody.nfactura,
        ncontrol:requestBody.ncontrol,
        mmontofactura: requestBody.mmontofactura,
        xobservacion: requestBody.xobservacion.toUpperCase(),
        cfactura: requestBody.cfactura,
        xrutaarchivo: requestBody.xrutaarchivo,
        cestatusgeneral: requestBody.cestatusgeneral,
        cmoneda: requestBody.cmoneda
    }
    if(requestBody.serviceorder){
        if(requestBody.serviceorder.create && requestBody.serviceorder.create.length > 0){
            let serviceOrderList = [];
            for(let i = 0; i < requestBody.serviceorder.create.length; i++){
                serviceOrderList.push({
                    corden: requestBody.serviceorder.create[i].corden
                })
            }
            let createBillLoadingServiceOrder = await bd.createBillLoadingServiceOrderQuery(serviceOrderList, billLoadingData).then((res) => res);
            if(createBillLoadingServiceOrder.error){ return { status: false, code: 500, message: createBillLoadingServiceOrder.error }; }
            
        }
    }
    if(requestBody.settlement){
        if(requestBody.settlement.create && requestBody.settlement.create.length > 0){
            let settlementList = [];
            for(let i = 0; i < requestBody.settlement.create.length; i++){
                settlementList.push({
                    cfiniquito: requestBody.settlement.create[i].cfiniquito
                })
            }
            let createBillLoadingSettlement = await bd.createBillLoadingSettlementQuery(settlementList, billLoadingData).then((res) => res);
            if(createBillLoadingSettlement.error){ return { status: false, code: 500, message: createBillLoadingSettlement.error }; }
            
        }
    }
    return { status: true, ccontratoflota: billLoadingData.cfactura }; 
}

router.route('/destinationBank').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationDestinationBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDestinationBank' } });
        });
    }
});

const operationDestinationBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ctipopago: requestBody.ctipopago
    }
    let query = await bd.destinationBankQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
            cbanco_destino: query.result.recordset[i].CBANCO_DESTINO, 
            xbanco_destino: query.result.recordset[i].XBANCO
        });
    }
    return { status: true, list: jsonArray }
}

router.route('/search-bill').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationSearchBill(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBill' } });
        });
    }
});

const operationSearchBill = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cfactura: requestBody.cfactura
    }
    let searchServiceOrderByBill = await bd.searchServiceOrderByBillQuery(searchData).then((res) => res);
    if(searchServiceOrderByBill.error){ return { status: false, code: 500, message: query.error }; }
        let searchSettlementByBill = await bd.searchSettlementByBillQuery(searchData).then((res) => res);
        if(searchSettlementByBill.error){ return { status: false, code: 500, message: query.error }; }

        //Lista de Ordenes de Servicio
        let serviceOrderList = [];
        for(let i = 0; i < searchServiceOrderByBill.result.recordset.length; i++){
            serviceOrderList.push({ 
                corden: searchServiceOrderByBill.result.recordset[i].CORDEN,
                xnombre: searchServiceOrderByBill.result.recordset[i].XNOMBRE,
                mmontofactura: searchServiceOrderByBill.result.recordset[i].MMONTOFACTURA,
                xtipopagador: searchServiceOrderByBill.result.recordset[i].XTIPOPAGADOR,
                xmoneda: searchServiceOrderByBill.result.recordset[i].xmoneda,
                mmontocotizacion: searchServiceOrderByBill.result.recordset[i].MMONTOCOTIZACION,
                mmontocotizacioniva: searchServiceOrderByBill.result.recordset[i].MMONTOCOTIZACIONIVA,
            });
        }

        //Lista de Finiquitos
        let settlementList = [];
        for(let i = 0; i < searchSettlementByBill.result.recordset.length; i++){
            settlementList.push({ 
                cfiniquito: searchSettlementByBill.result.recordset[i].CFINIQUITO,
                xnombre: searchSettlementByBill.result.recordset[i].XNOMBRE,
                mmontofactura: searchSettlementByBill.result.recordset[i].MMONTOFACTURA,
                xtipopagador: searchSettlementByBill.result.recordset[i].XTIPOPAGADOR,
                xmoneda: searchSettlementByBill.result.recordset[i].xmoneda
            });
        }

    return { status: true, serviceOrder: serviceOrderList, settlement: settlementList}
}

router.route('/bill-detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationBillDetail(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationBillDetail' } });
        });
    }
});

const operationBillDetail = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cfactura: requestBody.cfactura
    }
    let detailBill = await bd.detailBillQuery(searchData).then((res) => res);
    if(detailBill.error){ return  { status: false, code: 500, message: detailBill.error }; }
    if(detailBill.result.rowsAffected > 0){
        return { status: true, 
                cfactura: detailBill.result.recordset[0].CFACTURA,
                xcliente: detailBill.result.recordset[0].XCLIENTE,
                nfactura: detailBill.result.recordset[0].NFACTURA,
                ncontrol: detailBill.result.recordset[0].NCONTROL,
                mmontofactura: detailBill.result.recordset[0].MMONTOFACTURA,
                ffactura: detailBill.result.recordset[0].FFACTURA,
                fvencimiento: detailBill.result.recordset[0].FVENCIMIENTO,
                frecepcion: detailBill.result.recordset[0].FRECEPCION,
                pretencion: detailBill.result.recordset[0].PRETENCION,
                pislr: detailBill.result.recordset[0].PISLR,
                pimpuesto: detailBill.result.recordset[0].PIMPUESTO,
          };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/create-payment').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreatePayment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePayment' } });
        });
    }
});

const operationCreatePayment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentList = {
        cfactura: requestBody.cfactura,
        xcliente: requestBody.xcliente,
        nfactura: requestBody.nfactura,
        ffactura: requestBody.ffactura,
        msumafactura: parseInt(requestBody.msumafactura) ? requestBody.msumafactura: undefined,
        mmontocotizacion: parseInt(requestBody.mmontocotizacion) ? requestBody.mmontocotizacion: undefined,
        mmontototaliva: parseInt(requestBody.mmontototaliva) ? requestBody.mmontototaliva: undefined,
        mmontototalretencion: parseInt(requestBody.mmontototalretencion) ? requestBody.mmontototalretencion: undefined,
        mmontototalislr: parseInt(requestBody.mmontototalislr) ? requestBody.mmontototalislr: undefined,
        mmontototalimpuestos: parseInt(requestBody.mmontototalimpuestos) ? requestBody.mmontototalimpuestos: undefined,
        mmontototalfactura: parseInt(requestBody.mmontototalfactura) ? requestBody.mmontototalfactura: undefined,
        cusuario: requestBody.cusuario,
        cestatusgeneral: requestBody.cestatusgeneral
    }
    let createPayment = await bd.createPaymentQuery(paymentList).then((res) => res);
    if(createPayment.error){ return { status: false, code: 500, message: createPayment.error }; }
    if(createPayment.result.rowsAffected > 0){ return { status: true }; }
    else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
    
}

module.exports = router;