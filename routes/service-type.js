const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchServiceType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceType' } });
        });
    }
});

const operationSearchServiceType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
   /* if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiposervicio: requestBody.xtiposervicio ? requestBody.xtiposervicio.toUpperCase() : undefined
    };*/
    let searchServiceType = await bd.searchServiceTypeQuery().then((res) => res);
    if(searchServiceType.error){ return  { status: false, code: 500, message: searchServiceType.error }; }
    if(searchServiceType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchServiceType.result.recordset.length; i++){
            jsonList.push({
                ctiposervicio: searchServiceType.result.recordset[i].CTIPOSERVICIO,
                xtiposervicio: searchServiceType.result.recordset[i].XTIPOSERVICIO,
                bactivo: searchServiceType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Service Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateServiceType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateServiceType' } });
        });
    }
});

const operationCreateServiceType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtiposervicio', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiposervicio: requestBody.xtiposervicio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyServiceTypeName = await bd.verifyServiceTypeNameToCreateQuery(serviceTypeData).then((res) => res);
    if(verifyServiceTypeName.error){ return { status: false, code: 500, message: verifyServiceTypeName.error }; }
    if(verifyServiceTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-type-name-already-exist' }; }
    else{
        let createServiceType = await bd.createServiceTypeQuery(serviceTypeData).then((res) => res);
        if(createServiceType.error){ return { status: false, code: 500, message: createServiceType.error }; }
        if(createServiceType.result.rowsAffected > 0){ return { status: true, ctiposervicio: createServiceType.result.recordset[0].CTIPOSERVICIO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServiceType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailServiceType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailServiceType' } });
        });
    }
});

const operationDetailServiceType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctiposervicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiposervicio: requestBody.ctiposervicio
    };
    let getServiceTypeData = await bd.getServiceTypeDataQuery(serviceTypeData).then((res) => res);
    if(getServiceTypeData.error){ return { status: false, code: 500, message: getServiceTypeData.error }; }
    if(getServiceTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctiposervicio: getServiceTypeData.result.recordset[0].CTIPOSERVICIO,
            xtiposervicio: getServiceTypeData.result.recordset[0].XTIPOSERVICIO,
            bactivo: getServiceTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Service Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateServiceType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateServiceType' } });
        });
    }
});

const operationUpdateServiceType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiposervicio', 'xtiposervicio', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctiposervicio: requestBody.ctiposervicio,
        xtiposervicio: requestBody.xtiposervicio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyServiceTypeName = await bd.verifyServiceTypeNameToUpdateQuery(serviceTypeData).then((res) => res);
    if(verifyServiceTypeName.error){ return { status: false, code: 500, message: verifyServiceTypeName.error }; }
    if(verifyServiceTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-type-name-already-exist'}; }
    else{
        let updateServiceType = await bd.updateServiceTypeQuery(serviceTypeData).then((res) => res);
        if(updateServiceType.error){ return { status: false, code: 500, message: updateServiceType.error }; }
        if(updateServiceType.result.rowsAffected > 0){ return { status: true, ctiposervicio: serviceTypeData.ctiposervicio }; }
        else{ return { status: false, code: 404, message: 'Service Type not found.' }; }
    }
}

module.exports = router;