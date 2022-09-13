const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'email-alert', req.body, 'searchApiProductionEmailAlertSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchEmailAlert(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchEmailAlert' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchEmailAlert = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais ? requestBody.cpais : undefined,
        ccompania: requestBody.ccompania ? requestBody.ccompania : undefined,
        xcorreo: requestBody.xcorreo ? requestBody.xcorreo.toUpperCase() : undefined
    }
    let searchEmailAlert = await db.searchEmailAlertQuery(searchData).then((res) => res);
    if(searchEmailAlert.error){ return { status: false, code: 500, message: searchEmailAlert.error }; }
    if(searchEmailAlert.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Email Alert not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchEmailAlert.result.recordset.length; i++){
        jsonList.push({
            ccorreo: searchEmailAlert.result.recordset[i].CCORREO,
            xcorreo: searchEmailAlert.result.recordset[i].XCORREO,
            ilenguaje: searchEmailAlert.result.recordset[i].ILENGUAJE,
            bactivo: searchEmailAlert.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'email-alert', req.body, 'createApiProductionEmailAlertSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateEmailAlert(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateEmailAlert' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateEmailAlert = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let emailAlertData = {
        xcorreo: requestBody.xcorreo.toUpperCase(),
        ilenguaje: requestBody.ilenguaje.toUpperCase(),
        xasunto: requestBody.xasunto,
        xhtml: requestBody.xhtml,
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariocreacion: requestBody.cusuariocreacion,
        roles: requestBody.roles
    };
    let verifyEmailAlertName = await db.verifyEmailAlertNameToCreateQuery(emailAlertData).then((res) => res);
    if(verifyEmailAlertName.error){ return { status: false, code: 500, message: verifyEmailAlertName.error }; }
    if(verifyEmailAlertName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'email-alert-already-exist' }; }
    let createEmailAlert = await db.createEmailAlertQuery(emailAlertData).then((res) => res);
    if(createEmailAlert.error){ return { status: false, code: 500, message: createEmailAlert.error }; }
    if(createEmailAlert.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createEmailAlert' }; }
    return { status: true, ccorreo: createEmailAlert.result.recordset[0].CCORREO };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'email-alert', req.body, 'detailApiProductionEmailAlertSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailEmailAlert(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailEmailAlert' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailEmailAlert = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ccorreo = requestBody.ccorreo;
    let getEmailAlertData = await db.getEmailAlertDataQuery(ccorreo).then((res) => res);
    if(getEmailAlertData.error){ return { status: false, code: 500, message: getEmailAlertData.error }; }
    if(getEmailAlertData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Email Alert not found.' }; }
    let roles = [];
    let getRolesData = await db.getEmailAlertRolesDataQuery(ccorreo).then((res) => res);
    if(getRolesData.error){ return { status: false, code: 500, message: getRolesData.error }; }
    if(getRolesData.result.rowsAffected > 0){
        for(let i = 0; i < getRolesData.result.recordset.length; i++){
            let rol = {
                crol: getRolesData.result.recordset[i].CROL,
                xrol: getRolesData.result.recordset[i].XROL,
                cdepartamento: getRolesData.result.recordset[i].CDEPARTAMENTO,
                xdepartamento: getRolesData.result.recordset[i].XDEPARTAMENTO
            }
            roles.push(rol);
        }
    }
    return { 
        status: true,
        ccorreo: getEmailAlertData.result.recordset[0].CCORREO,
        xcorreo: getEmailAlertData.result.recordset[0].XCORREO,
        ilenguaje: getEmailAlertData.result.recordset[0].ILENGUAJE,
        xasunto: getEmailAlertData.result.recordset[0].XASUNTO,
        xhtml: getEmailAlertData.result.recordset[0].XHTML,
        bactivo: getEmailAlertData.result.recordset[0].BACTIVO,
        cpais: getEmailAlertData.result.recordset[0].CPAIS,
        ccompania: getEmailAlertData.result.recordset[0].CCOMPANIA,
        roles: roles
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'email-alert', req.body, 'updateApiProductionEmailAlertSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateEmailAlert(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateEmailAlert' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateEmailAlert = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let emailAlertData = {
        ccorreo: requestBody.ccorreo,
        xcorreo: requestBody.xcorreo.toUpperCase(),
        ilenguaje: requestBody.ilenguaje.toUpperCase(),
        xasunto: requestBody.xasunto,
        xhtml: requestBody.xhtml,
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyEmailAlertName = await db.verifyEmailAlertNameToUpdateQuery(emailAlertData).then((res) => res);
    if(verifyEmailAlertName.error){ return { status: false, code: 500, message: verifyEmailAlertName.error }; }
    if(verifyEmailAlertName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'email-alert-already-exist'}; }
    let updateEmailAlert = await db.updateEmailAlertQuery(emailAlertData).then((res) => res);
    if(updateEmailAlert.error){ return { status: false, code: 500, message: updateEmailAlert.error }; }
    if(updateEmailAlert.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Email Alert not found.' }; } 
    if(requestBody.roles){
        if(requestBody.roles.delete && requestBody.roles.delete.length > 0){
            let deleteRolesByEmailAlertUpdate = await db.deleteRolesByEmailAlertUpdateQuery(requestBody.roles.delete, emailAlertData).then((res) => res);
            if(deleteRolesByEmailAlertUpdate.error){ return { status: false, code: 500, message: deleteRolesByEmailAlertUpdate.error }; }
            if(deleteRolesByEmailAlertUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteRolesByEmailAlertUpdate' }; }
        }
        if(requestBody.roles.update && requestBody.roles.update.length > 0){
            let updateRolesByEmailAlertUpdate = await db.updateRolesByEmailAlertUpdateQuery(requestBody.roles.update, emailAlertData).then((res) => res);
            if(updateRolesByEmailAlertUpdate.error){ return { status: false, code: 500, message: updateRolesByEmailAlertUpdate.error }; }
            if(updateRolesByEmailAlertUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Role not found.' }; }
        }
        if(requestBody.roles.create && requestBody.roles.create.length > 0){
            let createRolesByEmailAlertUpdate = await db.createRolesByEmailAlertUpdateQuery(requestBody.roles.create, emailAlertData).then((res) => res);
            if(createRolesByEmailAlertUpdate.error){ return { status: false, code: 500, message: createRolesByEmailAlertUpdate.error }; }
            if(createRolesByEmailAlertUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createRolesByEmailAlertUpdate' }; }
        }
    }
    return { status: true, ccorreo: emailAlertData.ccorreo };
}

module.exports = router