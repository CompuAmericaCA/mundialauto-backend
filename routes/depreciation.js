const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchDepreciation(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchDepreciation' } });
        });
    }
});

const operationSearchDepreciation = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xdepreciacion: requestBody.xdepreciacion ? requestBody.xdepreciacion.toUpperCase() : undefined
    };
    let searchDepreciation = await bd.searchDepreciationQuery(searchData).then((res) => res);
    if(searchDepreciation.error){ return  { status: false, code: 500, message: searchDepreciation.error }; }
    if(searchDepreciation.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchDepreciation.result.recordset.length; i++){
            jsonList.push({
                cdepreciacion: searchDepreciation.result.recordset[i].CDEPRECIACION,
                xdepreciacion: searchDepreciation.result.recordset[i].XDEPRECIACION,
                bactivo: searchDepreciation.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Depreciation not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateDepreciation(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateDepreciation' } });
        });
    }
});

const operationCreateDepreciation = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xdepreciacion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let depreciationData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xdepreciacion: requestBody.xdepreciacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyDepreciationName = await bd.verifyDepreciationNameToCreateQuery(depreciationData).then((res) => res);
    if(verifyDepreciationName.error){ return { status: false, code: 500, message: verifyDepreciationName.error }; }
    if(verifyDepreciationName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'depreciation-name-already-exist' }; }
    else{
        let createDepreciation = await bd.createDepreciationQuery(depreciationData).then((res) => res);
        if(createDepreciation.error){ return { status: false, code: 500, message: createDepreciation.error }; }
        if(createDepreciation.result.rowsAffected > 0){ return { status: true, cdepreciacion: createDepreciation.result.recordset[0].CDEPRECIACION }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDepreciation' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailDepreciation(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailDepreciation' } });
        });
    }
});

const operationDetailDepreciation = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cdepreciacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let depreciationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cdepreciacion: requestBody.cdepreciacion
    };
    let getDepreciationData = await bd.getDepreciationDataQuery(depreciationData).then((res) => res);
    if(getDepreciationData.error){ return { status: false, code: 500, message: getDepreciationData.error }; }
    if(getDepreciationData.result.rowsAffected > 0){
        return {
            status: true,
            cdepreciacion: getDepreciationData.result.recordset[0].CDEPRECIACION,
            xdepreciacion: getDepreciationData.result.recordset[0].XDEPRECIACION,
            bactivo: getDepreciationData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Depreciation not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateDepreciation(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateDepreciation' } });
        });
    }
});

const operationUpdateDepreciation = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cdepreciacion', 'xdepreciacion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let depreciationData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cdepreciacion: requestBody.cdepreciacion,
        xdepreciacion: requestBody.xdepreciacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyDepreciationName = await bd.verifyDepreciationNameToUpdateQuery(depreciationData).then((res) => res);
    if(verifyDepreciationName.error){ return { status: false, code: 500, message: verifyDepreciationName.error }; }
    if(verifyDepreciationName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'depreciation-name-already-exist'}; }
    else{
        let updateDepreciation = await bd.updateDepreciationQuery(depreciationData).then((res) => res);
        if(updateDepreciation.error){ return { status: false, code: 500, message: updateDepreciation.error }; }
        if(updateDepreciation.result.rowsAffected > 0){ return { status: true, cdepreciacion: depreciationData.cdepreciacion }; }
        else{ return { status: false, code: 404, message: 'Depreciation not found.' }; }
    }
}

module.exports = router;