const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCancellationCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCancellationCause' } });
        });
    }
});

const operationSearchCancellationCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xcausaanulacion: requestBody.xcausaanulacion ? requestBody.xcausaanulacion.toUpperCase() : undefined
    };
    let searchCancellationCause = await bd.searchCancellationCauseQuery(searchData).then((res) => res);
    if(searchCancellationCause.error){ return  { status: false, code: 500, message: searchCancellationCause.error }; }
    if(searchCancellationCause.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCancellationCause.result.recordset.length; i++){
            jsonList.push({
                ccausaanulacion: searchCancellationCause.result.recordset[i].CCAUSAANULACION,
                xcausaanulacion: searchCancellationCause.result.recordset[i].XCAUSAANULACION,
                bactivo: searchCancellationCause.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Cancellation Cause not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCancellationCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCancellationCause' } });
        });
    }
});

const operationCreateCancellationCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xcausaanulacion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cancellationCauseData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xcausaanulacion: requestBody.xcausaanulacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCancellationCauseName = await bd.verifyCancellationCauseNameToCreateQuery(cancellationCauseData).then((res) => res);
    if(verifyCancellationCauseName.error){ return { status: false, code: 500, message: verifyCancellationCauseName.error }; }
    if(verifyCancellationCauseName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'cancellation-cause-name-already-exist' }; }
    else{
        let createCancellationCause = await bd.createCancellationCauseQuery(cancellationCauseData).then((res) => res);
        if(createCancellationCause.error){ return { status: false, code: 500, message: createCancellationCause.error }; }
        if(createCancellationCause.result.rowsAffected > 0){ return { status: true, ccausaanulacion: createCancellationCause.result.recordset[0].CCAUSAANULACION }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCancellationCause' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCancellationCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCancellationCause' } });
        });
    }
});

const operationDetailCancellationCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ccausaanulacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cancellationCauseData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccausaanulacion: requestBody.ccausaanulacion
    };
    let getCancellationCauseData = await bd.getCancellationCauseDataQuery(cancellationCauseData).then((res) => res);
    if(getCancellationCauseData.error){ return { status: false, code: 500, message: getCancellationCauseData.error }; }
    if(getCancellationCauseData.result.rowsAffected > 0){
        return {
            status: true,
            ccausaanulacion: getCancellationCauseData.result.recordset[0].CCAUSAANULACION,
            xcausaanulacion: getCancellationCauseData.result.recordset[0].XCAUSAANULACION,
            bactivo: getCancellationCauseData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Cancellation Cause not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCancellationCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCancellationCause' } });
        });
    }
});

const operationUpdateCancellationCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccausaanulacion', 'xcausaanulacion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cancellationCauseData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ccausaanulacion: requestBody.ccausaanulacion,
        xcausaanulacion: requestBody.xcausaanulacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyCancellationCauseName = await bd.verifyCancellationCauseNameToUpdateQuery(cancellationCauseData).then((res) => res);
    if(verifyCancellationCauseName.error){ return { status: false, code: 500, message: verifyCancellationCauseName.error }; }
    if(verifyCancellationCauseName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'cancellation-cause-name-already-exist'}; }
    else{
        let updateCancellationCause = await bd.updateCancellationCauseQuery(cancellationCauseData).then((res) => res);
        if(updateCancellationCause.error){ return { status: false, code: 500, message: updateCancellationCause.error }; }
        if(updateCancellationCause.result.rowsAffected > 0){ return { status: true, ccausaanulacion: cancellationCauseData.ccausaanulacion }; }
        else{ return { status: false, code: 404, message: 'Cancellation Cause not found.' }; }
    }
}

module.exports = router;