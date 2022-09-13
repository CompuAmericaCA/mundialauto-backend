const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchTransmissionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTransmissionType' } });
        });
    }
});

const operationSearchTransmissionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xtipotransmision: requestBody.xtipotransmision ? requestBody.xtipotransmision.toUpperCase() : undefined
    };
    let searchTransmissionType = await bd.searchTransmissionTypeQuery(searchData).then((res) => res);
    if(searchTransmissionType.error){ return  { status: false, code: 500, message: searchTransmissionType.error }; }
    if(searchTransmissionType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchTransmissionType.result.recordset.length; i++){
            jsonList.push({
                ctipotransmision: searchTransmissionType.result.recordset[i].CTIPOTRANSMISION,
                xtipotransmision: searchTransmissionType.result.recordset[i].XTIPOTRANSMISION,
                bactivo: searchTransmissionType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Transmission Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateTransmissionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateTransmissionType' } });
        });
    }
});

const operationCreateTransmissionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xtipotransmision', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let transmissionTypeData = {
        cpais: requestBody.cpais,
        xtipotransmision: requestBody.xtipotransmision.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyTransmissionTypeName = await bd.verifyTransmissionTypeNameToCreateQuery(transmissionTypeData).then((res) => res);
    if(verifyTransmissionTypeName.error){ return { status: false, code: 500, message: verifyTransmissionTypeName.error }; }
    if(verifyTransmissionTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'transmission-type-name-already-exist' }; }
    else{
        let createTransmissionType = await bd.createTransmissionTypeQuery(transmissionTypeData).then((res) => res);
        if(createTransmissionType.error){ return { status: false, code: 500, message: createTransmissionType.error }; }
        if(createTransmissionType.result.rowsAffected > 0){ return { status: true, ctipotransmision: createTransmissionType.result.recordset[0].CTIPOTRANSMISION }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTransmissionType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailTransmissionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailTransmissionType' } });
        });
    }
});

const operationDetailTransmissionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ctipotransmision'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let transmissionTypeData = {
        cpais: requestBody.cpais,
        ctipotransmision: requestBody.ctipotransmision
    };
    let getTransmissionTypeData = await bd.getTransmissionTypeDataQuery(transmissionTypeData).then((res) => res);
    if(getTransmissionTypeData.error){ return { status: false, code: 500, message: getTransmissionTypeData.error }; }
    if(getTransmissionTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipotransmision: getTransmissionTypeData.result.recordset[0].CTIPOTRANSMISION,
            xtipotransmision: getTransmissionTypeData.result.recordset[0].XTIPOTRANSMISION,
            bactivo: getTransmissionTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Transmission Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateTransmissionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateTransmissionType' } });
        });
    }
});

const operationUpdateTransmissionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ctipotransmision', 'xtipotransmision', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let transmissionTypeData = {
        cpais: requestBody.cpais,
        ctipotransmision: requestBody.ctipotransmision,
        xtipotransmision: requestBody.xtipotransmision.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyTransmissionTypeName = await bd.verifyTransmissionTypeNameToUpdateQuery(transmissionTypeData).then((res) => res);
    if(verifyTransmissionTypeName.error){ return { status: false, code: 500, message: verifyTransmissionTypeName.error }; }
    if(verifyTransmissionTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'transmission-type-name-already-exist'}; }
    else{
        let updateTransmissionType = await bd.updateTransmissionTypeQuery(transmissionTypeData).then((res) => res);
        if(updateTransmissionType.error){ return { status: false, code: 500, message: updateTransmissionType.error }; }
        if(updateTransmissionType.result.rowsAffected > 0){ return { status: true, ctipotransmision: transmissionTypeData.ctipotransmision }; }
        else{ return { status: false, code: 404, message: 'Transmission Type not found.' }; }
    }
}

module.exports = router;

