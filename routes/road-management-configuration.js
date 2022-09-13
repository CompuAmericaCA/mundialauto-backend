const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchRoadManagementConfiguration(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchRoadManagementConfiguration' } });
        });
    }
});

const operationSearchRoadManagementConfiguration = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        casociado: requestBody.casociado ? requestBody.casociado : undefined
    }
    let searchRoadManagementConfiguration = await bd.searchRoadManagementConfigurationQuery(searchData).then((res) => res);
    if(searchRoadManagementConfiguration.error){ return { status: false, code: 500, message: searchRoadManagementConfiguration.error }; }
    if(searchRoadManagementConfiguration.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchRoadManagementConfiguration.result.recordset.length; i++){
            jsonList.push({
                cconfiguraciongestionvial: searchRoadManagementConfiguration.result.recordset[i].CCONFIGURACIONGESTIONVIAL,
                ccliente: searchRoadManagementConfiguration.result.recordset[i].CCLIENTE,
                xcliente: helper.decrypt(searchRoadManagementConfiguration.result.recordset[i].XCLIENTE),
                casociado: searchRoadManagementConfiguration.result.recordset[i].CASOCIADO,
                xasociado: helper.decrypt(searchRoadManagementConfiguration.result.recordset[i].XASOCIADO),
                bactivo: searchRoadManagementConfiguration.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Road Management Configuration not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateRoadManagementConfiguration(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateRoadManagementConfiguration' } });
        });
    }
});

const operationCreateRoadManagementConfiguration = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let vehicleTypes = [];
    if(requestBody.vehicleTypes){
        vehicleTypes = requestBody.vehicleTypes;
        for(let i = 0; i < vehicleTypes.length; i++){
            if(!helper.validateRequestObj(vehicleTypes[i], ['ctipovehiculo', 'fefectiva', 'mtipovehiculoconfiguraciongestionvial', 'nlimiteano', 'mmayorlimiteano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
        }
    }
    let roadManagementConfigurationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        vehicleTypes: vehicleTypes ? vehicleTypes : undefined,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyRoadManagementConfigurationAssociate = await bd.verifyRoadManagementConfigurationAssociateToCreateQuery(roadManagementConfigurationData).then((res) => res);
    if(verifyRoadManagementConfigurationAssociate.error){ return { status: false, code: 500, message: verifyRoadManagementConfigurationAssociate.error }; }
    if(verifyRoadManagementConfigurationAssociate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-already-exist' }; }
    else{
        let createRoadManagementConfiguration = await bd.createRoadManagementConfigurationQuery(roadManagementConfigurationData).then((res) => res);
        if(createRoadManagementConfiguration.error){ return { status: false, code: 500, message: createRoadManagementConfiguration.error }; }
        if(createRoadManagementConfiguration.result.rowsAffected > 0){ return { status: true, cconfiguraciongestionvial: createRoadManagementConfiguration.result.recordset[0].CCONFIGURACIONGESTIONVIAL }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createRoadManagementConfiguration' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailRoadManagementConfiguration(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailRoadManagementConfiguration' } });
        });
    }
});

const operationDetailRoadManagementConfiguration = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cconfiguraciongestionvial'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let roadManagementConfigurationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cconfiguraciongestionvial: requestBody.cconfiguraciongestionvial
    };
    let getRoadManagementConfigurationData = await bd.getRoadManagementConfigurationDataQuery(roadManagementConfigurationData).then((res) => res);
    if(getRoadManagementConfigurationData.error){ return { status: false, code: 500, message: getRoadManagementConfigurationData.error }; }
    if(getRoadManagementConfigurationData.result.rowsAffected > 0){
        let vehicleTypes = [];
        let getRoadManagementConfigurationVehicleTypesData = await bd.getRoadManagementConfigurationVehicleTypesDataQuery(roadManagementConfigurationData.cconfiguraciongestionvial).then((res) => res);
        if(getRoadManagementConfigurationVehicleTypesData.error){ return { status: false, code: 500, message: getRoadManagementConfigurationVehicleTypesData.error }; }
        if(getRoadManagementConfigurationVehicleTypesData.result.rowsAffected > 0){
            for(let i = 0; i < getRoadManagementConfigurationVehicleTypesData.result.recordset.length; i++){
                let vehicleType = {
                    ctipovehiculo: getRoadManagementConfigurationVehicleTypesData.result.recordset[i].CTIPOVEHICULO,
                    xtipovehiculo: getRoadManagementConfigurationVehicleTypesData.result.recordset[i].XTIPOVEHICULO,
                    fefectiva: getRoadManagementConfigurationVehicleTypesData.result.recordset[i].FEFECTIVA,
                    mtipovehiculoconfiguraciongestionvial: getRoadManagementConfigurationVehicleTypesData.result.recordset[i].MTIPOVEHICULOCONFIGURACIONGESTIONVIAL,
                    nlimiteano: getRoadManagementConfigurationVehicleTypesData.result.recordset[i].NLIMITEANO,
                    mmayorlimiteano: getRoadManagementConfigurationVehicleTypesData.result.recordset[i].MMAYORLIMITEANO
                }
                vehicleTypes.push(vehicleType);
            }
        }
        return {
            status: true,
            cconfiguraciongestionvial: getRoadManagementConfigurationData.result.recordset[0].CCONFIGURACIONGESTIONVIAL,
            ccliente: getRoadManagementConfigurationData.result.recordset[0].CCLIENTE,
            casociado:  getRoadManagementConfigurationData.result.recordset[0].CASOCIADO,
            bactivo: getRoadManagementConfigurationData.result.recordset[0].BACTIVO,
            vehicleTypes: vehicleTypes
        }
    }else{ return { status: false, code: 404, message: 'Road Management Configuration not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateRoadManagementConfiguration(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateRoadManagementConfiguration' } });
        });
    }
});

const operationUpdateRoadManagementConfiguration = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cconfiguraciongestionvial', 'ccliente', 'casociado', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let roadManagementConfigurationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cconfiguraciongestionvial: requestBody.cconfiguraciongestionvial,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyRoadManagementConfigurationAssociate = await bd.verifyRoadManagementConfigurationAssociateToUpdateQuery(roadManagementConfigurationData).then((res) => res);
    if(verifyRoadManagementConfigurationAssociate.error){ return { status: false, code: 500, message: verifyRoadManagementConfigurationAssociate.error }; }
    if(verifyRoadManagementConfigurationAssociate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-already-exist' }; }
    else{
        let updateRoadManagementConfiguration = await bd.updateRoadManagementConfigurationQuery(roadManagementConfigurationData).then((res) => res);
        if(updateRoadManagementConfiguration.error){ return { status: false, code: 500, message: updateRoadManagementConfiguration.error }; }
        if(updateRoadManagementConfiguration.result.rowsAffected > 0){
            if(requestBody.vehicleTypes){
                if(requestBody.vehicleTypes.create && requestBody.vehicleTypes.create.length > 0){
                    for(let i = 0; i < requestBody.vehicleTypes.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.create[i], ['ctipovehiculo', 'fefectiva', 'mtipovehiculoconfiguraciongestionvial', 'nlimiteano', 'mmayorlimiteano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let createVehicleTypesByRoadManagementConfigurationUpdate = await bd.createVehicleTypesByRoadManagementConfigurationUpdateQuery(requestBody.vehicleTypes.create, roadManagementConfigurationData).then((res) => res);
                    if(createVehicleTypesByRoadManagementConfigurationUpdate.error){ return { status: false, code: 500, message: createVehicleTypesByRoadManagementConfigurationUpdate.error }; }
                    if(createVehicleTypesByRoadManagementConfigurationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createVehicleTypesByRoadManagementConfigurationUpdate' }; }
                } 
                if(requestBody.vehicleTypes.update && requestBody.vehicleTypes.update.length > 0){
                    for(let i = 0; i < requestBody.vehicleTypes.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.update[i], ['ctipovehiculo', 'fefectiva', 'mtipovehiculoconfiguraciongestionvial', 'nlimiteano', 'mmayorlimiteano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let updateVehicleTypesByRoadManagementConfigurationUpdate = await bd.updateVehicleTypesByRoadManagementConfigurationUpdateQuery(requestBody.vehicleTypes.update, roadManagementConfigurationData).then((res) => res);
                    if(updateVehicleTypesByRoadManagementConfigurationUpdate.error){ return { status: false, code: 500, message: updateVehicleTypesByRoadManagementConfigurationUpdate.error }; }
                    if(updateVehicleTypesByRoadManagementConfigurationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Vehicle Type not found.' }; }
                }
                if(requestBody.vehicleTypes.delete && requestBody.vehicleTypes.delete.length){
                    for(let i = 0; i < requestBody.vehicleTypes.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.delete[i], ['ctipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteVehicleTypesByRoadManagementConfigurationUpdate = await bd.deleteVehicleTypesByRoadManagementConfigurationUpdateQuery(requestBody.vehicleTypes.delete, roadManagementConfigurationData).then((res) => res);
                    if(deleteVehicleTypesByRoadManagementConfigurationUpdate.error){ return { status: false, code: 500, message: deleteVehicleTypesByRoadManagementConfigurationUpdate.error }; }
                    if(deleteVehicleTypesByRoadManagementConfigurationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteVehicleTypesByRoadManagementConfigurationUpdate' }; }
                }
            }
            return { status: true, cconfiguraciongestionvial: roadManagementConfigurationData.cconfiguraciongestionvial }; 
        }
        else{ return { status: false, code: 404, message: 'Road Management Configuration not found.' }; }
    }
}

module.exports = router;
