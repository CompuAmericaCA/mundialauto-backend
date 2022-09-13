const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-menu', req.body, 'searchApiProductionClubMenuSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchClubMenu(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubMenu' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchClubMenu = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais ? requestBody.cpais : undefined,
        ccompania: requestBody.ccompania ? requestBody.ccompania : undefined,
        xmenuclub: requestBody.xmenuclub ? requestBody.xmenuclub.toUpperCase() : undefined
    }
    let searchClubMenu = await db.searchClubMenuQuery(searchData).then((res) => res);
    if(searchClubMenu.error){ return { status: false, code: 500, message: searchClubMenu.error }; }
    if(searchClubMenu.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Menu not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchClubMenu.result.recordset.length; i++){
        jsonList.push({
            cmenuclub: searchClubMenu.result.recordset[i].CMENUCLUB,
            xmenuclub: searchClubMenu.result.recordset[i].XMENUCLUB,
            xpais: searchClubMenu.result.recordset[i].XPAIS,
            xcompania: searchClubMenu.result.recordset[i].XCOMPANIA,
            bactivo: searchClubMenu.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-menu', req.body, 'createApiProductionClubMenuSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateClubMenu(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateClubMenu' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateClubMenu = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let submenus = [];
    if(requestBody.submenus){
        submenus = requestBody.submenus;
        for(let i = 0; i < submenus.length; i++){
            submenus[i].xsubmenuclub = submenus[i].xsubmenuclub.toUpperCase();
            submenus[i].xcomponente = submenus[i].xcomponente.toUpperCase();
        }
    }
    let clubMenuData = {
        xmenuclub: requestBody.xmenuclub.toUpperCase(),
        xcomponente: requestBody.xcomponente ? requestBody.xcomponente.toUpperCase() : undefined,
        xcontenido: requestBody.xcontenido,
        bsubmenu: requestBody.bsubmenu,
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariocreacion: requestBody.cusuariocreacion,
        submenus: submenus
    };
    let verifyClubMenuName = await db.verifyClubMenuNameToCreateQuery(clubMenuData).then((res) => res);
    if(verifyClubMenuName.error){ return { status: false, code: 500, message: verifyClubMenuName.error }; }
    if(verifyClubMenuName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'club-menu-already-exist' }; }
    let createClubMenu = await db.createClubMenuQuery(clubMenuData).then((res) => res);
    if(createClubMenu.error){ return { status: false, code: 500, message: createClubMenu.error }; }
    if(createClubMenu.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClubMenu' }; }
    return { status: true, cmenuclub: createClubMenu.result.recordset[0].CMENUCLUB };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-menu', req.body, 'detailApiProductionClubMenuSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailClubMenu(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClubMenu' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailClubMenu = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let cmenuclub = requestBody.cmenuclub;
    let getClubMenuData = await db.getClubMenuDataQuery(cmenuclub).then((res) => res);
    if(getClubMenuData.error){ return { status: false, code: 500, message: getClubMenuData.error }; }
    if(getClubMenuData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Menu not found.' }; }
    let submenus = [];
    let getSubMenusData = await db.getClubMenuSubMenusDataQuery(cmenuclub).then((res) => res);
    if(getSubMenusData.error){ return { status: false, code: 500, message: getSubMenusData.error }; }
    if(getSubMenusData.result.rowsAffected > 0){
        for(let i = 0; i < getSubMenusData.result.recordset.length; i++){
            let submenu = {
                csubmenuclub: getSubMenusData.result.recordset[i].CSUBMENUCLUB,
                xsubmenuclub: getSubMenusData.result.recordset[i].XSUBMENUCLUB,
                xcomponente: getSubMenusData.result.recordset[i].XCOMPONENTE,
                xcontenido: getSubMenusData.result.recordset[i].XCONTENIDO,
                bactivo: getSubMenusData.result.recordset[i].BACTIVO
            }
            submenus.push(submenu);
        }
    }
    return { 
        status: true,
        cmenuclub: getClubMenuData.result.recordset[0].CMENUCLUB,
        xmenuclub: getClubMenuData.result.recordset[0].XMENUCLUB,
        xcomponente: getClubMenuData.result.recordset[0].XCOMPONENTE,
        xcontenido: getClubMenuData.result.recordset[0].XCONTENIDO,
        bsubmenu: getClubMenuData.result.recordset[0].BSUBMENU,
        bactivo: getClubMenuData.result.recordset[0].BACTIVO,
        cpais: getClubMenuData.result.recordset[0].CPAIS,
        ccompania: getClubMenuData.result.recordset[0].CCOMPANIA,
        submenus: submenus
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-menu', req.body, 'updateApiProductionClubMenuSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateClubMenu(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateClubMenu' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateClubMenu = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clubMenuData = {
        cmenuclub: requestBody.cmenuclub,
        xmenuclub: requestBody.xmenuclub.toUpperCase(),
        xcomponente: requestBody.xcomponente ? requestBody.xcomponente.toUpperCase() : undefined,
        xcontenido: requestBody.xcontenido,
        bsubmenu: requestBody.bsubmenu,
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyClubMenuName = await db.verifyClubMenuNameToUpdateQuery(clubMenuData).then((res) => res);
    if(verifyClubMenuName.error){ return { status: false, code: 500, message: verifyClubMenuName.error }; }
    if(verifyClubMenuName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'club-menu-already-exist'}; }
    let updateClubMenu = await db.updateClubMenuQuery(clubMenuData).then((res) => res);
    if(updateClubMenu.error){ return { status: false, code: 500, message: updateClubMenu.error }; }
    if(updateClubMenu.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Menu not found.' }; } 
    if(requestBody.submenus){
        if(requestBody.submenus.delete && requestBody.submenus.delete.length > 0){
            let deleteSubMenusByClubMenuUpdate = await db.deleteSubMenusByClubMenuUpdateQuery(requestBody.submenus.delete, clubMenuData).then((res) => res);
            if(deleteSubMenusByClubMenuUpdate.error){ return { status: false, code: 500, message: deleteSubMenusByClubMenuUpdate.error }; }
            if(deleteSubMenusByClubMenuUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteSubMenusByClubMenuUpdate' }; }
        }
        if(requestBody.submenus.update && requestBody.submenus.update.length > 0){
            for(let i = 0; i < requestBody.submenus.update.length; i++){
                requestBody.submenus.update[i].xsubmenuclub = requestBody.submenus.update[i].xsubmenuclub.toUpperCase();
                requestBody.submenus.update[i].xcomponente = requestBody.submenus.update[i].xcomponente.toUpperCase();
            }
            let updateSubMenusByClubMenuUpdate = await db.updateSubMenusByClubMenuUpdateQuery(requestBody.submenus.update, clubMenuData).then((res) => res);
            if(updateSubMenusByClubMenuUpdate.error){ return { status: false, code: 500, message: updateSubMenusByClubMenuUpdate.error }; }
            if(updateSubMenusByClubMenuUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Sub Menu not found.' }; }
        }
        if(requestBody.submenus.create && requestBody.submenus.create.length > 0){
            for(let i = 0; i < requestBody.submenus.create.length; i++){
                requestBody.submenus.create[i].xsubmenuclub = requestBody.submenus.create[i].xsubmenuclub.toUpperCase();
                requestBody.submenus.create[i].xcomponente = requestBody.submenus.create[i].xcomponente.toUpperCase();
            }
            let createSubMenusByClubMenuUpdate = await db.createSubMenusByClubMenuUpdateQuery(requestBody.submenus.create, clubMenuData).then((res) => res);
            if(createSubMenusByClubMenuUpdate.error){ return { status: false, code: 500, message: createSubMenusByClubMenuUpdate.error }; }
            if(createSubMenusByClubMenuUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createSubMenusByClubMenuUpdate' }; }
        }
    }
    return { status: true, cmenuclub: clubMenuData.cmenuclub };
}

module.exports = router;