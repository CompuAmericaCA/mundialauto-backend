const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchAssociate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchAssociate' } });
        });
    }
});

const operationSearchAssociate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xasociado: requestBody.xasociado ? helper.encrypt(requestBody.xasociado.toUpperCase()) : undefined,
        ctipoasociado: requestBody.ctipoasociado ? requestBody.ctipoasociado : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        xrazonsocial: requestBody.xrazonsocial ? helper.encrypt(requestBody.xrazonsocial.toUpperCase()) : undefined
    };
    let searchAssociate = await bd.searchAssociateQuery(searchData).then((res) => res);
    if(searchAssociate.error){ return  { status: false, code: 500, message: searchAssociate.error }; }
    if(searchAssociate.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchAssociate.result.recordset.length; i++){
            jsonList.push({
                casociado: searchAssociate.result.recordset[i].CASOCIADO,
                ctipoasociado: searchAssociate.result.recordset[i].CTIPOASOCIADO,
                xtipoasociado: searchAssociate.result.recordset[i].XTIPOASOCIADO,
                ctipodocidentidad: searchAssociate.result.recordset[i].CTIPODOCIDENTIDAD,
                xasociado: helper.decrypt(searchAssociate.result.recordset[i].XASOCIADO),
                xdocidentidad: helper.decrypt(searchAssociate.result.recordset[i].XDOCIDENTIDAD),
                xrazonsocial: helper.decrypt(searchAssociate.result.recordset[i].XRAZONSOCIAL),
                bactivo: searchAssociate.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Associate not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateAssociate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateAssociate' } });
        });
    }
});

const operationCreateAssociate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xasociado', 'ctipoasociado', 'ctipodocidentidad', 'xdocidentidad', 'xrazonsocial', 'xtelefono', 'xdireccion', 'fbaja', 'xobservacion', 'baseguradora', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let associateData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax.toUpperCase()) : undefined,
        xasociado:  helper.encrypt(requestBody.xasociado.toUpperCase()),
        ctipoasociado: requestBody.ctipoasociado,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xrazonsocial: helper.encrypt(requestBody.xrazonsocial.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        xobservacion: helper.encrypt(requestBody.xobservacion.toUpperCase()),
        fbaja: requestBody.fbaja,
        baseguradora: requestBody.baseguradora,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyAssociateName = await bd.verifyAssociateNameToCreateQuery(associateData).then((res) => res);
    if(verifyAssociateName.error){ return { status: false, code: 500, message: verifyAssociateName.error }; }
    if(verifyAssociateName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-name-already-exist' }; }
    else{
        let createAssociate = await bd.createAssociateQuery(associateData).then((res) => res);
        if(createAssociate.error){ return { status: false, code: 500, message: createAssociate.error }; }
        if(createAssociate.result.rowsAffected > 0){ return { status: true, casociado: createAssociate.result.recordset[0].CASOCIADO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createAssociate' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailAssociate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailAssociate' } });
        });
    }
});

const operationDetailAssociate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','casociado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let associateData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        casociado: requestBody.casociado
    };
    let getAssociateData = await bd.getAssociateDataQuery(associateData).then((res) => res);
    if(getAssociateData.error){ return { status: false, code: 500, message: getAssociateData.error }; }
    if(getAssociateData.result.rowsAffected > 0){
        return {
            status: true,
            casociado: getAssociateData.result.recordset[0].CASOCIADO,
            xasociado: helper.decrypt(getAssociateData.result.recordset[0].XASOCIADO),
            ctipoasociado: getAssociateData.result.recordset[0].CTIPOASOCIADO,
            xfax: getAssociateData.result.recordset[0].XFAX ? helper.decrypt(getAssociateData.result.recordset[0].XFAX) : undefined,
            ctipodocidentidad: getAssociateData.result.recordset[0].CTIPODOCIDENTIDAD,
            xdocidentidad: helper.decrypt(getAssociateData.result.recordset[0].XDOCIDENTIDAD),
            xrazonsocial: helper.decrypt(getAssociateData.result.recordset[0].XRAZONSOCIAL),
            xtelefono: helper.decrypt(getAssociateData.result.recordset[0].XTELEFONO),
            xdireccion: helper.decrypt(getAssociateData.result.recordset[0].XDIRECCION),
            xobservacion: helper.decrypt(getAssociateData.result.recordset[0].XOBSERVACION),
            fbaja: getAssociateData.result.recordset[0].FBAJA,
            baseguradora: getAssociateData.result.recordset[0].BASEGURADORA,
            bactivo: getAssociateData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Associate not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateAssociate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateAssociate' } });
        });
    }
});

const operationUpdateAssociate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'casociado', 'xasociado', 'ctipoasociado', 'ctipodocidentidad', 'xdocidentidad', 'xrazonsocial', 'xtelefono', 'xdireccion', 'fbaja', 'xobservacion', 'baseguradora', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let associateData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        casociado: requestBody.casociado,
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax.toUpperCase()) : undefined,
        xasociado:  helper.encrypt(requestBody.xasociado.toUpperCase()),
        ctipoasociado: requestBody.ctipoasociado,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xrazonsocial: helper.encrypt(requestBody.xrazonsocial.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        xobservacion: helper.encrypt(requestBody.xobservacion.toUpperCase()),
        fbaja: requestBody.fbaja,
        baseguradora: requestBody.baseguradora,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyAssociateName = await bd.verifyAssociateNameToUpdateQuery(associateData).then((res) => res);
    if(verifyAssociateName.error){ return { status: false, code: 500, message: verifyAssociateName.error }; }
    if(verifyAssociateName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-name-already-exist'}; }
    else{
        let updateAssociate = await bd.updateAssociateQuery(associateData).then((res) => res);
        if(updateAssociate.error){ return { status: false, code: 500, message: updateAssociate.error }; }
        if(updateAssociate.result.rowsAffected > 0){ return { status: true, casociado: associateData.casociado }; }
        else{ return { status: false, code: 404, message: 'Associate not found.' }; }
    }
}

module.exports = router;