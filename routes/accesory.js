const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchAccesory(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchAccesory' } });
        });
    }
});

const operationSearchAccesory = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xaccesorio: requestBody.xaccesorio ? requestBody.xaccesorio.toUpperCase() : undefined
    };
    let searchAccesory = await bd.searchAccesoryQuery(searchData).then((res) => res);
    if(searchAccesory.error){ return  { status: false, code: 500, message: searchAccesory.error }; }
    if(searchAccesory.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchAccesory.result.recordset.length; i++){
            jsonList.push({
                caccesorio: searchAccesory.result.recordset[i].CACCESORIO,
                xaccesorio: searchAccesory.result.recordset[i].XACCESORIO,
                bactivo: searchAccesory.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Accesory not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateAccesory(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateAccesory' } });
        });
    }
});

const operationCreateAccesory = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xaccesorio', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let accesoryData = {
        cpais: requestBody.cpais,
        xaccesorio: requestBody.xaccesorio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyAccesoryName = await bd.verifyAccesoryNameToCreateQuery(accesoryData).then((res) => res);
    if(verifyAccesoryName.error){ return { status: false, code: 500, message: verifyAccesoryName.error }; }
    if(verifyAccesoryName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'accesory-name-already-exist' }; }
    else{
        let createAccesory = await bd.createAccesoryQuery(accesoryData).then((res) => res);
        if(createAccesory.error){ return { status: false, code: 500, message: createAccesory.error }; }
        if(createAccesory.result.rowsAffected > 0){ return { status: true, caccesorio: createAccesory.result.recordset[0].CACCESORIO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createAccesory' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailAccesory(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailAccesory' } });
        });
    }
});

const operationDetailAccesory = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','caccesorio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let accesoryData = {
        cpais: requestBody.cpais,
        caccesorio: requestBody.caccesorio
    };
    let getAccesoryData = await bd.getAccesoryDataQuery(accesoryData).then((res) => res);
    if(getAccesoryData.error){ return { status: false, code: 500, message: getAccesoryData.error }; }
    if(getAccesoryData.result.rowsAffected > 0){
        return {
            status: true,
            caccesorio: getAccesoryData.result.recordset[0].CACCESORIO,
            xaccesorio: getAccesoryData.result.recordset[0].XACCESORIO,
            bactivo: getAccesoryData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Accesory not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateAccesory(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateAccesory' } });
        });
    }
});

const operationUpdateAccesory = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'caccesorio', 'xaccesorio', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let accesoryData = {
        cpais: requestBody.cpais,
        caccesorio: requestBody.caccesorio,
        xaccesorio: requestBody.xaccesorio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyAccesoryName = await bd.verifyAccesoryNameToUpdateQuery(accesoryData).then((res) => res);
    if(verifyAccesoryName.error){ return { status: false, code: 500, message: verifyAccesoryName.error }; }
    if(verifyAccesoryName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'accesory-name-already-exist'}; }
    else{
        let updateAccesory = await bd.updateAccesoryQuery(accesoryData).then((res) => res);
        if(updateAccesory.error){ return { status: false, code: 500, message: updateAccesory.error }; }
        if(updateAccesory.result.rowsAffected > 0){ return { status: true, caccesorio: accesoryData.caccesorio }; }
        else{ return { status: false, code: 404, message: 'Accesory not found.' }; }
    }
}

module.exports = router;