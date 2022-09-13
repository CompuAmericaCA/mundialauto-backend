const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchPenalty(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPenalty' } });
        });
    }
});

const operationSearchPenalty = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xpenalizacion: requestBody.xpenalizacion ? requestBody.xpenalizacion.toUpperCase() : undefined
    };
    let searchPenalty = await bd.searchPenaltyQuery(searchData).then((res) => res);
    if(searchPenalty.error){ return  { status: false, code: 500, message: searchPenalty.error }; }
    if(searchPenalty.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchPenalty.result.recordset.length; i++){
            jsonList.push({
                cpenalizacion: searchPenalty.result.recordset[i].CPENALIZACION,
                xpenalizacion: searchPenalty.result.recordset[i].XPENALIZACION,
                bactivo: searchPenalty.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Penalty not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreatePenalty(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePenalty' } });
        });
    }
});

const operationCreatePenalty = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xpenalizacion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let penaltyData = {
        cpais: requestBody.cpais,
        xpenalizacion: requestBody.xpenalizacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyPenaltyName = await bd.verifyPenaltyNameToCreateQuery(penaltyData).then((res) => res);
    if(verifyPenaltyName.error){ return { status: false, code: 500, message: verifyPenaltyName.error }; }
    if(verifyPenaltyName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'penalty-name-already-exist' }; }
    else{
        let createPenalty = await bd.createPenaltyQuery(penaltyData).then((res) => res);
        if(createPenalty.error){ return { status: false, code: 500, message: createPenalty.error }; }
        if(createPenalty.result.rowsAffected > 0){ return { status: true, cpenalizacion: createPenalty.result.recordset[0].CPENALIZACION }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPenalty' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailPenalty(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPenalty' } });
        });
    }
});

const operationDetailPenalty = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cpenalizacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let penaltyData = {
        cpais: requestBody.cpais,
        cpenalizacion: requestBody.cpenalizacion
    };
    let getPenaltyData = await bd.getPenaltyDataQuery(penaltyData).then((res) => res);
    if(getPenaltyData.error){ return { status: false, code: 500, message: getPenaltyData.error }; }
    if(getPenaltyData.result.rowsAffected > 0){
        return {
            status: true,
            cpenalizacion: getPenaltyData.result.recordset[0].CPENALIZACION,
            xpenalizacion: getPenaltyData.result.recordset[0].XPENALIZACION,
            bactivo: getPenaltyData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Penalty not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdatePenalty(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdatePenalty' } });
        });
    }
});

const operationUpdatePenalty = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cpenalizacion', 'xpenalizacion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let penaltyData = {
        cpais: requestBody.cpais,
        cpenalizacion: requestBody.cpenalizacion,
        xpenalizacion: requestBody.xpenalizacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyPenaltyName = await bd.verifyPenaltyNameToUpdateQuery(penaltyData).then((res) => res);
    if(verifyPenaltyName.error){ return { status: false, code: 500, message: verifyPenaltyName.error }; }
    if(verifyPenaltyName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'penalty-name-already-exist'}; }
    else{
        let updatePenalty = await bd.updatePenaltyQuery(penaltyData).then((res) => res);
        if(updatePenalty.error){ return { status: false, code: 500, message: updatePenalty.error }; }
        if(updatePenalty.result.rowsAffected > 0){ return { status: true, cpenalizacion: penaltyData.cpenalizacion }; }
        else{ return { status: false, code: 404, message: 'Penalty not found.' }; }
    }
}

module.exports = router;

