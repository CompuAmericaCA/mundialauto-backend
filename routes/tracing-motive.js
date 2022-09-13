const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchTracingMotive(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTracingMotive' } });
        });
    }
});

const operationSearchTracingMotive = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xmotivoseguimiento: requestBody.xmotivoseguimiento ? requestBody.xmotivoseguimiento.toUpperCase() : undefined
    };
    let searchTracingMotive = await bd.searchTracingMotiveQuery(searchData).then((res) => res);
    if(searchTracingMotive.error){ return  { status: false, code: 500, message: searchTracingMotive.error }; }
    if(searchTracingMotive.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchTracingMotive.result.recordset.length; i++){
            jsonList.push({
                cmotivoseguimiento: searchTracingMotive.result.recordset[i].CMOTIVOSEGUIMIENTO,
                xmotivoseguimiento: searchTracingMotive.result.recordset[i].XMOTIVOSEGUIMIENTO,
                bactivo: searchTracingMotive.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Tracing Motive not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateTracingMotive(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateTracingMotive' } });
        });
    }
});

const operationCreateTracingMotive = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xmotivoseguimiento', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let tracingMotiveData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xmotivoseguimiento: requestBody.xmotivoseguimiento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyTracingMotiveName = await bd.verifyTracingMotiveNameToCreateQuery(tracingMotiveData).then((res) => res);
    if(verifyTracingMotiveName.error){ return { status: false, code: 500, message: verifyTracingMotiveName.error }; }
    if(verifyTracingMotiveName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'tracing-motive-name-already-exist' }; }
    else{
        let createTracingMotive = await bd.createTracingMotiveQuery(tracingMotiveData).then((res) => res);
        if(createTracingMotive.error){ return { status: false, code: 500, message: createTracingMotive.error }; }
        if(createTracingMotive.result.rowsAffected > 0){ return { status: true, cmotivoseguimiento: createTracingMotive.result.recordset[0].CMOTIVOSEGUIMIENTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTracingMotive' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailTracingMotive(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailTracingMotive' } });
        });
    }
});

const operationDetailTracingMotive = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cmotivoseguimiento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let tracingMotiveData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cmotivoseguimiento: requestBody.cmotivoseguimiento
    };
    let getTracingMotiveData = await bd.getTracingMotiveDataQuery(tracingMotiveData).then((res) => res);
    if(getTracingMotiveData.error){ return { status: false, code: 500, message: getTracingMotiveData.error }; }
    if(getTracingMotiveData.result.rowsAffected > 0){
        return {
            status: true,
            cmotivoseguimiento: getTracingMotiveData.result.recordset[0].CMOTIVOSEGUIMIENTO,
            xmotivoseguimiento: getTracingMotiveData.result.recordset[0].XMOTIVOSEGUIMIENTO,
            bactivo: getTracingMotiveData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Tracing Motive not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateTracingMotive(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateTracingMotive' } });
        });
    }
});

const operationUpdateTracingMotive = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cmotivoseguimiento', 'xmotivoseguimiento', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let tracingMotiveData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cmotivoseguimiento: requestBody.cmotivoseguimiento,
        xmotivoseguimiento: requestBody.xmotivoseguimiento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyTracingMotiveName = await bd.verifyTracingMotiveNameToUpdateQuery(tracingMotiveData).then((res) => res);
    if(verifyTracingMotiveName.error){ return { status: false, code: 500, message: verifyTracingMotiveName.error }; }
    if(verifyTracingMotiveName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'tracing-motive-name-already-exist'}; }
    else{
        let updateTracingMotive = await bd.updateTracingMotiveQuery(tracingMotiveData).then((res) => res);
        if(updateTracingMotive.error){ return { status: false, code: 500, message: updateTracingMotive.error }; }
        if(updateTracingMotive.result.rowsAffected > 0){ return { status: true, cmotivoseguimiento: updateTracingMotive.cmotivoseguimiento }; }
        else{ return { status: false, code: 404, message: 'Tracing Motive not found.' }; }
    }
}

module.exports = router;