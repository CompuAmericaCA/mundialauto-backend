const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchServiceDepletionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceDepletionType' } });
        });
    }
});

const operationSearchServiceDepletionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoagotamientoservicio: requestBody.xtipoagotamientoservicio ? requestBody.xtipoagotamientoservicio.toUpperCase() : undefined
    };
    let searchServiceDepletionType = await bd.searchServiceDepletionTypeQuery(searchData).then((res) => res);
    if(searchServiceDepletionType.error){ return  { status: false, code: 500, message: searchServiceDepletionType.error }; }
    if(searchServiceDepletionType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchServiceDepletionType.result.recordset.length; i++){
            jsonList.push({
                ctipoagotamientoservicio: searchServiceDepletionType.result.recordset[i].CTIPOAGOTAMIENTOSERVICIO,
                xtipoagotamientoservicio: searchServiceDepletionType.result.recordset[i].XTIPOAGOTAMIENTOSERVICIO,
                bactivo: searchServiceDepletionType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Service Depletion Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateServiceDepletionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateServiceDepletionType' } });
        });
    }
});

const operationCreateServiceDepletionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtipoagotamientoservicio', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceDepletionTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipoagotamientoservicio: requestBody.xtipoagotamientoservicio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyServiceDepletionTypeName = await bd.verifyServiceDepletionTypeNameToCreateQuery(serviceDepletionTypeData).then((res) => res);
    if(verifyServiceDepletionTypeName.error){ return { status: false, code: 500, message: verifyServiceDepletionTypeName.error }; }
    if(verifyServiceDepletionTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-depletion-type-name-already-exist' }; }
    else{
        let createServiceDepletionType = await bd.createServiceDepletionTypeQuery(serviceDepletionTypeData).then((res) => res);
        if(createServiceDepletionType.error){ return { status: false, code: 500, message: createServiceDepletionType.error }; }
        if(createServiceDepletionType.result.rowsAffected > 0){ return { status: true, ctipoagotamientoservicio: createServiceDepletionType.result.recordset[0].CTIPOAGOTAMIENTOSERVICIO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServiceDepletionType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailServiceDepletionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailServiceDepletionType' } });
        });
    }
});

const operationDetailServiceDepletionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctipoagotamientoservicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceDepletionTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoagotamientoservicio: requestBody.ctipoagotamientoservicio
    };
    let getServiceDepletionTypeData = await bd.getServiceDepletionTypeDataQuery(serviceDepletionTypeData).then((res) => res);
    if(getServiceDepletionTypeData.error){ return { status: false, code: 500, message: getServiceDepletionTypeData.error }; }
    if(getServiceDepletionTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipoagotamientoservicio: getServiceDepletionTypeData.result.recordset[0].CTIPOAGOTAMIENTOSERVICIO,
            xtipoagotamientoservicio: getServiceDepletionTypeData.result.recordset[0].XTIPOAGOTAMIENTOSERVICIO,
            bactivo: getServiceDepletionTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Service Depletion Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateServiceDepletionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateServiceDepletionType' } });
        });
    }
});

const operationUpdateServiceDepletionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctipoagotamientoservicio', 'xtipoagotamientoservicio', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceDepletionTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctipoagotamientoservicio: requestBody.ctipoagotamientoservicio,
        xtipoagotamientoservicio: requestBody.xtipoagotamientoservicio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyServiceDepletionTypeName = await bd.verifyServiceDepletionTypeNameToUpdateQuery(serviceDepletionTypeData).then((res) => res);
    if(verifyServiceDepletionTypeName.error){ return { status: false, code: 500, message: verifyServiceDepletionTypeName.error }; }
    if(verifyServiceDepletionTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-depletion-type-name-already-exist'}; }
    else{
        let updateServiceDepletionType = await bd.updateServiceDepletionTypeQuery(serviceDepletionTypeData).then((res) => res);
        if(updateServiceDepletionType.error){ return { status: false, code: 500, message: updateServiceDepletionType.error }; }
        if(updateServiceDepletionType.result.rowsAffected > 0){ return { status: true, ctipoagotamientoservicio: serviceDepletionTypeData.ctipoagotamientoservicio }; }
        else{ return { status: false, code: 404, message: 'Service Depletion Type not found.' }; }
    }
}

module.exports = router;