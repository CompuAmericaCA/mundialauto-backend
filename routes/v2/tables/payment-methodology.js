const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'payment-methodology', req.body, 'searchTablesProductionPaymentMethodologySchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchPaymentMethodology(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPaymentMethodology' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchPaymentMethodology = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xmetodologiapago: requestBody.xmetodologiapago ? requestBody.xmetodologiapago.toUpperCase() : undefined
    }
    let searchPaymentMethodology = await db.searchPaymentMethodologyQuery(searchData).then((res) => res);
    if(searchPaymentMethodology.error){ return { status: false, code: 500, message: searchPaymentMethodology.error }; }
    if(searchPaymentMethodology.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Payment Methodology not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchPaymentMethodology.result.recordset.length; i++){
        jsonList.push({
            cmetodologiapago: searchPaymentMethodology.result.recordset[i].CMETODOLOGIAPAGO,
            xmetodologiapago: searchPaymentMethodology.result.recordset[i].XMETODOLOGIAPAGO,
            bactivo: searchPaymentMethodology.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'payment-methodology', req.body, 'createTablesProductionPaymentMethodologySchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreatePaymentMethodology(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePaymentMethodology' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreatePaymentMethodology = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentMethodologyData = {
        xmetodologiapago: requestBody.xmetodologiapago.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyPaymentMethodologyName = await db.verifyPaymentMethodologyNameToCreateQuery(paymentMethodologyData).then((res) => res);
    if(verifyPaymentMethodologyName.error){ return { status: false, code: 500, message: verifyPaymentMethodologyName.error }; }
    if(verifyPaymentMethodologyName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'payment-methodology-name-already-exist' }; }
    let createPaymentMethodology = await db.createPaymentMethodologyQuery(paymentMethodologyData).then((res) => res);
    if(createPaymentMethodology.error){ return { status: false, code: 500, message: createPaymentMethodology.error }; }
    if(createPaymentMethodology.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPaymentMethodology' }; }
    return { status: true, cmetodologiapago: createPaymentMethodology.result.recordset[0].CMETODOLOGIAPAGO };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'payment-methodology', req.body, 'detailTablesProductionPaymentMethodologySchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailPaymentMethodology(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPaymentMethodology' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailPaymentMethodology = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentMethodologyData = {
        cmetodologiapago: requestBody.cmetodologiapago,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    }
    let getPaymentMethodologyData = await db.getPaymentMethodologyDataQuery(paymentMethodologyData).then((res) => res);
    if(getPaymentMethodologyData.error){ return { status: false, code: 500, message: getPaymentMethodologyData.error }; }
    if(getPaymentMethodologyData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Payment Methodology not found.' }; }
    return { 
        status: true,
        cmetodologiapago: getPaymentMethodologyData.result.recordset[0].CMETODOLOGIAPAGO,
        xmetodologiapago: getPaymentMethodologyData.result.recordset[0].XMETODOLOGIAPAGO,
        bactivo: getPaymentMethodologyData.result.recordset[0].BACTIVO
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'payment-methodology', req.body, 'updateTablesProductionPaymentMethodologySchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdatePaymentMethodology(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdatePaymentMethodology' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdatePaymentMethodology = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentMethodologyData = {
        cmetodologiapago: requestBody.cmetodologiapago,
        xmetodologiapago: requestBody.xmetodologiapago.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyPaymentMethodologyName = await db.verifyPaymentMethodologyNameToUpdateQuery(paymentMethodologyData).then((res) => res);
    if(verifyPaymentMethodologyName.error){ return { status: false, code: 500, message: verifyPaymentMethodologyName.error }; }
    if(verifyPaymentMethodologyName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'payment-methodology-name-already-exist'}; }
    let updatePaymentMethodology = await db.updatePaymentMethodologyQuery(paymentMethodologyData).then((res) => res);
    if(updatePaymentMethodology.error){ return { status: false, code: 500, message: updatePaymentMethodology.error }; }
    if(updatePaymentMethodology.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Payment Methodology not found.' }; }
    return { status: true, cmetodologiapago: paymentMethodologyData.cmetodologiapago };
}

module.exports = router;