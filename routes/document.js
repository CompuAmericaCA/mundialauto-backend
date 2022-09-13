const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchDocument(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchDocument' } });
        });
    }
});

const operationSearchDocument = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xdocumento: requestBody.xdocumento ? requestBody.xdocumento.toUpperCase() : undefined
    };
    let searchDocument = await bd.searchDocumentQuery(searchData).then((res) => res);
    if(searchDocument.error){ return  { status: false, code: 500, message: searchDocument.error }; }
    if(searchDocument.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchDocument.result.recordset.length; i++){
            jsonList.push({
                cdocumento: searchDocument.result.recordset[i].CDOCUMENTO,
                xdocumento: searchDocument.result.recordset[i].XDOCUMENTO,
                bactivo: searchDocument.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Document not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateDocument(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateDocument' } });
        });
    }
});

const operationCreateDocument = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xdocumento', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let documentData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xdocumento: requestBody.xdocumento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyDocumentName = await bd.verifyDocumentNameToCreateQuery(documentData).then((res) => res);
    if(verifyDocumentName.error){ return { status: false, code: 500, message: verifyDocumentName.error }; }
    if(verifyDocumentName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'document-name-already-exist' }; }
    else{
        let createDocument = await bd.createDocumentQuery(documentData).then((res) => res);
        if(createDocument.error){ return { status: false, code: 500, message: createDocument.error }; }
        if(createDocument.result.rowsAffected > 0){ return { status: true, cdocumento: createDocument.result.recordset[0].CDOCUMENTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDocument' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailDocument(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailDocument' } });
        });
    }
});

const operationDetailDocument = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cdocumento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let documentData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cdocumento: requestBody.cdocumento
    };
    let getDocumentData = await bd.getDocumentDataQuery(documentData).then((res) => res);
    if(getDocumentData.error){ return { status: false, code: 500, message: getDocumentData.error }; }
    if(getDocumentData.result.rowsAffected > 0){
        return {
            status: true,
            cdocumento: getDocumentData.result.recordset[0].CDOCUMENTO,
            xdocumento: getDocumentData.result.recordset[0].XDOCUMENTO,
            bactivo: getDocumentData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Document not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateDocument(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateDocument' } });
        });
    }
});

const operationUpdateDocument = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cdocumento', 'xdocumento', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let documentData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cdocumento: requestBody.cdocumento,
        xdocumento: requestBody.xdocumento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyDocumentName = await bd.verifyDocumentNameToUpdateQuery(documentData).then((res) => res);
    if(verifyDocumentName.error){ return { status: false, code: 500, message: verifyDocumentName.error }; }
    if(verifyDocumentName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'document-name-already-exist'}; }
    else{
        let updateDocument = await bd.updateDocumentQuery(documentData).then((res) => res);
        if(updateDocument.error){ return { status: false, code: 500, message: updateDocument.error }; }
        if(updateDocument.result.rowsAffected > 0){ return { status: true, cdocumento: documentData.cdocumento }; }
        else{ return { status: false, code: 404, message: 'Document not found.' }; }
    }
}

module.exports = router;