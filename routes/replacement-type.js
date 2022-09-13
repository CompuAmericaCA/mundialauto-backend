const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchReplacementType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchReplacementType' } });
        });
    }
});

const operationSearchReplacementType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiporepuesto: requestBody.xtiporepuesto ? requestBody.xtiporepuesto.toUpperCase() : undefined
    };
    let searchReplacementType = await bd.searchReplacementTypeQuery(searchData).then((res) => res);
    if(searchReplacementType.error){ return  { status: false, code: 500, message: searchReplacementType.error }; }
    if(searchReplacementType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchReplacementType.result.recordset.length; i++){
            jsonList.push({
                ctiporepuesto: searchReplacementType.result.recordset[i].CTIPOREPUESTO,
                xtiporepuesto: searchReplacementType.result.recordset[i].XTIPOREPUESTO,
                bactivo: searchReplacementType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Replacement Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateReplacementType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateReplacementType' } });
        });
    }
});

const operationCreateReplacementType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtiporepuesto', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let replacementTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiporepuesto: requestBody.xtiporepuesto.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyReplacementTypeName = await bd.verifyReplacementTypeNameToCreateQuery(replacementTypeData).then((res) => res);
    if(verifyReplacementTypeName.error){ return { status: false, code: 500, message: verifyReplacementTypeName.error }; }
    if(verifyReplacementTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'replacement-type-name-already-exist' }; }
    else{
        let createReplacementType = await bd.createReplacementTypeQuery(replacementTypeData).then((res) => res);
        if(createReplacementType.error){ return { status: false, code: 500, message: createReplacementType.error }; }
        if(createReplacementType.result.rowsAffected > 0){ return { status: true, ctiporepuesto: createReplacementType.result.recordset[0].CTIPOREPUESTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createReplacementType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailReplacementType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailReplacementType' } });
        });
    }
});

const operationDetailReplacementType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctiporepuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let replacementTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiporepuesto: requestBody.ctiporepuesto
    };
    let getReplacementTypeData = await bd.getReplacementTypeDataQuery(replacementTypeData).then((res) => res);
    if(getReplacementTypeData.error){ return { status: false, code: 500, message: getReplacementTypeData.error }; }
    if(getReplacementTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctiporepuesto: getReplacementTypeData.result.recordset[0].CTIPOREPUESTO,
            xtiporepuesto: getReplacementTypeData.result.recordset[0].XTIPOREPUESTO,
            bactivo: getReplacementTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Replacement Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateReplacementType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateReplacementType' } });
        });
    }
});

const operationUpdateReplacementType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiporepuesto', 'xtiporepuesto', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let replacementTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctiporepuesto: requestBody.ctiporepuesto,
        xtiporepuesto: requestBody.xtiporepuesto.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyReplacementTypeName = await bd.verifyReplacementTypeNameToUpdateQuery(replacementTypeData).then((res) => res);
    if(verifyReplacementTypeName.error){ return { status: false, code: 500, message: verifyReplacementTypeName.error }; }
    if(verifyReplacementTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'replacement-type-name-already-exist'}; }
    else{
        let updateReplacementType = await bd.updateReplacementTypeQuery(replacementTypeData).then((res) => res);
        if(updateReplacementType.error){ return { status: false, code: 500, message: updateReplacementType.error }; }
        if(updateReplacementType.result.rowsAffected > 0){ return { status: true, ctiporepuesto: replacementTypeData.ctiporepuesto }; }
        else{ return { status: false, code: 404, message: 'Replacement Type not found.' }; }
    }
}

module.exports = router;