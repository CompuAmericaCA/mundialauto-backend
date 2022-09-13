const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchPlanType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPlanType' } });
        });
    }
});

const operationSearchPlanType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoplan: requestBody.xtipoplan ? requestBody.xtipoplan.toUpperCase() : undefined
    };
    let searchPlanType = await bd.searchPlanTypeQuery(searchData).then((res) => res);
    if(searchPlanType.error){ return  { status: false, code: 500, message: searchPlanType.error }; }
    if(searchPlanType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchPlanType.result.recordset.length; i++){
            jsonList.push({
                ctipoplan: searchPlanType.result.recordset[i].CTIPOPLAN,
                xtipoplan: searchPlanType.result.recordset[i].XTIPOPLAN,
                bactivo: searchPlanType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Plan Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreatePlanType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePlanType' } });
        });
    }
});

const operationCreatePlanType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtipoplan', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let planTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoplan: requestBody.xtipoplan.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyPlanTypeName = await bd.verifyPlanTypeNameToCreateQuery(planTypeData).then((res) => res);
    if(verifyPlanTypeName.error){ return { status: false, code: 500, message: verifyPlanTypeName.error }; }
    if(verifyPlanTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'plan-type-name-already-exist' }; }
    else{
        let createPlanType = await bd.createPlanTypeQuery(planTypeData).then((res) => res);
        if(createPlanType.error){ return { status: false, code: 500, message: createPlanType.error }; }
        if(createPlanType.result.rowsAffected > 0){ return { status: true, ctipoplan: createPlanType.result.recordset[0].CTIPOPLAN }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPlanType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailPlanType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPlanType' } });
        });
    }
});

const operationDetailPlanType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctipoplan'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let planTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoplan: requestBody.ctipoplan
    };
    let getPlanTypeData = await bd.getPlanTypeDataQuery(planTypeData).then((res) => res);
    if(getPlanTypeData.error){ return { status: false, code: 500, message: getPlanTypeData.error }; }
    if(getPlanTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipoplan: getPlanTypeData.result.recordset[0].CTIPOPLAN,
            xtipoplan: getPlanTypeData.result.recordset[0].XTIPOPLAN,
            bactivo: getPlanTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Plan Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdatePlanType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdatePlanType' } });
        });
    }
});

const operationUpdatePlanType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctipoplan', 'xtipoplan', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let planTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctipoplan: requestBody.ctipoplan,
        xtipoplan: requestBody.xtipoplan.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyPlanTypeName = await bd.verifyPlanTypeNameToUpdateQuery(planTypeData).then((res) => res);
    if(verifyPlanTypeName.error){ return { status: false, code: 500, message: verifyPlanTypeName.error }; }
    if(verifyPlanTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'plan-type-name-already-exist'}; }
    else{
        let updatePlanType = await bd.updatePlanTypeQuery(planTypeData).then((res) => res);
        if(updatePlanType.error){ return { status: false, code: 500, message: updatePlanType.error }; }
        if(updatePlanType.result.rowsAffected > 0){ return { status: true, ctipoplan: planTypeData.ctipoplan }; }
        else{ return { status: false, code: 404, message: 'Plan Type not found.' }; }
    }
}

module.exports = router;