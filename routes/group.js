const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchGroup(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchGroup' } });
        });
    }
});

const operationSearchGroup = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xgrupo: requestBody.xgrupo ? requestBody.xgrupo.toUpperCase() : undefined
    };
    let searchGroup = await bd.searchGroupQuery(searchData).then((res) => res);
    if(searchGroup.error){ return  { status: false, code: 500, message: searchGroup.error }; }
    if(searchGroup.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchGroup.result.recordset.length; i++){
            jsonList.push({
                cgrupo: searchGroup.result.recordset[i].CGRUPO,
                xgrupo: searchGroup.result.recordset[i].XGRUPO,
                bactivo: searchGroup.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Group not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateGroup(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateGroup' } });
        });
    }
});

const operationCreateGroup = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xgrupo', 'bactivo', 'modules', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let modules = requestBody.modules;
    for(let i = 0; i < modules.length; i++){
        if(!helper.validateRequestObj(modules[i], ['xmodulo', 'xruta', 'bactivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
        modules[i].xmodulo = modules[i].xmodulo.toUpperCase()
    }
    let groupData = {
        xgrupo: requestBody.xgrupo.toUpperCase(),
        bactivo: requestBody.bactivo,
        modules: modules,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyGroupName = await bd.verifyGroupNameToCreateQuery(groupData.xgrupo).then((res) => res);
    if(verifyGroupName.error){ return { status: false, code: 500, message: verifyGroupName.error }; }
    if(verifyGroupName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'group-name-already-exist' }; }
    else{
        let createGroup = await bd.createGroupQuery(groupData).then((res) => res);
        if(createGroup.error){ return { status: false, code: 500, message: createGroup.error }; }
        if(createGroup.result.rowsAffected > 0){ return { status: true, cgrupo: createGroup.result.recordset[0].CGRUPO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createGroup' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailGroup(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailGroup' } });
        });
    }
});

const operationDetailGroup = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cgrupo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cgrupo = requestBody.cgrupo;
    let getGroupData = await bd.getGroupDataQuery(cgrupo).then((res) => res);
    if(getGroupData.error){ return { status: false, code: 500, message: getGroupData.error }; }
    if(getGroupData.result.rowsAffected > 0){
        let modules = [];
        let getModulesData = await bd.getModulesDataQuery(cgrupo).then((res) => res);
        if(getModulesData.error){ return { status: false, code: 500, message: getModulesData.error }; }
        if(getModulesData.result.rowsAffected > 0){
            for(let i = 0; i < getModulesData.result.recordset.length; i++){
                let module = {
                    cmodulo: getModulesData.result.recordset[i].CMODULO,
                    xmodulo: getModulesData.result.recordset[i].XMODULO,
                    xruta: getModulesData.result.recordset[i].XRUTA,
                    bactivo: getModulesData.result.recordset[i].BACTIVO
                }
                modules.push(module);
            }
        }
        return {
            status: true,
            cgrupo: getGroupData.result.recordset[0].CGRUPO,
            xgrupo: getGroupData.result.recordset[0].XGRUPO,
            bactivo: getGroupData.result.recordset[0].BACTIVO,
            modules: modules
        }
    }else{ return { status: false, code: 404, message: 'Group not found.' }; }
}

router.route('/update').post((req,res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateGroup(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateGroup' } });
        });
    }
});

const operationUpdateGroup = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cgrupo','xgrupo', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let groupData = {
        cgrupo: requestBody.cgrupo,
        xgrupo: requestBody.xgrupo.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyGroupName = await bd.verifyGroupNameToUpdateQuery(groupData.cgrupo, groupData.xgrupo).then((res) => res);
    if(verifyGroupName.error){ return { status: false, code: 500, message: verifyGroupName.error }; }
    if(verifyGroupName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'group-name-already-exist'}; }
    else{
        let updateGroup = await bd.updateGroupQuery(groupData).then((res) => res);
        if(updateGroup.error){ return { status: false, code: 500, message: updateGroup.error }; }
        if(updateGroup.result.rowsAffected > 0){
            if(requestBody.modules){
                if(requestBody.modules.create && requestBody.modules.create.length > 0){
                    for(let i = 0; i < requestBody.modules.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.modules.create[i], ['xmodulo', 'xruta', 'bactivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        requestBody.modules.create[i].xmodulo = requestBody.modules.create[i].xmodulo.toUpperCase();
                    }
                    let createModulesByGroupUpdate = await bd.createModulesByGroupUpdateQuery(requestBody.modules.create, groupData).then((res) => res);
                    if(createModulesByGroupUpdate.error){ return { status: false, code: 500, message: createModulesByGroupUpdate.error }; }
                    if(createModulesByGroupUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createModulesByGroupUpdate' }; }
                }
                if(requestBody.modules.update && requestBody.modules.update.length > 0){
                    for(let i = 0; i < requestBody.modules.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.modules.update[i], ['cmodulo','xmodulo', 'xruta', 'bactivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        requestBody.modules.update[i].xmodulo = requestBody.modules.update[i].xmodulo.toUpperCase();
                    }
                    let updateModulesByGroupUpdate = await bd.updateModulesByGroupUpdateQuery(requestBody.modules.update, groupData).then((res) => res);
                    if(updateModulesByGroupUpdate.error){ return { status: false, code: 500, message: updateModulesByGroupUpdate.error }; }
                    if(updateModulesByGroupUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Module not found.' }; }
                }
                if(requestBody.modules.delete && requestBody.modules.delete.length){
                    for(let i = 0; i < requestBody.modules.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.modules.delete[i], ['cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteModulesByGroupUpdate = await bd.deleteModulesByGroupUpdateQuery(requestBody.modules.delete, groupData).then((res) => res);
                    if(deleteModulesByGroupUpdate.error){ return { status: false, code: 500, message: deleteModulesByGroupUpdate.error }; }
                    if(deleteModulesByGroupUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteModulesByGroupUpdate' }; }
                }
            }
            return { status: true, cgrupo: updateGroup.cgrupo }; 
        }
        else{ return { status: false, code: 404, message: 'Group not found.' }; }
    }
}

module.exports = router;