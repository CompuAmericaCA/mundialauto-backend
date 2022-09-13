const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCompany(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCompany' } });
        });
    }
});

const operationSearchCompany = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xcompania: requestBody.xcompania ? requestBody.xcompania.toUpperCase() : undefined
    };
    let searchCompany = await bd.searchCompanyQuery(searchData).then((res) => res);
    if(searchCompany.error){ return  { status: false, code: 500, message: searchCompany.error }; }
    if(searchCompany.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCompany.result.recordset.length; i++){
            jsonList.push({
                ccompania: searchCompany.result.recordset[i].CCOMPANIA,
                xcompania: searchCompany.result.recordset[i].XCOMPANIA,
                bactivo: searchCompany.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Company not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCompany(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCompany' } });
        });
    }
});

const operationCreateCompany = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xcompania', 'xcolornav', 'xtemanav', 'xcolorprimario', 'xcolorsegundario', 'xcolorterciario', 'xcolortexto', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let companyData = {
        xcompania: requestBody.xcompania.toUpperCase(),
        xcolornav: requestBody.xcolornav,
        xtemanav: requestBody.xtemanav,
        xcolorprimario: requestBody.xcolorprimario,
        xcolorsegundario: requestBody.xcolorsegundario,
        xcolorterciario: requestBody.xcolorterciario,
        xcolortexto: requestBody.xcolortexto,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCompanyName = await bd.verifyCompanyNameToCreateQuery(companyData.xcompania).then((res) => res);
    if(verifyCompanyName.error){ return { status: false, code: 500, message: verifyCompanyName.error }; }
    if(verifyCompanyName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'company-name-already-exist' }; }
    else{
        let createCompany = await bd.createCompanyQuery(companyData).then((res) => res);
        if(createCompany.error){ return { status: false, code: 500, message: createCompany.error }; }
        if(createCompany.result.rowsAffected > 0){ return { status: true, ccompania: createCompany.result.recordset[0].CCOMPANIA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCompany' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCompany(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCompany' } });
        });
    }
});

const operationDetailCompany = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let ccompania = requestBody.ccompania;
    let getCompanyData = await bd.getCompanyDataQuery(ccompania).then((res) => res);
    if(getCompanyData.error){ return { status: false, code: 500, message: getCompanyData.error }; }
    if(getCompanyData.result.rowsAffected > 0){
        return {
            status: true,
            ccompania: getCompanyData.result.recordset[0].CCOMPANIA,
            xcompania: getCompanyData.result.recordset[0].XCOMPANIA,
            xcolornav: getCompanyData.result.recordset[0].XCOLORNAV,
            xtemanav: getCompanyData.result.recordset[0].XTEMANAV,
            xcolorprimario: getCompanyData.result.recordset[0].XCOLORPRIMARIO,
            xcolorsegundario: getCompanyData.result.recordset[0].XCOLORSEGUNDARIO,
            xcolorterciario: getCompanyData.result.recordset[0].XCOLORTERCIARIO,
            xcolortexto: getCompanyData.result.recordset[0].XCOLORTEXTO,
            bactivo: getCompanyData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Company not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCompany(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCompany' } });
        });
    }
});

const operationUpdateCompany = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccompania', 'xcompania', 'xcolornav', 'xtemanav', 'xcolorprimario', 'xcolorsegundario', 'xcolorterciario', 'xcolortexto', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let companyData = {
        ccompania: requestBody.ccompania,
        xcompania: requestBody.xcompania.toUpperCase(),
        xcolornav: requestBody.xcolornav,
        xtemanav: requestBody.xtemanav,
        xcolorprimario: requestBody.xcolorprimario,
        xcolorsegundario: requestBody.xcolorsegundario,
        xcolorterciario: requestBody.xcolorterciario,
        xcolortexto: requestBody.xcolortexto,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyCompanyName = await bd.verifyCompanyNameToUpdateQuery(companyData.ccompania, companyData.xcompania).then((res) => res);
    if(verifyCompanyName.error){ return { status: false, code: 500, message: verifyCompanyName.error }; }
    if(verifyCompanyName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'company-name-already-exist'}; }
    else{
        let updateCompany = await bd.updateCompanyQuery(companyData).then((res) => res);
        if(updateCompany.error){ return { status: false, code: 500, message: updateCompany.error }; }
        if(updateCompany.result.rowsAffected > 0){ return { status: true, ccompania: companyData.ccompania }; }
        else{ return { status: false, code: 404, message: 'Company not found.' }; }
    }
}

module.exports = router;