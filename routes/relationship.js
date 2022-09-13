const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchRelationship(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchRelationship' } });
        });
    }
});

const operationSearchRelationship = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xparentesco: requestBody.xparentesco ? requestBody.xparentesco.toUpperCase() : undefined
    };
    let searchRelationship = await bd.searchRelationshipQuery(searchData).then((res) => res);
    if(searchRelationship.error){ return  { status: false, code: 500, message: searchRelationship.error }; }
    if(searchRelationship.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchRelationship.result.recordset.length; i++){
            jsonList.push({
                cparentesco: searchRelationship.result.recordset[i].CPARENTESCO,
                xparentesco: searchRelationship.result.recordset[i].XPARENTESCO,
                bactivo: searchRelationship.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Relationship not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateRelationship(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateRelationship' } });
        });
    }
});

const operationCreateRelationship = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xparentesco', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let relationshipData = {
        cpais: requestBody.cpais,
        xparentesco: requestBody.xparentesco.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyRelationshipName = await bd.verifyRelationshipNameToCreateQuery(relationshipData).then((res) => res);
    if(verifyRelationshipName.error){ return { status: false, code: 500, message: verifyRelationshipName.error }; }
    if(verifyRelationshipName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'relationship-name-already-exist' }; }
    else{
        let createRelationship = await bd.createRelationshipQuery(relationshipData).then((res) => res);
        if(createRelationship.error){ return { status: false, code: 500, message: createRelationship.error }; }
        if(createRelationship.result.rowsAffected > 0){ return { status: true, cparentesco: createRelationship.result.recordset[0].CPARENTESCO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createRelationship' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailRelationship(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailRelationship' } });
        });
    }
});

const operationDetailRelationship = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cparentesco'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let relationshipData = {
        cpais: requestBody.cpais,
        cparentesco: requestBody.cparentesco
    };
    let getRelationshipData = await bd.getRelationshipDataQuery(relationshipData).then((res) => res);
    if(getRelationshipData.error){ return { status: false, code: 500, message: getRelationshipData.error }; }
    if(getRelationshipData.result.rowsAffected > 0){
        return {
            status: true,
            cparentesco: getRelationshipData.result.recordset[0].CPARENTESCO,
            xparentesco: getRelationshipData.result.recordset[0].XPARENTESCO,
            bactivo: getRelationshipData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Relationship not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateRelationship(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateRelationship' } });
        });
    }
});

const operationUpdateRelationship = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cparentesco', 'xparentesco', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let relationshipData = {
        cpais: requestBody.cpais,
        cparentesco: requestBody.cparentesco,
        xparentesco: requestBody.xparentesco.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyRelationshipName = await bd.verifyRelationshipNameToUpdateQuery(relationshipData).then((res) => res);
    if(verifyRelationshipName.error){ return { status: false, code: 500, message: verifyRelationshipName.error }; }
    if(verifyRelationshipName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'relationship-name-already-exist'}; }
    else{
        let updateRelationship = await bd.updateRelationshipQuery(relationshipData).then((res) => res);
        if(updateRelationship.error){ return { status: false, code: 500, message: updateRelationship.error }; }
        if(updateRelationship.result.rowsAffected > 0){ return { status: true, cparentesco: relationshipData.cparentesco }; }
        else{ return { status: false, code: 404, message: 'Relationship not found.' }; }
    }
}

module.exports = router;