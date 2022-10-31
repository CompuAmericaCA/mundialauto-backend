const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchRole' } });
        });
    }
});

const operationSearchRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cdepartamento: requestBody.cdepartamento ? requestBody.cdepartamento : undefined,
        xrol: requestBody.xrol ? requestBody.xrol.toUpperCase() : undefined
    };
    let searchRole = await bd.searchRoleQuery(searchData).then((res) => res);
    if(searchRole.error){ return  { status: false, code: 500, message: searchRole.error }; }
    if(searchRole.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchRole.result.recordset.length; i++){
            jsonList.push({
                crol: searchRole.result.recordset[i].CROL,
                xrol: searchRole.result.recordset[i].XROL,
                cdepartamento: searchRole.result.recordset[i].CDEPARTAMENTO,
                xdepartamento: searchRole.result.recordset[i].XDEPARTAMENTO,
                bactivo: searchRole.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Role not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateRole' } });
        });
    }
});

const operationCreateRole = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cdepartamento', 'xrol', 'bactivo', 'permissions', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let permissions = requestBody.permissions;
    for(let i = 0; i < permissions.length; i++){
        if(!helper.validateRequestObj(permissions[i], ['cgrupo', 'cmodulo', 'bindice', 'bcrear', 'bdetalle', 'beditar', 'beliminar'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    }
    let roleData = {
        cdepartamento: requestBody.cdepartamento,
        xrol: requestBody.xrol.toUpperCase(),
        bactivo: requestBody.bactivo,
        permissions: permissions,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyRoleName = await bd.verifyRoleNameToCreateQuery(roleData.xrol, roleData.cdepartamento).then((res) => res);
    if(verifyRoleName.error){ return { status: false, code: 500, message: verifyRoleName.error }; }
    if(verifyRoleName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'role-name-already-exist' }; }
    else{
        let createRole = await bd.createRoleQuery(roleData).then((res) => res);
        if(createRole.error){ return { status: false, code: 500, message: createRole.error }; }
        if(createRole.result.rowsAffected > 0){ return { status: true, crol: createRole.result.recordset[0].CROL }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createRole' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailRole' } });
        });
    }
});

const operationDetailRole = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['crol'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let crol = requestBody.crol;
    let getRoleData = await bd.getRoleDataQuery(crol).then((res) => res);
    if(getRoleData.error){ return { status: false, code: 500, message: getRoleData.error }; }
    if(getRoleData.result.rowsAffected > 0){
        let permissions = [];
        let getPermissionsData = await bd.getPermissionsDataQuery(crol).then((res) => res);
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
            cdepartamento: getRoleData.result.recordset[0].CDEPARTAMENTO,
            crol: getRoleData.result.recordset[0].CROL,
            xrol: getRoleData.result.recordset[0].XROL,
            bactivo: getRoleData.result.recordset[0].BACTIVO,
            permissions: permissions
        }
    }else{ return { status: false, code: 404, message: 'Role not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateRole' } });
        });
    }
});

const operationUpdateRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cdepartamento','crol','xrol', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let roleData = {
        cdepartamento: requestBody.cdepartamento,
        crol: requestBody.crol,
        xrol: requestBody.xrol.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyRoleName = await bd.verifyRoleNameToUpdateQuery(roleData).then((res) => res);
    if(verifyRoleName.error){ return { status: false, code: 500, message: verifyRoleName.error }; }
    if(verifyRoleName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'role-name-already-exist'}; }
    else{
        let updateRole = await bd.updateRoleQuery(roleData).then((res) => res);
        if(updateRole.error){ return { status: false, code: 500, message: updateRole.error }; }
        if(updateRole.result.rowsAffected > 0){
            if(requestBody.permissions){
                if(requestBody.permissions.create && requestBody.permissions.create.length > 0){
                    console.log(requestBody.permissions.create)
                    for(let i = 0; i < requestBody.permissions.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.permissions.create[i], ['cgrupo','cmodulo','bindice','bcrear','bdetalle','beditar','beliminar'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let createPermissionsByRoleUpdate = await bd.createPermissionsByRoleUpdateQuery(requestBody.permissions.create, roleData).then((res) => res);
                    if(createPermissionsByRoleUpdate.error){ console.log(createPermissionsByRoleUpdate.error);return { status: false, code: 500, message: createPermissionsByRoleUpdate.error }; }
                    if(createPermissionsByRoleUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPermissionsByRoleUpdate' }; }
                } 
                if(requestBody.permissions.update && requestBody.permissions.update.length > 0){
                    for(let i = 0; i < requestBody.permissions.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.permissions.update[i], ['cgrupo','cmodulo','bindice','bcrear','bdetalle','beditar','beliminar'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let updatePermissionsByRoleUpdate = await bd.updatePermissionsByRoleUpdateQuery(requestBody.permissions.update, roleData).then((res) => res);
                    if(updatePermissionsByRoleUpdate.error){ return { status: false, code: 500, message: updatePermissionsByRoleUpdate.error }; }
                    if(updatePermissionsByRoleUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Permission not found.' }; }
                }
                if(requestBody.permissions.delete && requestBody.permissions.delete.length){
                    for(let i = 0; i < requestBody.permissions.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.permissions.delete[i], ['cgrupo','cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deletePermissionsByRoleUpdate = await bd.deletePermissionsByRoleUpdateQuery(requestBody.permissions.delete, roleData).then((res) => res);
                    if(deletePermissionsByRoleUpdate.error){ return { status: false, code: 500, message: deletePermissionsByRoleUpdate.error }; }
                    if(deletePermissionsByRoleUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePermissionsByRoleUpdate' }; }
                }
            }
            return { status: true, crol: roleData.crol }; 
        }
        else{ return { status: false, code: 404, message: 'Role not found.' }; }
    }
}

module.exports = router;