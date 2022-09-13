const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchDamageLevel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchDamageLevel' } });
        });
    }
});

const operationSearchDamageLevel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xniveldano: requestBody.xniveldano ? requestBody.xniveldano.toUpperCase() : undefined
    };
    let searchDamageLevel = await bd.searchDamageLevelQuery(searchData).then((res) => res);
    if(searchDamageLevel.error){ return  { status: false, code: 500, message: searchDamageLevel.error }; }
    if(searchDamageLevel.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchDamageLevel.result.recordset.length; i++){
            jsonList.push({
                cniveldano: searchDamageLevel.result.recordset[i].CNIVELDANO,
                xniveldano: searchDamageLevel.result.recordset[i].XNIVELDANO,
                bactivo: searchDamageLevel.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Damage Level not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateDamageLevel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateDamageLevel' } });
        });
    }
});

const operationCreateDamageLevel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xniveldano', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let damageLevelData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xniveldano: requestBody.xniveldano.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyDamageLevelName = await bd.verifyDamageLevelNameToCreateQuery(damageLevelData).then((res) => res);
    if(verifyDamageLevelName.error){ return { status: false, code: 500, message: verifyDamageLevelName.error }; }
    if(verifyDamageLevelName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'damage-level-name-already-exist' }; }
    else{
        let createDamageLevel = await bd.createDamageLevelQuery(damageLevelData).then((res) => res);
        if(createDamageLevel.error){ return { status: false, code: 500, message: createDamageLevel.error }; }
        if(createDamageLevel.result.rowsAffected > 0){ return { status: true, cniveldano: createDamageLevel.result.recordset[0].CNIVELDANO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDamageLevel' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailDamageLevel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailDamageLevel' } });
        });
    }
});

const operationDetailDamageLevel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cniveldano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let damageLevelData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cniveldano: requestBody.cniveldano
    };
    let getDamageLevelData = await bd.getDamageLevelDataQuery(damageLevelData).then((res) => res);
    if(getDamageLevelData.error){ return { status: false, code: 500, message: getDamageLevelData.error }; }
    if(getDamageLevelData.result.rowsAffected > 0){
        return {
            status: true,
            cniveldano: getDamageLevelData.result.recordset[0].CNIVELDANO,
            xniveldano: getDamageLevelData.result.recordset[0].XNIVELDANO,
            bactivo: getDamageLevelData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Damage Level not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateDamageLevel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateDamageLevel' } });
        });
    }
});

const operationUpdateDamageLevel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cniveldano', 'xniveldano', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let damageLevelData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cniveldano: requestBody.cniveldano,
        xniveldano: requestBody.xniveldano.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyDamageLevelName = await bd.verifyDamageLevelNameToUpdateQuery(damageLevelData).then((res) => res);
    if(verifyDamageLevelName.error){ return { status: false, code: 500, message: verifyDamageLevelName.error }; }
    if(verifyDamageLevelName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'damage-level-name-already-exist'}; }
    else{
        let updateDamageLevel = await bd.updateDamageLevelQuery(damageLevelData).then((res) => res);
        if(updateDamageLevel.error){ return { status: false, code: 500, message: updateDamageLevel.error }; }
        if(updateDamageLevel.result.rowsAffected > 0){ return { status: true, cniveldano: damageLevelData.cniveldano }; }
        else{ return { status: false, code: 404, message: 'Damage Level not found.' }; }
    }
}

module.exports = router;