const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchEnterprise(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchEnterprise' } });
        });
    }
});

const operationSearchEnterprise = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xrazonsocial: requestBody.xrazonsocial ? helper.encrypt(requestBody.xrazonsocial.toUpperCase()) : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined
    };
    let searchEnterprise = await bd.searchEnterpriseQuery(searchData).then((res) => res);
    if(searchEnterprise.error){ return  { status: false, code: 500, message: searchEnterprise.error }; }
    if(searchEnterprise.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchEnterprise.result.recordset.length; i++){
            jsonList.push({
                cempresa: searchEnterprise.result.recordset[i].CEMPRESA,
                xnombre: helper.decrypt(searchEnterprise.result.recordset[i].XNOMBRE),
                xrazonsocial: helper.decrypt(searchEnterprise.result.recordset[i].XRAZONSOCIAL),
                xdocidentidad: helper.decrypt(searchEnterprise.result.recordset[i].XDOCIDENTIDAD),
                bactivo: searchEnterprise.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Enterprise not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateEnterprise(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateEnterprise' } });
        });
    }
});

const operationCreateEnterprise = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xnombre', 'xrazonsocial', 'ctipodocidentidad', 'xdocidentidad', 'cestado', 'xtelefono', 'xdireccion', 'cciudad', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let enterpriseData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax.toUpperCase()) : undefined,
        xnombre:  helper.encrypt(requestBody.xnombre.toUpperCase()),
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xrazonsocial: helper.encrypt(requestBody.xrazonsocial.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono.toUpperCase()),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        cciudad: requestBody.cciudad,
        cestado: requestBody.cestado,
        xrutaimagen: requestBody.xrutaimagen ? requestBody.xrutaimagen : undefined,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyEnterpriseIdentification = await bd.verifyEnterpriseIdentificationToCreateQuery(enterpriseData).then((res) => res);
    if(verifyEnterpriseIdentification.error){ return { status: false, code: 500, message: verifyEnterpriseIdentification.error }; }
    if(verifyEnterpriseIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    else{
        let createEnterprise = await bd.createEnterpriseQuery(enterpriseData).then((res) => res);
        if(createEnterprise.error){ return { status: false, code: 500, message: createEnterprise.error }; }
        if(createEnterprise.result.rowsAffected > 0){ return { status: true, cempresa: createEnterprise.result.recordset[0].CEMPRESA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createEnterprise' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailEnterprise(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailEnterprise' } });
        });
    }
});

const operationDetailEnterprise = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cempresa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let enterpriseData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cempresa: requestBody.cempresa
    };
    let getEnterpriseData = await bd.getEnterpriseDataQuery(enterpriseData).then((res) => res);
    if(getEnterpriseData.error){ return { status: false, code: 500, message: getEnterpriseData.error }; }
    if(getEnterpriseData.result.rowsAffected > 0){
        return {
            status: true,
            cempresa: getEnterpriseData.result.recordset[0].CEMPRESA,
            xnombre: helper.decrypt(getEnterpriseData.result.recordset[0].XNOMBRE),
            xrazonsocial: helper.decrypt(getEnterpriseData.result.recordset[0].XRAZONSOCIAL),
            xfax: getEnterpriseData.result.recordset[0].XFAX ? helper.decrypt(getEnterpriseData.result.recordset[0].XFAX) : undefined,
            xrutaimagen: getEnterpriseData.result.recordset[0].XRUTAIMAGEN ? getEnterpriseData.result.recordset[0].XRUTAIMAGEN : undefined,
            ctipodocidentidad: getEnterpriseData.result.recordset[0].CTIPODOCIDENTIDAD,
            xdocidentidad: helper.decrypt(getEnterpriseData.result.recordset[0].XDOCIDENTIDAD),
            xtelefono: helper.decrypt(getEnterpriseData.result.recordset[0].XTELEFONO),
            xdireccion: helper.decrypt(getEnterpriseData.result.recordset[0].XDIRECCION),
            cestado: getEnterpriseData.result.recordset[0].CESTADO,
            cciudad: getEnterpriseData.result.recordset[0].CCIUDAD,
            bactivo: getEnterpriseData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Broker not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateEnterprise(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateEnterprise' } });
        });
    }
});

const operationUpdateEnterprise = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cempresa', 'xnombre', 'xrazonsocial', 'ctipodocidentidad', 'xdocidentidad', 'cestado', 'xtelefono', 'xdireccion', 'cciudad', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let enterpriseData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cempresa: requestBody.cempresa,
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax.toUpperCase()) : undefined,
        xnombre:  helper.encrypt(requestBody.xnombre.toUpperCase()),
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xrazonsocial: helper.encrypt(requestBody.xrazonsocial.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono.toUpperCase()),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        cciudad: requestBody.cciudad,
        cestado: requestBody.cestado,
        xrutaimagen: requestBody.xrutaimagen ? requestBody.xrutaimagen : undefined,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyEnterpriseIdentification = await bd.verifyEnterpriseIdentificationToUpdateQuery(enterpriseData).then((res) => res);
    if(verifyEnterpriseIdentification.error){ return { status: false, code: 500, message: verifyEnterpriseIdentification.error }; }
    if(verifyEnterpriseIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist'}; }
    else{
        let updateEnterprise = await bd.updateEnterpriseQuery(enterpriseData).then((res) => res);
        if(updateEnterprise.error){ return { status: false, code: 500, message: updateEnterprise.error }; }
        if(updateEnterprise.result.rowsAffected > 0){ return { status: true, cempresa: enterpriseData.cempresa }; }
        else{ return { status: false, code: 404, message: 'Enterprise not found.' }; }
    }
}

module.exports = router;