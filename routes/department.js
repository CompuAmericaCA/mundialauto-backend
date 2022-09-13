const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchDepartment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchDepartment' } });
        });
    }
});

const operationSearchDepartment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xdepartamento: requestBody.xdepartamento ? requestBody.xdepartamento.toUpperCase() : undefined
    };
    let searchDepartment = await bd.searchDepartmentQuery(searchData).then((res) => res);
    if(searchDepartment.error){ return  { status: false, code: 500, message: searchDepartment.error }; }
    if(searchDepartment.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchDepartment.result.recordset.length; i++){
            jsonList.push({
                cdepartamento: searchDepartment.result.recordset[i].CDEPARTAMENTO,
                xdepartamento: searchDepartment.result.recordset[i].XDEPARTAMENTO,
                bactivo: searchDepartment.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Department not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateDepartment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateDepartment' } });
        });
    }
});

const operationCreateDepartment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xdepartamento', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let departmentData = {
        xdepartamento: requestBody.xdepartamento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyDepartmentName = await bd.verifyDepartmentNameToCreateQuery(departmentData.xdepartamento).then((res) => res);
    if(verifyDepartmentName.error){ return { status: false, code: 500, message: verifyDepartmentName.error }; }
    if(verifyDepartmentName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'department-name-already-exist' }; }
    else{
        let createDepartment = await bd.createDepartmentQuery(departmentData).then((res) => res);
        if(createDepartment.error){ return { status: false, code: 500, message: createDepartment.error }; }
        if(createDepartment.result.rowsAffected > 0){ return { status: true, cdepartamento: createDepartment.result.recordset[0].CDEPARTAMENTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDepartment' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailDepartment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailDepartment' } });
        });
    }
});

const operationDetailDepartment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cdepartamento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cdepartamento = requestBody.cdepartamento;
    let getDepartmentData = await bd.getDepartmentDataQuery(cdepartamento).then((res) => res);
    if(getDepartmentData.error){ return { status: false, code: 500, message: getDepartmentData.error }; }
    if(getDepartmentData.result.rowsAffected > 0){
        return {
            status: true,
            cdepartamento: getDepartmentData.result.recordset[0].CDEPARTAMENTO,
            xdepartamento: getDepartmentData.result.recordset[0].XDEPARTAMENTO,
            bactivo: getDepartmentData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Department not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateDepartment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateDepartment' } });
        });
    }
});

const operationUpdateDepartment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cdepartamento', 'xdepartamento', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let departmentData = {
        cdepartamento: requestBody.cdepartamento,
        xdepartamento: requestBody.xdepartamento.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyDepartmentName = await bd.verifyDepartmentNameToUpdateQuery(departmentData.cdepartamento, departmentData.xdepartamento).then((res) => res);
    if(verifyDepartmentName.error){ return { status: false, code: 500, message: verifyDepartmentName.error }; }
    if(verifyDepartmentName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'department-name-already-exist'}; }
    else{
        let updateDepartment = await bd.updateDepartmentQuery(departmentData).then((res) => res);
        if(updateDepartment.error){ return { status: false, code: 500, message: updateDepartment.error }; }
        if(updateDepartment.result.rowsAffected > 0){ return { status: true, cdepartamento: updateDepartment.cdepartamento }; }
        else{ return { status: false, code: 404, message: 'Department not found.' }; }
    }
}

module.exports = router;