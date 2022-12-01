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

module.exports = router;