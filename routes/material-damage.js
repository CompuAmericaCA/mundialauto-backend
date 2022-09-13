const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchMaterialDamage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchMaterialDamage' } });
        });
    }
});

const operationSearchMaterialDamage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xdanomaterial: requestBody.xdanomaterial ? requestBody.xdanomaterial.toUpperCase() : undefined
    };
    let searchMaterialDamage = await bd.searchMaterialDamageQuery(searchData).then((res) => res);
    if(searchMaterialDamage.error){ return  { status: false, code: 500, message: searchMaterialDamage.error }; }
    if(searchMaterialDamage.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchMaterialDamage.result.recordset.length; i++){
            jsonList.push({
                cdanomaterial: searchMaterialDamage.result.recordset[i].CDANOMATERIAL,
                xdanomaterial: searchMaterialDamage.result.recordset[i].XDANOMATERIAL,
                bactivo: searchMaterialDamage.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Material Damage not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateMaterialDamage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateMaterialDamage' } });
        });
    }
});

const operationCreateMaterialDamage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xdanomaterial', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let materialDamageData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xdanomaterial: requestBody.xdanomaterial.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyMaterialDamageName = await bd.verifyMaterialDamageNameToCreateQuery(materialDamageData).then((res) => res);
    if(verifyMaterialDamageName.error){ return { status: false, code: 500, message: verifyMaterialDamageName.error }; }
    if(verifyMaterialDamageName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'material-damage-name-already-exist' }; }
    else{
        let createMaterialDamage = await bd.createMaterialDamageQuery(materialDamageData).then((res) => res);
        if(createMaterialDamage.error){ return { status: false, code: 500, message: createMaterialDamage.error }; }
        if(createMaterialDamage.result.rowsAffected > 0){ return { status: true, cdanomaterial: createMaterialDamage.result.recordset[0].CDANOMATERIAL }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createMaterialDamage' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailMaterialDamage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailMaterialDamage' } });
        });
    }
});

const operationDetailMaterialDamage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cdanomaterial'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let materialDamageData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cdanomaterial: requestBody.cdanomaterial
    };
    let getMaterialDamageData = await bd.getMaterialDamageDataQuery(materialDamageData).then((res) => res);
    if(getMaterialDamageData.error){ return { status: false, code: 500, message: getMaterialDamageData.error }; }
    if(getMaterialDamageData.result.rowsAffected > 0){
        return {
            status: true,
            cdanomaterial: getMaterialDamageData.result.recordset[0].CDANOMATERIAL,
            xdanomaterial: getMaterialDamageData.result.recordset[0].XDANOMATERIAL,
            bactivo: getMaterialDamageData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Material Damage not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateMaterialDamage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateMaterialDamage' } });
        });
    }
});

const operationUpdateMaterialDamage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cdanomaterial', 'xdanomaterial', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let materialDamageData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cdanomaterial: requestBody.cdanomaterial,
        xdanomaterial: requestBody.xdanomaterial.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyMaterialDamageName = await bd.verifyMaterialDamageNameToUpdateQuery(materialDamageData).then((res) => res);
    if(verifyMaterialDamageName.error){ return { status: false, code: 500, message: verifyMaterialDamageName.error }; }
    if(verifyMaterialDamageName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'material-damage-name-already-exist'}; }
    else{
        let updateMaterialDamage = await bd.updateMaterialDamageQuery(materialDamageData).then((res) => res);
        if(updateMaterialDamage.error){ return { status: false, code: 500, message: updateMaterialDamage.error }; }
        if(updateMaterialDamage.result.rowsAffected > 0){ return { status: true, cdanomaterial: materialDamageData.cdanomaterial }; }
        else{ return { status: false, code: 404, message: 'Material Damage not found.' }; }
    }
}

module.exports = router;