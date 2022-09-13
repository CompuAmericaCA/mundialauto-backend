const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBankAccountType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBankAccountType' } });
        });
    }
});

const operationSearchBankAccountType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xtipocuentabancaria: requestBody.xtipocuentabancaria ? requestBody.xtipocuentabancaria.toUpperCase() : undefined
    };
    let searchBankAccountType = await bd.searchBankAccountTypeQuery(searchData).then((res) => res);
    if(searchBankAccountType.error){ return  { status: false, code: 500, message: searchBankAccountType.error }; }
    if(searchBankAccountType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBankAccountType.result.recordset.length; i++){
            jsonList.push({
                ctipocuentabancaria: searchBankAccountType.result.recordset[i].CTIPOCUENTABANCARIA,
                xtipocuentabancaria: searchBankAccountType.result.recordset[i].XTIPOCUENTABANCARIA,
                bactivo: searchBankAccountType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Bank Account Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateBankAccountType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateBankAccountType' } });
        });
    }
});

const operationCreateBankAccountType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xtipocuentabancaria', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let bankAccountTypeData = {
        cpais: requestBody.cpais,
        xtipocuentabancaria: requestBody.xtipocuentabancaria.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyBankAccountTypeName = await bd.verifyBankAccountTypeNameToCreateQuery(bankAccountTypeData).then((res) => res);
    if(verifyBankAccountTypeName.error){ return { status: false, code: 500, message: verifyBankAccountTypeName.error }; }
    if(verifyBankAccountTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'bank-account-type-name-already-exist' }; }
    else{
        let createBankAccountType = await bd.createBankAccountTypeQuery(bankAccountTypeData).then((res) => res);
        if(createBankAccountType.error){ return { status: false, code: 500, message: createBankAccountType.error }; }
        if(createBankAccountType.result.rowsAffected > 0){ return { status: true, ctipocuentabancaria: createBankAccountType.result.recordset[0].CTIPOCUENTABANCARIA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBankAccountType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailBankAccountType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailBankAccountType' } });
        });
    }
});

const operationDetailBankAccountType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ctipocuentabancaria'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let bankAccountTypeData = {
        cpais: requestBody.cpais,
        ctipocuentabancaria: requestBody.ctipocuentabancaria
    };
    let getBankAccountTypeData = await bd.getBankAccountTypeDataQuery(bankAccountTypeData).then((res) => res);
    if(getBankAccountTypeData.error){ return { status: false, code: 500, message: getBankAccountTypeData.error }; }
    if(getBankAccountTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipocuentabancaria: getBankAccountTypeData.result.recordset[0].CTIPOCUENTABANCARIA,
            xtipocuentabancaria: getBankAccountTypeData.result.recordset[0].XTIPOCUENTABANCARIA,
            bactivo: getBankAccountTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Bank Account Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateBankAccountType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateBankAccountType' } });
        });
    }
});

const operationUpdateBankAccountType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ctipocuentabancaria', 'xtipocuentabancaria', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let bankAccountTypeData = {
        cpais: requestBody.cpais,
        ctipocuentabancaria: requestBody.ctipocuentabancaria,
        xtipocuentabancaria: requestBody.xtipocuentabancaria.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyBankAccountTypeName = await bd.verifyBankAccountTypeNameToUpdateQuery(bankAccountTypeData).then((res) => res);
    if(verifyBankAccountTypeName.error){ return { status: false, code: 500, message: verifyBankAccountTypeName.error }; }
    if(verifyBankAccountTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'bank-account-type-name-already-exist'}; }
    else{
        let updateBankAccountType = await bd.updateBankAccountTypeQuery(bankAccountTypeData).then((res) => res);
        if(updateBankAccountType.error){ return { status: false, code: 500, message: updateBankAccountType.error }; }
        if(updateBankAccountType.result.rowsAffected > 0){ return { status: true, ctipocuentabancaria: bankAccountTypeData.ctipocuentabancaria }; }
        else{ return { status: false, code: 404, message: 'Bank Account Type not found.' }; }
    }
}

module.exports = router;