const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchInspectionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchInspectionType' } });
        });
    }
});

const operationSearchInspectionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoinspeccion: requestBody.xtipoinspeccion ? requestBody.xtipoinspeccion.toUpperCase() : undefined
    };
    let searchInspectionType = await bd.searchInspectionTypeQuery(searchData).then((res) => res);
    if(searchInspectionType.error){ return  { status: false, code: 500, message: searchInspectionType.error }; }
    if(searchInspectionType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchInspectionType.result.recordset.length; i++){
            jsonList.push({
                ctipoinspeccion: searchInspectionType.result.recordset[i].CTIPOINSPECCION,
                xtipoinspeccion: searchInspectionType.result.recordset[i].XTIPOINSPECCION,
                bactivo: searchInspectionType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Inspection Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateInspectionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateInspectionType' } });
        });
    }
});

const operationCreateInspectionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtipoinspeccion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let inspectionTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoinspeccion: requestBody.xtipoinspeccion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyInspectionTypeName = await bd.verifyInspectionTypeNameToCreateQuery(inspectionTypeData).then((res) => res);
    if(verifyInspectionTypeName.error){ return { status: false, code: 500, message: verifyInspectionTypeName.error }; }
    if(verifyInspectionTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'inspection-type-name-already-exist' }; }
    else{
        let createInspectionType = await bd.createInspectionTypeQuery(inspectionTypeData).then((res) => res);
        if(createInspectionType.error){ return { status: false, code: 500, message: createInspectionType.error }; }
        if(createInspectionType.result.rowsAffected > 0){ return { status: true, ctipoinspeccion: createInspectionType.result.recordset[0].CTIPOINSPECCION }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createInspectionType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailInspectionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailInspectionType' } });
        });
    }
});

const operationDetailInspectionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctipoinspeccion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let inspectionTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoinspeccion: requestBody.ctipoinspeccion
    };
    let getInspectionTypeData = await bd.getInspectionTypeDataQuery(inspectionTypeData).then((res) => res);
    if(getInspectionTypeData.error){ return { status: false, code: 500, message: getInspectionTypeData.error }; }
    if(getInspectionTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipoinspeccion: getInspectionTypeData.result.recordset[0].CTIPOINSPECCION,
            xtipoinspeccion: getInspectionTypeData.result.recordset[0].XTIPOINSPECCION,
            bactivo: getInspectionTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Inspection Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateInspectionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateInspectionType' } });
        });
    }
});

const operationUpdateInspectionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctipoinspeccion', 'xtipoinspeccion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let inspectionTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctipoinspeccion: requestBody.ctipoinspeccion,
        xtipoinspeccion: requestBody.xtipoinspeccion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyInspectionTypeName = await bd.verifyInspectionTypeNameToUpdateQuery(inspectionTypeData).then((res) => res);
    if(verifyInspectionTypeName.error){ return { status: false, code: 500, message: verifyInspectionTypeName.error }; }
    if(verifyInspectionTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'inspection-type-name-already-exist'}; }
    else{
        let updateInspectionType = await bd.updateInspectionTypeQuery(inspectionTypeData).then((res) => res);
        if(updateInspectionType.error){ return { status: false, code: 500, message: updateInspectionType.error }; }
        if(updateInspectionType.result.rowsAffected > 0){ return { status: true, ctipoinspeccion: inspectionTypeData.ctipoinspeccion }; }
        else{ return { status: false, code: 404, message: 'Inspection Type not found.' }; }
    }
}

module.exports = router;