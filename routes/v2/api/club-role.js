const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-role', req.body, 'searchApiProductionClubRoleSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchClubRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubRole' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchClubRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let xrolclub = requestBody.xrolclub ? requestBody.xrolclub.toUpperCase() : undefined;
    let searchClubRole = await db.searchClubRoleQuery(xrolclub).then((res) => res);
    if(searchClubRole.error){ return { status: false, code: 500, message: searchClubRole.error }; }
    if(searchClubRole.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Role not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchClubRole.result.recordset.length; i++){
        jsonList.push({
            crolclub: searchClubRole.result.recordset[i].CROLCLUB,
            xrolclub: searchClubRole.result.recordset[i].XROLCLUB,
            bactivo: searchClubRole.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-role', req.body, 'createApiProductionClubRoleSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateClubRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateClubRole' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateClubRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clubRoleData = {
        crolclub: requestBody.crolclub.toUpperCase(),
        xrolclub: requestBody.xrolclub.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion,
        menus: requestBody.menus
    };
    let verifyClubRoleCode = await db.verifyClubRoleCodeToCreateQuery(clubRoleData).then((res) => res);
    if(verifyClubRoleCode.error){ return { status: false, code: 500, message: verifyClubRoleCode.error }; }
    if(verifyClubRoleCode.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'club-role-code-already-exist' }; }
    let verifyClubRoleName = await db.verifyClubRoleNameToCreateQuery(clubRoleData).then((res) => res);
    if(verifyClubRoleName.error){ return { status: false, code: 500, message: verifyClubRoleName.error }; }
    if(verifyClubRoleName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'club-role-name-already-exist' }; }
    let createClubRole = await db.createClubRoleQuery(clubRoleData).then((res) => res);
    if(createClubRole.error){ return { status: false, code: 500, message: createClubRole.error }; }
    if(createClubRole.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClubRole' }; }
    return { status: true, crolclub: createClubRole.result.recordset[0].CROLCLUB };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-role', req.body, 'detailApiProductionClubRoleSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailClubRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClubRole' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailClubRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let crolclub = requestBody.crolclub;
    let getClubRoleData = await db.getClubRoleDataQuery(crolclub).then((res) => res);
    if(getClubRoleData.error){ return { status: false, code: 500, message: getClubRoleData.error }; }
    if(getClubRoleData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Role not found.' }; }
    let menus = [];
    let getMenusData = await db.getClubRoleMenusDataQuery(crolclub).then((res) => res);
    if(getMenusData.error){ return { status: false, code: 500, message: getMenusData.error }; }
    if(getMenusData.result.rowsAffected > 0){
        for(let i = 0; i < getMenusData.result.recordset.length; i++){
            let menu = {
                cmenuclub: getMenusData.result.recordset[i].CMENUCLUB,
                xmenuclub: getMenusData.result.recordset[i].XMENUCLUB,
                xcomponente: getMenusData.result.recordset[i].XCOMPONENTE,
                xpais: getMenusData.result.recordset[i].XPAIS,
                xcompania: getMenusData.result.recordset[i].XCOMPANIA
            }
            menus.push(menu);
        }
    }
    return { 
        status: true,
        crolclub: getClubRoleData.result.recordset[0].CROLCLUB,
        xrolclub: getClubRoleData.result.recordset[0].XROLCLUB,
        bactivo: getClubRoleData.result.recordset[0].BACTIVO,
        menus: menus
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-role', req.body, 'updateApiProductionClubRoleSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateClubRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateClubRole' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateClubRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clubRoleData = {
        crolclub: requestBody.crolclub,
        xrolclub: requestBody.xrolclub.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyClubRoleName = await db.verifyClubRoleNameToUpdateQuery(clubRoleData).then((res) => res);
    if(verifyClubRoleName.error){ return { status: false, code: 500, message: verifyClubRoleName.error }; }
    if(verifyClubRoleName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'club-role-name-already-exist'}; }
    let updateClubRole = await db.updateClubRoleQuery(clubRoleData).then((res) => res);
    if(updateClubRole.error){ return { status: false, code: 500, message: updateClubRole.error }; }
    if(updateClubRole.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Role not found.' }; } 
    if(requestBody.menus){
        if(requestBody.menus.delete && requestBody.menus.delete.length > 0){
            let deleteMenusByClubRoleUpdate = await db.deleteMenusByClubRoleUpdateQuery(requestBody.menus.delete, clubRoleData).then((res) => res);
            if(deleteMenusByClubRoleUpdate.error){ return { status: false, code: 500, message: deleteMenusByClubRoleUpdate.error }; }
            if(deleteMenusByClubRoleUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteMenusByClubRoleUpdate' }; }
        }
        if(requestBody.menus.update && requestBody.menus.update.length > 0){
            let updateMenusByClubRoleUpdate = await db.updateMenusByClubRoleUpdateQuery(requestBody.menus.update, clubRoleData).then((res) => res);
            if(updateMenusByClubRoleUpdate.error){ return { status: false, code: 500, message: updateMenusByClubRoleUpdate.error }; }
            if(updateMenusByClubRoleUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Menu not found.' }; }
        }
        if(requestBody.menus.create && requestBody.menus.create.length > 0){
            let createMenusByClubRoleUpdate = await db.createMenusByClubRoleUpdateQuery(requestBody.menus.create, clubRoleData).then((res) => res);
            if(createMenusByClubRoleUpdate.error){ return { status: false, code: 500, message: createMenusByClubRoleUpdate.error }; }
            if(createMenusByClubRoleUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createMenusByClubRoleUpdate' }; }
        }
    }
    return { status: true, crolclub: clubRoleData.crolclub };
}

module.exports = router;