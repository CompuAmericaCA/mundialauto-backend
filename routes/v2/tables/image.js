const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'image', req.body, 'searchTablesProductionImageSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchImage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchImage' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchImage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ximagen: requestBody.ximagen ? requestBody.ximagen.toUpperCase() : undefined
    }
    let searchImage = await db.searchImageQuery(searchData).then((res) => res);
    if(searchImage.error){ return { status: false, code: 500, message: searchImage.error }; }
    if(searchImage.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Image not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchImage.result.recordset.length; i++){
        jsonList.push({
            cimagen: searchImage.result.recordset[i].CIMAGEN,
            ximagen: searchImage.result.recordset[i].XIMAGEN,
            bactivo: searchImage.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'image', req.body, 'createTablesProductionImageSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateImage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateImage' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateImage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let imageData = {
        ximagen: requestBody.ximagen.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyImageName = await db.verifyImageNameToCreateQuery(imageData).then((res) => res);
    if(verifyImageName.error){ return { status: false, code: 500, message: verifyImageName.error }; }
    if(verifyImageName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'image-name-already-exist' }; }
    let createImage = await db.createImageQuery(imageData).then((res) => res);
    if(createImage.error){ return { status: false, code: 500, message: createImage.error }; }
    if(createImage.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createImage' }; }
    return { status: true, cimagen: createImage.result.recordset[0].CIMAGEN };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'image', req.body, 'detailTablesProductionImageSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailImage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailImage' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailImage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let imageData = {
        cimagen: requestBody.cimagen,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    }
    let getImageData = await db.getImageDataQuery(imageData).then((res) => res);
    if(getImageData.error){ return { status: false, code: 500, message: getImageData.error }; }
    if(getImageData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Image not found.' }; }
    return { 
        status: true,
        cimagen: getImageData.result.recordset[0].CIMAGEN,
        ximagen: getImageData.result.recordset[0].XIMAGEN,
        bactivo: getImageData.result.recordset[0].BACTIVO
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'image', req.body, 'updateTablesProductionImageSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateImage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateImage' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateImage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let imageData = {
        cimagen: requestBody.cimagen,
        ximagen: requestBody.ximagen.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyImageName = await db.verifyImageNameToUpdateQuery(imageData).then((res) => res);
    if(verifyImageName.error){ return { status: false, code: 500, message: verifyImageName.error }; }
    if(verifyImageName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'image-name-already-exist'}; }
    let updateImage = await db.updateImageQuery(imageData).then((res) => res);
    if(updateImage.error){ return { status: false, code: 500, message: updateImage.error }; }
    if(updateImage.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Image not found.' }; }
    return { status: true, cimagen: imageData.cimagen };
}

module.exports = router;