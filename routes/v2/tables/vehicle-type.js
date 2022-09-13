const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'vehicle-type', req.body, 'searchTablesProductionVehicleTypeSchema');
    if(validateSchema.error){
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchVehicleType' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        xtipovehiculo: requestBody.xtipovehiculo ? requestBody.xtipovehiculo.toUpperCase() : undefined
    };
    let searchVehicleType = await db.searchVehicleTypeQuery(searchData).then((res) => res);
    if(searchVehicleType.error){ return { status: false, code: 500, message: searchVehicleType.error }; }
    if(searchVehicleType.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Vehicle Type not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchVehicleType.result.recordset.length; i++){
        jsonList.push({
            ctipovehiculo: searchVehicleType.result.recordset[i].CTIPOVEHICULO,
            xtipovehiculo: searchVehicleType.result.recordset[i].XTIPOVEHICULO,
            bactivo: searchVehicleType.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'vehicle-type', req.body, 'createTablesProductionVehicleTypeSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateVehicleType' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let vehicleTypeData = {
        cpais: requestBody.cpais,
        xtipovehiculo: requestBody.xtipovehiculo.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyVehicleTypeName = await db.verifyVehicleTypeNameToCreateQuery(vehicleTypeData).then((res) => res);
    if(verifyVehicleTypeName.error){ return { status: false, code: 500, message: verifyVehicleTypeName.error }; }
    if(verifyVehicleTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-type-name-already-exist' }; }
    let createVehicleType = await db.createVehicleTypeQuery(vehicleTypeData).then((res) => res);
    if(createVehicleType.error){ return { status: false, code: 500, message: createVehicleType.error }; }
    if(createVehicleType.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createVehicleType' }; }
    return { status: true, ctipovehiculo: createVehicleType.result.recordset[0].CTIPOVEHICULO };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'vehicle-type', req.body, 'detailTablesProductionVehicleTypeSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailVehicleType' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let vehicleTypeData = {
        cpais: requestBody.cpais,
        ctipovehiculo: requestBody.ctipovehiculo
    };
    let getVehicleTypeData = await db.getVehicleTypeDataQuery(vehicleTypeData).then((res) => res);
    if(getVehicleTypeData.error){ return { status: false, code: 500, message: getVehicleTypeData.error }; }
    if(getVehicleTypeData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Vehicle Type not found.' }; }
    return {
        status: true,
        ctipovehiculo: getVehicleTypeData.result.recordset[0].CTIPOVEHICULO,
        xtipovehiculo: getVehicleTypeData.result.recordset[0].XTIPOVEHICULO,
        bactivo: getVehicleTypeData.result.recordset[0].BACTIVO
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'vehicle-type', req.body, 'updateTablesProductionVehicleTypeSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateVehicleType' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let vehicleTypeData = {
        cpais: requestBody.cpais,
        ctipovehiculo: requestBody.ctipovehiculo,
        xtipovehiculo: requestBody.xtipovehiculo.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyVehicleTypeName = await db.verifyVehicleTypeNameToUpdateQuery(vehicleTypeData).then((res) => res);
    if(verifyVehicleTypeName.error){ return { status: false, code: 500, message: verifyVehicleTypeName.error }; }
    if(verifyVehicleTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-type-name-already-exist'}; }
    let updateVehicleType = await db.updateVehicleTypeQuery(vehicleTypeData).then((res) => res);
    if(updateVehicleType.error){ return { status: false, code: 500, message: updateVehicleType.error }; }
    if(updateVehicleType.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Vehicle Type not found.' }; }
    return { status: true, ctipovehiculo: vehicleTypeData.ctipovehiculo };
}

module.exports = router;