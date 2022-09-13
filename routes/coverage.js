const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCoverage' } });
        });
    }
});

const operationSearchCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xcobertura: requestBody.xcobertura ? requestBody.xcobertura.toUpperCase() : undefined
    };
    let searchCoverage = await bd.searchCoverageQuery(searchData).then((res) => res);
    if(searchCoverage.error){ return  { status: false, code: 500, message: searchCoverage.error }; }
    if(searchCoverage.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCoverage.result.recordset.length; i++){
            jsonList.push({
                ccobertura: searchCoverage.result.recordset[i].CCOBERTURA,
                xcobertura: searchCoverage.result.recordset[i].XCOBERTURA,
                bactivo: searchCoverage.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coverage not found.' }; }
} 

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCoverage' } });
        });
    }
});

const operationCreateCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xcobertura', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let coverageData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xcobertura: requestBody.xcobertura.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCoverageName = await bd.verifyCoverageNameToCreateQuery(coverageData).then((res) => res);
    if(verifyCoverageName.error){ return { status: false, code: 500, message: verifyCoverageName.error }; }
    if(verifyCoverageName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'coverage-name-already-exist' }; }
    else{
        let createCoverage = await bd.createCoverageQuery(coverageData).then((res) => res);
        if(createCoverage.error){ return { status: false, code: 500, message: createCoverage.error }; }
        if(createCoverage.result.rowsAffected > 0){ return { status: true, ccobertura: createCoverage.result.recordset[0].CCOBERTURA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCoverage' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCoverage' } });
        });
    }
});

const operationDetailCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ccobertura'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let coverageData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccobertura: requestBody.ccobertura
    };
    let getCoverageData = await bd.getCoverageDataQuery(coverageData).then((res) => res);
    if(getCoverageData.error){ return { status: false, code: 500, message: getCoverageData.error }; }
    if(getCoverageData.result.rowsAffected > 0){
        return {
            status: true,
            ccobertura: getCoverageData.result.recordset[0].CCOBERTURA,
            xcobertura: getCoverageData.result.recordset[0].XCOBERTURA,
            bactivo: getCoverageData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Coverage not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCoverage' } });
        });
    }
});

const operationUpdateCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccobertura', 'xcobertura', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let coverageData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ccobertura: requestBody.ccobertura,
        xcobertura: requestBody.xcobertura.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyCoverageName = await bd.verifyCoverageNameToUpdateQuery(coverageData).then((res) => res);
    if(verifyCoverageName.error){ return { status: false, code: 500, message: verifyCoverageName.error }; }
    if(verifyCoverageName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'coverage-name-already-exist'}; }
    else{
        let updateCoverage = await bd.updateCoverageQuery(coverageData).then((res) => res);
        if(updateCoverage.error){ return { status: false, code: 500, message: updateCoverage.error }; }
        if(updateCoverage.result.rowsAffected > 0){ return { status: true, ccobertura: coverageData.ccobertura }; }
        else{ return { status: false, code: 404, message: 'Coverage not found.' }; }
    }
}

module.exports = router;