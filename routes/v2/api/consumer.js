const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'consumer', req.body, 'searchApiProductionConsumerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchConsumer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchConsumer' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchConsumer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xconsumidor: requestBody.xconsumidor ? helper.encrypt(requestBody.xconsumidor.toUpperCase()) : undefined,
        xproducto: requestBody.xproducto ? helper.encrypt(requestBody.xproducto.toUpperCase()) : undefined
    }
    let searchConsumer = await db.searchConsumerQuery(searchData).then((res) => res);
    if(searchConsumer.error){ return { status: false, code: 500, message: searchConsumer.error }; }
    if(searchConsumer.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Consumer not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchConsumer.result.recordset.length; i++){
        jsonList.push({
            cconsumidor: searchConsumer.result.recordset[i].CCONSUMIDOR,
            xconsumidor: helper.decrypt(searchConsumer.result.recordset[i].XCONSUMIDOR),
            xproducto: helper.decrypt(searchConsumer.result.recordset[i].XPRODUCTO),
            bactivo: searchConsumer.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'consumer', req.body, 'createApiProductionConsumerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateConsumer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateConsumer' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateConsumer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let consumerData = {
        xconsumidor: helper.encrypt(requestBody.xconsumidor.toUpperCase()),
        xproducto: helper.encrypt(requestBody.xproducto.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xusuario: helper.encrypt(requestBody.xusuario.toUpperCase()),
        xcontrasena: helper.encrypt(requestBody.xcontrasena),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariocreacion: requestBody.cusuariocreacion,
        permissions: requestBody.permissions,
    };
    let verifyConsumerProduct = await db.verifyConsumerProductToCreateQuery(consumerData.xproducto).then((res) => res);
    if(verifyConsumerProduct.error){ return { status: false, code: 500, message: verifyConsumerProduct.error }; }
    if(verifyConsumerProduct.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'product-already-exist' }; }
    let verifyConsumerUser = await db.verifyConsumerUserToCreateQuery(consumerData.xusuario).then((res) => res);
    if(verifyConsumerUser.error){ return { status: false, code: 500, message: verifyConsumerUser.error }; }
    if(verifyConsumerUser.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'user-already-exist' }; }
    let createConsumer = await db.createConsumerQuery(consumerData).then((res) => res);
    if(createConsumer.error){ return { status: false, code: 500, message: createConsumer.error }; }
    if(createConsumer.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createConsumer' }; }
    return { status: true, cconsumidor: createConsumer.result.recordset[0].CCONSUMIDOR };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'consumer', req.body, 'detailApiProductionConsumerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailConsumer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailConsumer' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailConsumer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let cconsumidor = requestBody.cconsumidor;
    let getConsumerData = await db.getConsumerDataQuery(cconsumidor).then((res) => res);
    if(getConsumerData.error){ return { status: false, code: 500, message: getConsumerData.error }; }
    if(getConsumerData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Consumer not found.' }; }
    let permissions = [];
    let getPermissionsData = await db.getConsumerPermissionsDataQuery(cconsumidor).then((res) => res);
    if(getPermissionsData.error){ return { status: false, code: 500, message: getPermissionsData.error }; }
    if(getPermissionsData.result.rowsAffected > 0){ 
        for(let i = 0; i < getPermissionsData.result.recordset.length; i++){
            let permission = {
                cgrupo: getPermissionsData.result.recordset[i].CGRUPO,
                xgrupo: getPermissionsData.result.recordset[i].XGRUPO,
                cmodulo: getPermissionsData.result.recordset[i].CMODULO,
                xmodulo: getPermissionsData.result.recordset[i].XMODULO,
                bindice: getPermissionsData.result.recordset[i].BINDICE,
                bcrear: getPermissionsData.result.recordset[i].BCREAR,
                bdetalle: getPermissionsData.result.recordset[i].BDETALLE,
                beditar: getPermissionsData.result.recordset[i].BEDITAR,
                beliminar: getPermissionsData.result.recordset[i].BELIMINAR,
            }
            permissions.push(permission);
        }
    }
    return { 
        status: true,
        cconsumidor: getConsumerData.result.recordset[0].CCONSUMIDOR,
        xconsumidor: helper.decrypt(getConsumerData.result.recordset[0].XCONSUMIDOR),
        xproducto: helper.decrypt(getConsumerData.result.recordset[0].XPRODUCTO),
        xemail: helper.decrypt(getConsumerData.result.recordset[0].XEMAIL),
        xusuario: helper.decrypt(getConsumerData.result.recordset[0].XUSUARIO),
        bactivo: getConsumerData.result.recordset[0].BACTIVO,
        cpais: getConsumerData.result.recordset[0].CPAIS,
        ccompania: getConsumerData.result.recordset[0].CCOMPANIA,
        permissions: permissions
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'consumer', req.body, 'updateApiProductionConsumerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateConsumer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateConsumer' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateConsumer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let consumerData = {
        cconsumidor: requestBody.cconsumidor,
        xconsumidor: helper.encrypt(requestBody.xconsumidor.toUpperCase()),
        xproducto: helper.encrypt(requestBody.xproducto.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xusuario: helper.encrypt(requestBody.xusuario.toUpperCase()),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyConsumerProduct = await db.verifyConsumerProductToUpdateQuery(consumerData.cconsumidor, consumerData.xproducto).then((res) => res);
    if(verifyConsumerProduct.error){ return { status: false, code: 500, message: verifyConsumerProduct.error }; }
    if(verifyConsumerProduct.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'product-already-exist'}; }
    let verifyConsumerUser = await db.verifyConsumerUserToUpdateQuery(consumerData.cconsumidor, consumerData.xusuario).then((res) => res);
    if(verifyConsumerUser.error){ return { status: false, code: 500, message: verifyConsumerUser.error }; }
    if(verifyConsumerUser.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'user-already-exist'}; }
    let updateConsumer = await db.updateConsumerQuery(consumerData).then((res) => res);
    if(updateConsumer.error){ return { status: false, code: 500, message: updateConsumer.error }; }
    if(updateConsumer.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Consumer not found.' }; }
    if(requestBody.permissions){
        if(requestBody.permissions.delete && requestBody.permissions.delete.length > 0){
            let deletePermissionsByConsumerUpdate = await db.deletePermissionsByConsumerUpdateQuery(requestBody.permissions.delete, consumerData).then((res) => res);
            if(deletePermissionsByConsumerUpdate.error){ return { status: false, code: 500, message: deletePermissionsByConsumerUpdate.error }; }
            if(deletePermissionsByConsumerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePermissionsByConsumerUpdate' }; }
        }
        if(requestBody.permissions.update && requestBody.permissions.update.length > 0){
            let updatePermissionsByConsumerUpdate = await db.updatePermissionsByConsumerUpdateQuery(requestBody.permissions.update, consumerData).then((res) => res);
            if(updatePermissionsByConsumerUpdate.error){ return { status: false, code: 500, message: updatePermissionsByConsumerUpdate.error }; }
            if(updatePermissionsByConsumerUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Permission not found.' }; }
        }
        if(requestBody.permissions.create && requestBody.permissions.create.length > 0){
            let createPermissionsByConsumerUpdate = await db.createPermissionsByConsumerUpdateQuery(requestBody.permissions.create, consumerData).then((res) => res);
            if(createPermissionsByConsumerUpdate.error){ return { status: false, code: 500, message: createPermissionsByConsumerUpdate.error }; }
            if(createPermissionsByConsumerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPermissionsByConsumerUpdate' }; }
        }
    }
    return { status: true, cconsumidor: consumerData.cconsumidor };
}

module.exports = router;

