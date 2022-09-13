const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchClaimCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClaimCause' } });
        });
    }
});

const operationSearchClaimCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xcausasiniestro: requestBody.xcausasiniestro ? requestBody.xcausasiniestro.toUpperCase() : undefined
    };
    let searchClaimCause = await bd.searchClaimCauseQuery(searchData).then((res) => res);
    if(searchClaimCause.error){ return  { status: false, code: 500, message: searchClaimCause.error }; }
    if(searchClaimCause.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchClaimCause.result.recordset.length; i++){
            jsonList.push({
                ccausasiniestro: searchClaimCause.result.recordset[i].CCAUSASINIESTRO,
                xcausasiniestro: searchClaimCause.result.recordset[i].XCAUSASINIESTRO,
                bactivo: searchClaimCause.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Claim Cause not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateClaimCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateClaimCause' } });
        });
    }
});

const operationCreateClaimCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xcausasiniestro', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let claimCauseData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xcausasiniestro: requestBody.xcausasiniestro.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyClaimCauseName = await bd.verifyClaimCauseNameToCreateQuery(claimCauseData).then((res) => res);
    if(verifyClaimCauseName.error){ return { status: false, code: 500, message: verifyClaimCauseName.error }; }
    if(verifyClaimCauseName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'claim-cause-name-already-exist' }; }
    else{
        let createClaimCause = await bd.createClaimCauseQuery(claimCauseData).then((res) => res);
        if(createClaimCause.error){ return { status: false, code: 500, message: createClaimCause.error }; }
        if(createClaimCause.result.rowsAffected > 0){ return { status: true, ccausasiniestro: createClaimCause.result.recordset[0].CCAUSASINIESTRO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClaimCause' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailClaimCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClaimCause' } });
        });
    }
});

const operationDetailClaimCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ccausasiniestro'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let claimCauseData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccausasiniestro: requestBody.ccausasiniestro
    };
    let getClaimCauseData = await bd.getClaimCauseDataQuery(claimCauseData).then((res) => res);
    if(getClaimCauseData.error){ return { status: false, code: 500, message: getClaimCauseData.error }; }
    if(getClaimCauseData.result.rowsAffected > 0){
        return {
            status: true,
            ccausasiniestro: getClaimCauseData.result.recordset[0].CCAUSASINIESTRO,
            xcausasiniestro: getClaimCauseData.result.recordset[0].XCAUSASINIESTRO,
            bactivo: getClaimCauseData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Claim Cause not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateClaimCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateClaimCause' } });
        });
    }
});

const operationUpdateClaimCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccausasiniestro', 'xcausasiniestro', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let claimCauseData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ccausasiniestro: requestBody.ccausasiniestro,
        xcausasiniestro: requestBody.xcausasiniestro.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyClaimCauseName = await bd.verifyClaimCauseNameToUpdateQuery(claimCauseData).then((res) => res);
    if(verifyClaimCauseName.error){ return { status: false, code: 500, message: verifyClaimCauseName.error }; }
    if(verifyClaimCauseName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'claim-cause-name-already-exist'}; }
    else{
        let updateClaimCause = await bd.updateClaimCauseQuery(claimCauseData).then((res) => res);
        if(updateClaimCause.error){ return { status: false, code: 500, message: updateClaimCause.error }; }
        if(updateClaimCause.result.rowsAffected > 0){ return { status: true, ccausasiniestro: claimCauseData.ccausasiniestro }; }
        else{ return { status: false, code: 404, message: 'Claim Cause not found.' }; }
    }
}

module.exports = router;