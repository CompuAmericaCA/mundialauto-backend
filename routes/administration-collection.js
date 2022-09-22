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
        xplaca: requestBody.xplaca ? requestBody.xplaca.toUpperCase() : undefined
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
                xestatusgeneral: searchCollection.result.recordset[i].XESTATUSGENERAL
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
    if(detailCollection.error){ return { status: false, code: 500, message: detailCollection.error }; }
    if(detailCollection.result.rowsAffected > 0){
        let xvehiculo = detailCollection.result.recordset[0].XMARCA + ' ' + detailCollection.result.recordset[0].XMODELO + ' ' + detailCollection.result.recordset[0].XVERSION
        return {    
                status: true, 
                xnombrepropietario: detailCollection.result.recordset[0].XNOMBREPROPIETARIO,
                xapellidopropietario: detailCollection.result.recordset[0].XAPELLIDOPROPIETARIO,
                fdesde_pol: detailCollection.result.recordset[0].FDESDE_POL,
                fhasta_pol: detailCollection.result.recordset[0].FHASTA_POL,
                xdocidentidad: detailCollection.result.recordset[0].XDOCIDENTIDAD,
                xvehiculo: xvehiculo,
                xplaca: detailCollection.result.recordset[0].XPLACA,
                xmoneda: detailCollection.result.recordset[0].xmoneda,
                xestatusgeneral: detailCollection.result.recordset[0].XESTATUSGENERAL,
                mprima: detailCollection.result.recordset[0].MPRIMA_ANUAL
               };

    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
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
    let collectionDataList = []
    for(let i = 0; i < requestBody.pago.length; i++){
        collectionDataList.push({
            crecibo: requestBody.crecibo,
            ctipopago: requestBody.pago[i].ctipopago,
            xreferencia: requestBody.pago[i].xreferencia,
            fcobro: requestBody.pago[i].fcobro,
            cbanco: requestBody.pago[i].cbanco,
            mprima_pagada: requestBody.pago[i].mprima_pagada,
            cmoneda_pago: requestBody.pago[i].cmoneda_pago,
            ccompania: requestBody.ccompania,
            cpais: requestBody.cpais,
            cestatusgeneral: 7
        })
    }
    let updateCollection = await bd.updateCollectionQuery(collectionDataList).then((res) => res);
    if(updateCollection.error){ return { status: false, code: 500, message: updateCollection.error }; }
    if(updateCollection.result.rowsAffected > 0){ return { status: true, crecibo: collectionDataList[0].crecibo }; }
    else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
    
}

module.exports = router;