const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCountry(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCountry' } });
        });
    }
});

const operationSearchCountry = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais ? requestBody.cpais : undefined,
        xpais: requestBody.xpais ? requestBody.xpais.toUpperCase() : undefined
    };
    let searchCountry = await bd.searchCountryQuery(searchData).then((res) => res);
    if(searchCountry.error){ return  { status: false, code: 500, message: searchCountry.error }; }
    if(searchCountry.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCountry.result.recordset.length; i++){
            jsonList.push({
                cpais: searchCountry.result.recordset[i].CPAIS,
                xpais: searchCountry.result.recordset[i].XPAIS,
                bactivo: searchCountry.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Country not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCountry(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCountry' } });
        });
    }
});

const operationCreateCountry = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xpais', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let countryData = {
        cpais: requestBody.cpais,
        xpais: requestBody.xpais.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCountryCode = await bd.verifyCountryCodeToCreateQuery(countryData.cpais).then((res) => res);
    if(verifyCountryCode.error){ return { status: false, code: 500, message: verifyCountryCode.error }; }
    if(verifyCountryCode.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'country-code-already-exist' }; }
    else{
        let verifyCountryName = await bd.verifyCountryNameToCreateQuery(countryData.xpais).then((res) => res);
        if(verifyCountryName.error){ return { status: false, code: 500, message: verifyCountryName.error }; }
        if(verifyCountryName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'country-name-already-exist' }; }
        else{
            let createCountry = await bd.createCountryQuery(countryData).then((res) => res);
            if(createCountry.error){ return { status: false, code: 500, message: createCountry.error }; }
            if(createCountry.result.rowsAffected > 0){ return { status: true, cpais: createCountry.result.recordset[0].CPAIS }; }
            else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCountry' }; }
        }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCountry(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCountry' } });
        });
    }
});

const operationDetailCountry = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cpais = requestBody.cpais;
    let getCountryData = await bd.getCountryDataQuery(cpais).then((res) => res);
    if(getCountryData.error){ return { status: false, code: 500, message: getCountryData.error }; }
    if(getCountryData.result.rowsAffected > 0){
        return {
            status: true,
            cpais: getCountryData.result.recordset[0].CPAIS,
            xpais: getCountryData.result.recordset[0].XPAIS,
            bactivo: getCountryData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Country not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCountry(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCountry' } });
        });
    }
});

const operationUpdateCountry = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xpais', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let countryData = {
        cpais: requestBody.cpais,
        xpais: requestBody.xpais.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    }
    let verifyCountryName = await bd.verifyCountryNameToUpdateQuery(countryData.cpais, countryData.xpais).then((res) => res);
    if(verifyCountryName.error){ return { status: false, code: 500, message: verifyCountryName.error }; }
    if(verifyCountryName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'country-name-already-exist'}; }
    else{
        let updateCountry = await bd.updateCountryQuery(countryData).then((res) => res);
        if(updateCountry.error){ return { status: false, code: 500, message: updateCountry.error }; }
        if(updateCountry.result.rowsAffected > 0){ return { status: true, cpais: countryData.cpais }; }
        else{ return { status: false, code: 404, message: 'Country not found.' }; }
    }
}

module.exports = router;