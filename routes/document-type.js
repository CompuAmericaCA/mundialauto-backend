const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchDocumentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchDocumentType' } });
        });
    }
});

const operationSearchDocumentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xtipodocidentidad: requestBody.xtipodocidentidad ? requestBody.xtipodocidentidad.toUpperCase() : undefined,
        xdescripcion: requestBody.xdescripcion ? requestBody.xdescripcion.toUpperCase() : undefined
    };
    let searchDocumentType = await bd.searchDocumentTypeQuery(searchData).then((res) => res);
    if(searchDocumentType.error){ return  { status: false, code: 500, message: searchDocumentType.error }; }
    if(searchDocumentType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchDocumentType.result.recordset.length; i++){
            jsonList.push({
                ctipodocidentidad: searchDocumentType.result.recordset[i].CTIPODOCIDENTIDAD,
                xtipodocidentidad: searchDocumentType.result.recordset[i].XTIPODOCIDENTIDAD,
                xdescripcion: searchDocumentType.result.recordset[i].XDESCRIPCION,
                bactivo: searchDocumentType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'DocumentType not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateDocumentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateDocumentType' } });
        });
    }
});

const operationCreateDocumentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xtipodocidentidad', 'xdescripcion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let documentTypeData = {
        cpais: requestBody.cpais,
        xtipodocidentidad: requestBody.xtipodocidentidad.toUpperCase(),
        xdescripcion: requestBody.xdescripcion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyDocumentTypeName = await bd.verifyDocumentTypeNameToCreateQuery(documentTypeData).then((res) => res);
    if(verifyDocumentTypeName.error){ return { status: false, code: 500, message: verifyDocumentTypeName.error }; }
    if(verifyDocumentTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'document-type-name-already-exist' }; }
    else{
        let createDocumentType = await bd.createDocumentTypeQuery(documentTypeData).then((res) => res);
        if(createDocumentType.error){ return { status: false, code: 500, message: createDocumentType.error }; }
        if(createDocumentType.result.rowsAffected > 0){ return { status: true, ctipodocidentidad: createDocumentType.result.recordset[0].CTIPODOCIDENTIDAD }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDocumentType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailDocumentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailDocumentType' } });
        });
    }
});

const operationDetailDocumentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ctipodocidentidad'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let documentTypeData = {
        cpais: requestBody.cpais,
        ctipodocidentidad: requestBody.ctipodocidentidad
    };
    let getDocumentTypeData = await bd.getDocumentTypeDataQuery(documentTypeData).then((res) => res);
    if(getDocumentTypeData.error){ return { status: false, code: 500, message: getDocumentTypeData.error }; }
    if(getDocumentTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipodocidentidad: getDocumentTypeData.result.recordset[0].CTIPODOCIDENTIDAD,
            xtipodocidentidad: getDocumentTypeData.result.recordset[0].XTIPODOCIDENTIDAD,
            xdescripcion: getDocumentTypeData.result.recordset[0].XDESCRIPCION,
            bactivo: getDocumentTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Document Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateDocumentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateDocumentType' } });
        });
    }
});

const operationUpdateDocumentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ctipodocidentidad', 'xtipodocidentidad', 'xdescripcion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let documentTypeData = {
        cpais: requestBody.cpais,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xtipodocidentidad: requestBody.xtipodocidentidad.toUpperCase(),
        xdescripcion: requestBody.xdescripcion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyDocumentTypeName = await bd.verifyDocumentTypeNameToUpdateQuery(documentTypeData).then((res) => res);
    if(verifyDocumentTypeName.error){ return { status: false, code: 500, message: verifyDocumentTypeName.error }; }
    if(verifyDocumentTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'document-type-name-already-exist'}; }
    else{
        let updateDocumentType = await bd.updateDocumentTypeQuery(documentTypeData).then((res) => res);
        if(updateDocumentType.error){ return { status: false, code: 500, message: updateDocumentType.error }; }
        if(updateDocumentType.result.rowsAffected > 0){ return { status: true, ctipodocidentidad: documentTypeData.ctipodocidentidad }; }
        else{ return { status: false, code: 404, message: 'Document Type not found.' }; }
    }
}


module.exports = router;