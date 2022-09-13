const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchGeneralStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchGeneralStatus' } });
        });
    }
});

const operationSearchGeneralStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xestatusgeneral: requestBody.xestatusgeneral ? requestBody.xestatusgeneral.toUpperCase() : undefined
    };
    let searchGeneralStatus = await bd.searchGeneralStatusQuery(searchData).then((res) => res);
    if(searchGeneralStatus.error){ return  { status: false, code: 500, message: searchGeneralStatus.error }; }
    if(searchGeneralStatus.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchGeneralStatus.result.recordset.length; i++){
            jsonList.push({
                cestatusgeneral: searchGeneralStatus.result.recordset[i].CESTATUSGENERAL,
                xestatusgeneral: searchGeneralStatus.result.recordset[i].XESTATUSGENERAL,
                bactivo: searchGeneralStatus.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'General Status not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateGeneralStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateGeneralStatus' } });
        });
    }
});

const operationCreateGeneralStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xestatusgeneral', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let generalStatusData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xestatusgeneral: requestBody.xestatusgeneral.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyGeneralStatusName = await bd.verifyGeneralStatusNameToCreateQuery(generalStatusData).then((res) => res);
    if(verifyGeneralStatusName.error){ return { status: false, code: 500, message: verifyGeneralStatusName.error }; }
    if(verifyGeneralStatusName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'general-status-name-already-exist' }; }
    else{
        let createGeneralStatus = await bd.createGeneralStatusQuery(generalStatusData).then((res) => res);
        if(createGeneralStatus.error){ return { status: false, code: 500, message: createGeneralStatus.error }; }
        if(createGeneralStatus.result.rowsAffected > 0){ return { status: true, cestatusgeneral: createGeneralStatus.result.recordset[0].CESTATUSGENERAL }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createGeneralStatus' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailGeneralStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailGeneralStatus' } });
        });
    }
});

const operationDetailGeneralStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cestatusgeneral'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let generalStatusData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cestatusgeneral: requestBody.cestatusgeneral
    };
    let getGeneralStatusData = await bd.getGeneralStatusDataQuery(generalStatusData).then((res) => res);
    if(getGeneralStatusData.error){ return { status: false, code: 500, message: getGeneralStatusData.error }; }
    if(getGeneralStatusData.result.rowsAffected > 0){
        return {
            status: true,
            cestatusgeneral: getGeneralStatusData.result.recordset[0].CESTATUSGENERAL,
            xestatusgeneral: getGeneralStatusData.result.recordset[0].XESTATUSGENERAL,
            bactivo: getGeneralStatusData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'General Status not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateGeneralStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateGeneralStatus' } });
        });
    }
});

const operationUpdateGeneralStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cestatusgeneral', 'xestatusgeneral', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let generalStatusData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cestatusgeneral: requestBody.cestatusgeneral,
        xestatusgeneral: requestBody.xestatusgeneral.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyGeneralStatusName = await bd.verifyGeneralStatusNameToUpdateQuery(generalStatusData).then((res) => res);
    if(verifyGeneralStatusName.error){ return { status: false, code: 500, message: verifyGeneralStatusName.error }; }
    if(verifyGeneralStatusName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'general-status-name-already-exist'}; }
    else{
        let updateGeneralStatus = await bd.updateGeneralStatusQuery(generalStatusData).then((res) => res);
        if(updateGeneralStatus.error){ return { status: false, code: 500, message: updateGeneralStatus.error }; }
        if(updateGeneralStatus.result.rowsAffected > 0){ return { status: true, cestatusgeneral: generalStatusData.cestatusgeneral }; }
        else{ return { status: false, code: 404, message: 'General Status not found.' }; }
    }
}

module.exports = router;