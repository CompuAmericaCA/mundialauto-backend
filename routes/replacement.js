const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchReplacement' } });
        });
    }
});

const operationSearchReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctiporepuesto: requestBody.ctiporepuesto ? requestBody.ctiporepuesto : undefined,
        xrepuesto: requestBody.xrepuesto ? requestBody.xrepuesto.toUpperCase() : undefined
    };
    let searchReplacement = await bd.searchReplacementQuery(searchData).then((res) => res);
    if(searchReplacement.error){ return  { status: false, code: 500, message: searchReplacement.error }; }
    if(searchReplacement.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchReplacement.result.recordset.length; i++){
            jsonList.push({
                crepuesto: searchReplacement.result.recordset[i].CREPUESTO,
                xrepuesto: searchReplacement.result.recordset[i].XREPUESTO,
                ctiporepuesto: searchReplacement.result.recordset[i].CTIPOREPUESTO,
                xtiporepuesto: searchReplacement.result.recordset[i].XTIPOREPUESTO,
                bactivo: searchReplacement.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Replacement not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateReplacement' } });
        });
    }
});

const operationCreateReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiporepuesto', 'xrepuesto', 'bizquierda', 'bderecha', 'bsuperior', 'binferior', 'bdelantero', 'btrasero', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let replacementData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xrepuesto: requestBody.xrepuesto.toUpperCase(),
        ctiporepuesto: requestBody.ctiporepuesto,
        bizquierda: requestBody.bizquierda,
        bderecha: requestBody.bderecha,
        bsuperior: requestBody.bsuperior,
        binferior: requestBody.binferior,
        bdelantero: requestBody.bdelantero,
        btrasero: requestBody.btrasero,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyReplacementName = await bd.verifyReplacementNameToCreateQuery(replacementData).then((res) => res);
    if(verifyReplacementName.error){ return { status: false, code: 500, message: verifyReplacementName.error }; }
    if(verifyReplacementName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'replacement-name-already-exist' }; }
    else{
        let createReplacement = await bd.createReplacementQuery(replacementData).then((res) => res);
        if(createReplacement.error){ return { status: false, code: 500, message: createReplacement.error }; }
        if(createReplacement.result.rowsAffected > 0){ return { status: true, crepuesto: createReplacement.result.recordset[0].CREPUESTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createReplacement' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailReplacement' } });
        });
    }
});

const operationDetailReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','crepuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let replacementData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        crepuesto: requestBody.crepuesto
    };
    let getReplacementData = await bd.getReplacementDataQuery(replacementData).then((res) => res);
    if(getReplacementData.error){ return { status: false, code: 500, message: getReplacementData.error }; }
    if(getReplacementData.result.rowsAffected > 0){
        return {
            status: true,
            crepuesto: getReplacementData.result.recordset[0].CREPUESTO,
            xrepuesto: getReplacementData.result.recordset[0].XREPUESTO,
            ctiporepuesto: getReplacementData.result.recordset[0].CTIPOREPUESTO,
            bizquierda: getReplacementData.result.recordset[0].BIZQUIERDA,
            bderecha: getReplacementData.result.recordset[0].BDERECHA,
            bsuperior: getReplacementData.result.recordset[0].BSUPERIOR,
            binferior: getReplacementData.result.recordset[0].BINFERIOR,
            bdelantero: getReplacementData.result.recordset[0].BDELANTERO,
            btrasero: getReplacementData.result.recordset[0].BTRASERO,
            bactivo: getReplacementData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Replacement not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateReplacement' } });
        });
    }
});

const operationUpdateReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'crepuesto', 'ctiporepuesto', 'xrepuesto', 'bizquierda', 'bderecha', 'bsuperior', 'binferior', 'bdelantero', 'btrasero', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let replacementData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        crepuesto: requestBody.crepuesto,
        xrepuesto: requestBody.xrepuesto.toUpperCase(),
        ctiporepuesto: requestBody.ctiporepuesto,
        bizquierda: requestBody.bizquierda,
        bderecha: requestBody.bderecha,
        bsuperior: requestBody.bsuperior,
        binferior: requestBody.binferior,
        bdelantero: requestBody.bdelantero,
        btrasero: requestBody.btrasero,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyReplacementName = await bd.verifyReplacementNameToUpdateQuery(replacementData).then((res) => res);
    if(verifyReplacementName.error){ return { status: false, code: 500, message: verifyReplacementName.error }; }
    if(verifyReplacementName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'replacement-name-already-exist'}; }
    else{
        let updateReplacement = await bd.updateReplacementQuery(replacementData).then((res) => res);
        if(updateReplacement.error){ return { status: false, code: 500, message: updateReplacement.error }; }
        if(updateReplacement.result.rowsAffected > 0){ return { status: true, crepuesto: replacementData.crepuesto }; }
        else{ return { status: false, code: 404, message: 'Replacement not found.' }; }
    }
}

module.exports = router;