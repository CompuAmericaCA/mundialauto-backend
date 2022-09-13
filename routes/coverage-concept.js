const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCoverageConcept(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCoverageConcept' } });
        });
    }
});

const operationSearchCoverageConcept = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xconceptocobertura: requestBody.xconceptocobertura ? requestBody.xconceptocobertura.toUpperCase() : undefined
    };
    let searchCoverageConcept = await bd.searchCoverageConceptQuery(searchData).then((res) => res);
    if(searchCoverageConcept.error){ return  { status: false, code: 500, message: searchCoverageConcept.error }; }
    if(searchCoverageConcept.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCoverageConcept.result.recordset.length; i++){
            jsonList.push({
                cconceptocobertura: searchCoverageConcept.result.recordset[i].CCONCEPTOCOBERTURA,
                xconceptocobertura: searchCoverageConcept.result.recordset[i].XCONCEPTOCOBERTURA,
                bactivo: searchCoverageConcept.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coverage Concept not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCoverageConcept(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCoverageConcept' } });
        });
    }
});

const operationCreateCoverageConcept = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xconceptocobertura', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let coverageConceptData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xconceptocobertura: requestBody.xconceptocobertura.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCoverageConceptName = await bd.verifyCoverageConceptNameToCreateQuery(coverageConceptData).then((res) => res);
    if(verifyCoverageConceptName.error){ return { status: false, code: 500, message: verifyCoverageConceptName.error }; }
    if(verifyCoverageConceptName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'coverage-concept-name-already-exist' }; }
    else{
        let createCoverageConcept = await bd.createCoverageConceptQuery(coverageConceptData).then((res) => res);
        if(createCoverageConcept.error){ return { status: false, code: 500, message: createCoverageConcept.error }; }
        if(createCoverageConcept.result.rowsAffected > 0){ return { status: true, cconceptocobertura: createCoverageConcept.result.recordset[0].CCONCEPTOCOBERTURA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCoverageConcept' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCoverageConcept(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCoverageConcept' } });
        });
    }
});

const operationDetailCoverageConcept = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cconceptocobertura'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let coverageConceptData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cconceptocobertura: requestBody.cconceptocobertura
    };
    let getCoverageConceptData = await bd.getCoverageConceptDataQuery(coverageConceptData).then((res) => res);
    if(getCoverageConceptData.error){ return { status: false, code: 500, message: getCoverageConceptData.error }; }
    if(getCoverageConceptData.result.rowsAffected > 0){
        return {
            status: true,
            cconceptocobertura: getCoverageConceptData.result.recordset[0].CCONCEPTOCOBERTURA,
            xconceptocobertura: getCoverageConceptData.result.recordset[0].XCONCEPTOCOBERTURA,
            bactivo: getCoverageConceptData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Coverage Concept not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCoverageConcept(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCoverageConcept' } });
        });
    }
});

const operationUpdateCoverageConcept = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cconceptocobertura', 'xconceptocobertura', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let coverageConceptData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cconceptocobertura: requestBody.cconceptocobertura,
        xconceptocobertura: requestBody.xconceptocobertura.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyCoverageConceptName = await bd.verifyCoverageConceptNameToUpdateQuery(coverageConceptData).then((res) => res);
    if(verifyCoverageConceptName.error){ return { status: false, code: 500, message: verifyCoverageConceptName.error }; }
    if(verifyCoverageConceptName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'coverage-concept-name-already-exist'}; }
    else{
        let updateCoverageConcept = await bd.updateCoverageConceptQuery(coverageConceptData).then((res) => res);
        if(updateCoverageConcept.error){ return { status: false, code: 500, message: updateCoverageConcept.error }; }
        if(updateCoverageConcept.result.rowsAffected > 0){ return { status: true, cconceptocobertura: coverageConceptData.cconceptocobertura }; }
        else{ return { status: false, code: 404, message: 'Coverage Concept not found.' }; }
    }
}

module.exports = router;