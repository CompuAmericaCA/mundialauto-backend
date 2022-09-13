const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBusinessActivity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBusinessActivity' } });
        });
    }
});

const operationSearchBusinessActivity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xactividadempresa: requestBody.xactividadempresa ? requestBody.xactividadempresa.toUpperCase() : undefined
    };
    let searchBusinessActivity = await bd.searchBusinessActivityQuery(searchData).then((res) => res);
    if(searchBusinessActivity.error){ return  { status: false, code: 500, message: searchBusinessActivity.error }; }
    if(searchBusinessActivity.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBusinessActivity.result.recordset.length; i++){
            jsonList.push({
                cactividadempresa: searchBusinessActivity.result.recordset[i].CACTIVIDADEMPRESA,
                xactividadempresa: searchBusinessActivity.result.recordset[i].XACTIVIDADEMPRESA,
                bactivo: searchBusinessActivity.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Business Activity not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateBusinessActivity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateBusinessActivity' } });
        });
    }
});

const operationCreateBusinessActivity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xactividadempresa', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let businessActivityData = {
        cpais: requestBody.cpais,
        xactividadempresa: requestBody.xactividadempresa.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyBusinessActivityName = await bd.verifyBusinessActivityNameToCreateQuery(businessActivityData).then((res) => res);
    if(verifyBusinessActivityName.error){ return { status: false, code: 500, message: verifyBusinessActivityName.error }; }
    if(verifyBusinessActivityName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'business-activity-name-already-exist' }; }
    else{
        let createBusinessActivity = await bd.createBusinessActivityQuery(businessActivityData).then((res) => res);
        if(createBusinessActivity.error){ return { status: false, code: 500, message: createBusinessActivity.error }; }
        if(createBusinessActivity.result.rowsAffected > 0){ return { status: true, cactividadempresa: createBusinessActivity.result.recordset[0].CACTIVIDADEMPRESA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBusinessActivity' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailBusinessActivity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailBusinessActivity' } });
        });
    }
});

const operationDetailBusinessActivity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cactividadempresa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let businessActivityData = {
        cpais: requestBody.cpais,
        cactividadempresa: requestBody.cactividadempresa
    };
    let getBusinessActivityData = await bd.getBusinessActivityDataQuery(businessActivityData).then((res) => res);
    if(getBusinessActivityData.error){ return { status: false, code: 500, message: getBusinessActivityData.error }; }
    if(getBusinessActivityData.result.rowsAffected > 0){
        return {
            status: true,
            cactividadempresa: getBusinessActivityData.result.recordset[0].CACTIVIDADEMPRESA,
            xactividadempresa: getBusinessActivityData.result.recordset[0].XACTIVIDADEMPRESA,
            bactivo: getBusinessActivityData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Business Activity not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateBusinessActivity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateBusinessActivity' } });
        });
    }
});

const operationUpdateBusinessActivity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cactividadempresa', 'xactividadempresa', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let businessActivityData = {
        cpais: requestBody.cpais,
        cactividadempresa: requestBody.cactividadempresa,
        xactividadempresa: requestBody.xactividadempresa.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyBusinessActivityName = await bd.verifyBusinessActivityNameToUpdateQuery(businessActivityData).then((res) => res);
    if(verifyBusinessActivityName.error){ return { status: false, code: 500, message: verifyBusinessActivityName.error }; }
    if(verifyBusinessActivityName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'business-activity-name-already-exist'}; }
    else{
        let updateBusinessActivity = await bd.updateBusinessActivityQuery(businessActivityData).then((res) => res);
        if(updateBusinessActivity.error){ return { status: false, code: 500, message: updateBusinessActivity.error }; }
        if(updateBusinessActivity.result.rowsAffected > 0){ return { status: true, cactividadempresa: businessActivityData.cactividadempresa }; }
        else{ return { status: false, code: 404, message: 'Business Activity not found.' }; }
    }
}

module.exports = router;