const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchState(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchState' } });
        });
    }
});

const operationSearchState = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xestado: requestBody.xestado ? requestBody.xestado.toUpperCase() : undefined
    };
    let searchState = await bd.searchStateQuery(searchData).then((res) => res);
    if(searchState.error){ return  { status: false, code: 500, message: searchState.error }; }
    if(searchState.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchState.result.recordset.length; i++){
            jsonList.push({
                cestado: searchState.result.recordset[i].CESTADO,
                xestado: searchState.result.recordset[i].XESTADO,
                bactivo: searchState.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'State not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateState(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateState' } });
        });
    }
});

const operationCreateState = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xestado', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let stateData = {
        cpais: requestBody.cpais,
        xestado: requestBody.xestado.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyStateName = await bd.verifyStateNameToCreateQuery(stateData).then((res) => res);
    if(verifyStateName.error){ return { status: false, code: 500, message: verifyStateName.error }; }
    if(verifyStateName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'state-name-already-exist' }; }
    else{
        let createState = await bd.createStateQuery(stateData).then((res) => res);
        if(createState.error){ return { status: false, code: 500, message: createState.error }; }
        if(createState.result.rowsAffected > 0){ return { status: true, cestado: createState.result.recordset[0].CESTADO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createState' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailState(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailState' } });
        });
    }
});

const operationDetailState = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cestado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let stateData = {
        cpais: requestBody.cpais,
        cestado: requestBody.cestado
    };
    let getStateData = await bd.getStateDataQuery(stateData).then((res) => res);
    if(getStateData.error){ return { status: false, code: 500, message: getStateData.error }; }
    if(getStateData.result.rowsAffected > 0){
        return {
            status: true,
            cestado: getStateData.result.recordset[0].CESTADO,
            xestado: getStateData.result.recordset[0].XESTADO,
            bactivo: getStateData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'State not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateState(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateState' } });
        });
    }
});

const operationUpdateState = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cestado', 'xestado', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let stateData = {
        cpais: requestBody.cpais,
        cestado: requestBody.cestado,
        xestado: requestBody.xestado.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyStateName = await bd.verifyStateNameToUpdateQuery(stateData).then((res) => res);
    if(verifyStateName.error){ return { status: false, code: 500, message: verifyStateName.error }; }
    if(verifyStateName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'state-name-already-exist'}; }
    else{
        let updateState = await bd.updateStateQuery(stateData).then((res) => res);
        if(updateState.error){ return { status: false, code: 500, message: updateState.error }; }
        if(updateState.result.rowsAffected > 0){ return { status: true, cestado: stateData.cestado }; }
        else{ return { status: false, code: 404, message: 'State not found.' }; }
    }
}

module.exports = router;