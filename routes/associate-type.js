const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchAssociateType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchAssociateType' } });
        });
    }
});

const operationSearchAssociateType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoasociado: requestBody.xtipoasociado ? requestBody.xtipoasociado.toUpperCase() : undefined
    };
    let searchAssociateType = await bd.searchAssociateTypeQuery(searchData).then((res) => res);
    if(searchAssociateType.error){ return  { status: false, code: 500, message: searchAssociateType.error }; }
    if(searchAssociateType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchAssociateType.result.recordset.length; i++){
            jsonList.push({
                ctipoasociado: searchAssociateType.result.recordset[i].CTIPOASOCIADO,
                xtipoasociado: searchAssociateType.result.recordset[i].XTIPOASOCIADO,
                bactivo: searchAssociateType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Associate Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateAssociateType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateAssociateType' } });
        });
    }
});

const operationCreateAssociateType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtipoasociado', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let associateTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoasociado: requestBody.xtipoasociado.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyAssociateTypeName = await bd.verifyAssociateTypeNameToCreateQuery(associateTypeData).then((res) => res);
    if(verifyAssociateTypeName.error){ return { status: false, code: 500, message: verifyAssociateTypeName.error }; }
    if(verifyAssociateTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-type-name-already-exist' }; }
    else{
        let createAssociateType = await bd.createAssociateTypeQuery(associateTypeData).then((res) => res);
        if(createAssociateType.error){ return { status: false, code: 500, message: createAssociateType.error }; }
        if(createAssociateType.result.rowsAffected > 0){ return { status: true, ctipoasociado: createAssociateType.result.recordset[0].CTIPOASOCIADO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createAssociateType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailAssociateType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailAssociateType' } });
        });
    }
});

const operationDetailAssociateType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctipoasociado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let associateTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoasociado: requestBody.ctipoasociado
    };
    let getAssociateTypeData = await bd.getAssociateTypeDataQuery(associateTypeData).then((res) => res);
    if(getAssociateTypeData.error){ return { status: false, code: 500, message: getAssociateTypeData.error }; }
    if(getAssociateTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipoasociado: getAssociateTypeData.result.recordset[0].CTIPOASOCIADO,
            xtipoasociado: getAssociateTypeData.result.recordset[0].XTIPOASOCIADO,
            bactivo: getAssociateTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Associate Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateAssociateType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateAssociateType' } });
        });
    }
});

const operationUpdateAssociateType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctipoasociado', 'xtipoasociado', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let associateTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctipoasociado: requestBody.ctipoasociado,
        xtipoasociado: requestBody.xtipoasociado.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyAssociateTypeName = await bd.verifyAssociateTypeNameToUpdateQuery(associateTypeData).then((res) => res);
    if(verifyAssociateTypeName.error){ return { status: false, code: 500, message: verifyAssociateTypeName.error }; }
    if(verifyAssociateTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-type-name-already-exist'}; }
    else{
        let updateAssociateType = await bd.updateAssociateTypeQuery(associateTypeData).then((res) => res);
        if(updateAssociateType.error){ return { status: false, code: 500, message: updateAssociateType.error }; }
        if(updateAssociateType.result.rowsAffected > 0){ return { status: true, ctipoasociado: associateTypeData.ctipoasociado }; }
        else{ return { status: false, code: 404, message: 'Associate Type not found.' }; }
    }
}

module.exports = router;