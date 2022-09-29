const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchService' } });
        });
    }
});

const operationSearchService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiposervicio: requestBody.ctiposervicio,
        xservicio: requestBody.xservicio ? requestBody.xservicio.toUpperCase() : undefined
    }
    console.log(searchData);
    let searchInsurerService = await bd.searchInsurerServiceQuery(searchData).then((res) => res);
    if(searchInsurerService.error){ return { status: false, code: 500, message: searchService.error }; }
    if(searchInsurerService.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchInsurerService.result.recordset.length; i++){
            jsonList.push({
                cservicio: searchInsurerService.result.recordset[i].CSERVICIO_ASEG,
                xservicio: searchInsurerService.result.recordset[i].XSERVICIO_ASEG,
                ctiposervicio: searchInsurerService.result.recordset[i].CTIPOSERVICIO,
                xtiposervicio: searchInsurerService.result.recordset[i].XTIPOSERVICIO,
                fcreacion: searchInsurerService.result.recordset[i].FCREACION,
                bactivo: searchInsurerService.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Service not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateService' } });
        });
    }
});

const operationCreateService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xservicio', 'ctiposervicio', 'bactivo', 'cpais', 'ccompania', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceData = {
        xservicio: requestBody.xservicio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyServiceName = await bd.verifyServiceNameToCreateQuery(serviceData).then((res) => res);
    if(verifyServiceName.error){ return { status: false, code: 500, message: verifyServiceName.error }; }
    if(verifyServiceName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-name-already-exist' }; }
    else{
        let createService = await bd.createServiceInsurerQuery(serviceData).then((res) => res);
        if(createService.error){ return { status: false, code: 500, message: createService.error }; }
        if(createService.result.rowsAffected > 0){ return { status: true, cservicio: createService.result.recordset[0].CSERVICIO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createService' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailService' } })
        });
    }
});

const operationDetailService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cservicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cservicio: requestBody.cservicio
    };
    let getServiceData = await bd.getServiceInsurerDataQuery(serviceData).then((res) => res);
    if(getServiceData.error){ return { status: false, code: 500, message: getServiceData.error }; }
    if(getServiceData.result.rowsAffected > 0){
        return { 
            status: true,
            cservicio: getServiceData.result.recordset[0].CSERVICIO_ASEG,
            xservicio: getServiceData.result.recordset[0].XSERVICIO_ASEG,
            ctiposervicio: getServiceData.result.recordset[0].CTIPOSERVICIO,
            xtiposervicio: getServiceData.result.recordset[0].XTIPOSERVICIO,   
            bactivo: getServiceData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Service not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateService' } })
        });
    }
});

const operationUpdateService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cservicio', 'xservicio', 'ctiposervicio', 'bactivo', 'cpais', 'ccompania', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceData = {
        cservicio: requestBody.cservicio,
        xservicio: requestBody.xservicio.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyServiceName = await bd.verifyServiceNameToUpdateQuery(serviceData).then((res) => res);
    if(verifyServiceName.error){ return { status: false, code: 500, message: verifyServiceName.error }; }
    if(verifyServiceName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-name-already-exist'}; }
    else{
        let updateService = await bd.updateServiceQuery(serviceData).then((res) => res);
        if(updateService.error){ return { status: false, code: 500, message: updateService.error }; }
        if(updateService.result.rowsAffected > 0){ return { status: true, cservicio: serviceData.cservicio }; }
        else{ return { status: false, code: 404, message: 'Service not found.' }; }
    }
}

module.exports = router;