const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchTracingType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTracingType' } });
        });
    }
});

const operationSearchTracingType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiposeguimiento: requestBody.xtiposeguimiento ? requestBody.xtiposeguimiento.toUpperCase() : undefined
    };
    let searchTracingType = await bd.searchTracingTypeQuery(searchData).then((res) => res);
    if(searchTracingType.error){ return  { status: false, code: 500, message: searchTracingType.error }; }
    if(searchTracingType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchTracingType.result.recordset.length; i++){
            jsonList.push({
                ctiposeguimiento: searchTracingType.result.recordset[i].CTIPOSEGUIMIENTO,
                xtiposeguimiento: searchTracingType.result.recordset[i].XTIPOSEGUIMIENTO,
                bactivo: searchTracingType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Tracing Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateTracingType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateTracingType' } });
        });
    }
});

const operationCreateTracingType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtiposeguimiento', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let tracingTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiposeguimiento: requestBody.xtiposeguimiento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyTracingTypeName = await bd.verifyTracingTypeNameToCreateQuery(tracingTypeData).then((res) => res);
    if(verifyTracingTypeName.error){ return { status: false, code: 500, message: verifyTracingTypeName.error }; }
    if(verifyTracingTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'tracing-type-name-already-exist' }; }
    else{
        let createTracingType = await bd.createTracingTypeQuery(tracingTypeData).then((res) => res);
        if(createTracingType.error){ return { status: false, code: 500, message: createTracingType.error }; }
        if(createTracingType.result.rowsAffected > 0){ return { status: true, ctiposeguimiento: createTracingType.result.recordset[0].CTIPOSEGUIMIENTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTracingType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailTracingType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailTracingType' } });
        });
    }
});

const operationDetailTracingType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctiposeguimiento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let tracingTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiposeguimiento: requestBody.ctiposeguimiento
    };
    let getTracingTypeData = await bd.getTracingTypeDataQuery(tracingTypeData).then((res) => res);
    if(getTracingTypeData.error){ return { status: false, code: 500, message: getTracingTypeData.error }; }
    if(getTracingTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctiposeguimiento: getTracingTypeData.result.recordset[0].CTIPOSEGUIMIENTO,
            xtiposeguimiento: getTracingTypeData.result.recordset[0].XTIPOSEGUIMIENTO,
            bactivo: getTracingTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Tracing Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateTracingType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateTracingType' } });
        });
    }
});

const operationUpdateTracingType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiposeguimiento', 'xtiposeguimiento', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let tracingTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctiposeguimiento: requestBody.ctiposeguimiento,
        xtiposeguimiento: requestBody.xtiposeguimiento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyTracingTypeName = await bd.verifyTracingTypeNameToUpdateQuery(tracingTypeData).then((res) => res);
    if(verifyTracingTypeName.error){ return { status: false, code: 500, message: verifyTracingTypeName.error }; }
    if(verifyTracingTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'tracing-type-name-already-exist'}; }
    else{
        let updateTracingType = await bd.updateTracingTypeQuery(tracingTypeData).then((res) => res);
        if(updateTracingType.error){ return { status: false, code: 500, message: updateTracingType.error }; }
        if(updateTracingType.result.rowsAffected > 0){ return { status: true, ctiposeguimiento: updateTracingType.ctiposeguimiento }; }
        else{ return { status: false, code: 404, message: 'Tracing Type not found.' }; }
    }
}

module.exports = router;