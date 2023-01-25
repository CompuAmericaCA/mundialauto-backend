const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCollection(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCollection' } });
        });
    }
});

const operationSearchCollection = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        xplaca: requestBody.xplaca ? requestBody.xplaca.toUpperCase() : undefined,
        ccorredor: requestBody.ccorredor ? requestBody.ccorredor: undefined
    }
    let searchCollection = await bd.searchCollectionQuery(searchData).then((res) => res);
    if(searchCollection.error){ return { status: false, code: 500, message: searchCollection.error }; }
    if(searchCollection.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCollection.result.recordset.length; i++){
            jsonList.push({
                crecibo: searchCollection.result.recordset[i].CRECIBO,
                clote: searchCollection.result.recordset[i].CLOTE,
                fdesde_pol: searchCollection.result.recordset[i].FDESDE_POL,
                fhasta_pol: searchCollection.result.recordset[i].FHASTA_POL,
                xnombrepropietario: searchCollection.result.recordset[i].XNOMBREPROPIETARIO,
                cestatusgeneral: searchCollection.result.recordset[i].CESTATUSGENERAL,
                xestatusgeneral: searchCollection.result.recordset[i].XESTATUSGENERAL,
                mprima_anual: searchCollection.result.recordset[i].MPRIMA_ANUAL,
                xplaca: searchCollection.result.recordset[i].XPLACA
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCollection(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCollection' } });
        });
    }
});

const operationDetailCollection = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        crecibo: requestBody.crecibo
    }
    let detailCollection = await bd.detailCollectionQuery(searchData).then((res) => res);
    if(detailCollection.error){ return { status: false}; }
        let xvehiculo = detailCollection.result.recordset[0].XMARCA + ' ' + detailCollection.result.recordset[0].XMODELO + ' ' + detailCollection.result.recordset[0].XVERSION
        let mprima = detailCollection.result.recordset[0].MPRIMA_ANUAL + ' ' + detailCollection.result.recordset[0].xmoneda
        
        return {    
                status: true, 
                ccliente: detailCollection.result.recordset[0].CCLIENTE,
                xcliente: detailCollection.result.recordset[0].XCLIENTE,
                xdocidentidadcliente: detailCollection.result.recordset[0].XDOCIDENTIDAD,
                xemail: detailCollection.result.recordset[0].XEMAIL,
                xtelefono: detailCollection.result.recordset[0].XTELEFONO,
                fdesde_rec: detailCollection.result.recordset[0].FDESDE_REC,
                fhasta_rec: detailCollection.result.recordset[0].FHASTA_REC,
                xvehiculo: xvehiculo,
                xplaca: detailCollection.result.recordset[0].XPLACA,
                xestatusgeneral: detailCollection.result.recordset[0].XESTATUSGENERAL,
                mprima: mprima,
                mprima_pagada: detailCollection.result.recordset[0].MPRIMA_ANUAL,
                ccodigo_ubii: detailCollection.result.recordset[0].CCODIGO_UBII,
                ccontratoflota: detailCollection.result.recordset[0].CCONTRATOFLOTA
               };
}

router.route('/ubii/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateReceiptPayment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateReceiptPayment' } });
        });
    }
});

const operationUpdateReceiptPayment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentData = {
        crecibo: requestBody.paymentData.crecibo,
        ccontratoflota: requestBody.paymentData.ccontratoflota,
        orderId: requestBody.paymentData.orderId,
        ctipopago: requestBody.paymentData.ctipopago,
        xreferencia: requestBody.paymentData.xreferencia,
        fcobro: requestBody.paymentData.fcobro,
        mprima_pagada: requestBody.paymentData.mprima_pagada
    }
    let updateReceiptPayment = await bd.updateReceiptPaymentQuery(paymentData);
    if(updateReceiptPayment.error){ return { status: false, code: 500, message: updateReceiptPayment.error }; }
    if(updateReceiptPayment.result.rowsAffected > 0){ return { status: true }; }
    let updateFleetContractGeneralState = await bd.updateFleetContractGeneralStateQuery(paymentData.ccontratoflota);
    if(updateFleetContractGeneralState.error){ return { status: false, code: 500, message: updateFleetContractGeneralState.error }; }
    if(updateFleetContractGeneralState.result.rowsAffected > 0){ return { status: true }; }
    return { status: true };
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCollection(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCollection' } });
        });
    }
});

const operationUpdateCollection = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let collectionDataList = {};

        collectionDataList = {
            crecibo: requestBody.crecibo,
            ctipopago: requestBody.pago.ctipopago,
            xreferencia: requestBody.pago.xreferencia,
            fcobro: requestBody.pago.fcobro,
            cbanco: requestBody.pago.cbanco,
            mprima_pagada: requestBody.pago.mprima_pagada,
            ccompania: requestBody.ccompania,
            cpais: requestBody.cpais,
            cestatusgeneral: 7,
            xnota: requestBody.pago.xnota,
            cbanco_destino: requestBody.pago.cbanco_destino,
            mtasa_cambio: requestBody.pago.mtasa_cambio,
            ftasa_cambio: requestBody.pago.ftasa_cambio,
        }
        console.log(collectionDataList)
    let updateCollection = await bd.updateCollectionQuery(collectionDataList).then((res) => res);
    if(updateCollection.error){ return { status: false, code: 500, message: updateCollection.error }; }
    if(updateCollection.result.rowsAffected > 0){ return { status: true, crecibo: collectionDataList.crecibo }; }
    else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
    
}

module.exports = router;