const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBank' } });
        });
    }
});

const operationSearchBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xbanco: requestBody.xbanco ? requestBody.xbanco.toUpperCase() : undefined
    };
    let searchBank = await bd.searchBankQuery(searchData).then((res) => res);
    if(searchBank.error){ return  { status: false, code: 500, message: searchBank.error }; }
    if(searchBank.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBank.result.recordset.length; i++){
            jsonList.push({
                cbanco: searchBank.result.recordset[i].CBANCO,
                xbanco: searchBank.result.recordset[i].XBANCO,
                bactivo: searchBank.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Bank not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateBank' } });
        });
    }
});

const operationCreateBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xbanco', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let bankData = {
        cpais: requestBody.cpais,
        xbanco: requestBody.xbanco.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyBankName = await bd.verifyBankNameToCreateQuery(bankData).then((res) => res);
    if(verifyBankName.error){ return { status: false, code: 500, message: verifyBankName.error }; }
    if(verifyBankName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'bank-name-already-exist' }; }
    else{
        let createBank = await bd.createBankQuery(bankData).then((res) => res);
        if(createBank.error){ return { status: false, code: 500, message: createBank.error }; }
        if(createBank.result.rowsAffected > 0){ return { status: true, cbanco: createBank.result.recordset[0].CBANCO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBank' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailBank' } });
        });
    }
});

const operationDetailBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cbanco'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let bankData = {
        cpais: requestBody.cpais,
        cbanco: requestBody.cbanco
    };
    let getBankData = await bd.getBankDataDataQuery(bankData).then((res) => res);
    if(getBankData.error){ return { status: false, code: 500, message: getBankData.error }; }
    if(getBankData.result.rowsAffected > 0){
        return {
            status: true,
            cbanco: getBankData.result.recordset[0].CBANCO,
            xbanco: getBankData.result.recordset[0].XBANCO,
            bactivo: getBankData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Bank not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateBank' } });
        });
    }
});

const operationUpdateBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cbanco', 'xbanco', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let bankData = {
        cpais: requestBody.cpais,
        cbanco: requestBody.cbanco,
        xbanco: requestBody.xbanco.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyBankName = await bd.verifyBankNameToUpdateQuery(bankData).then((res) => res);
    if(verifyBankName.error){ return { status: false, code: 500, message: verifyBankName.error }; }
    if(verifyBankName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'bank-name-already-exist'}; }
    else{
        let updateBank = await bd.updateBankQuery(bankData).then((res) => res);
        if(updateBank.error){ return { status: false, code: 500, message: updateBank.error }; }
        if(updateBank.result.rowsAffected > 0){ return { status: true, cbanco: bankData.cbanco }; }
        else{ return { status: false, code: 404, message: 'Bank not found.' }; }
    }
}

module.exports = router;