const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchExtraCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchExtraCoverage' } });
        });
    }
});

const operationSearchExtraCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        casociado: requestBody.casociado ? requestBody.casociado : undefined,
        xdescripcion: requestBody.xdescripcion ? helper.encrypt(requestBody.xdescripcion.toUpperCase()) : undefined
    }
    let searchExtraCoverage = await bd.searchExtraCoverageQuery(searchData).then((res) => res);
    if(searchExtraCoverage.error){ return { status: false, code: 500, message: searchExtraCoverage.error }; }
    if(searchExtraCoverage.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchExtraCoverage.result.recordset.length; i++){
            jsonList.push({
                ccoberturaextra: searchExtraCoverage.result.recordset[i].CCOBERTURAEXTRA,
                xdescripcion: helper.decrypt(searchExtraCoverage.result.recordset[i].XDESCRIPCION),
                ccliente: searchExtraCoverage.result.recordset[i].CCLIENTE,
                xcliente: helper.decrypt(searchExtraCoverage.result.recordset[i].XCLIENTE),
                casociado: searchExtraCoverage.result.recordset[i].CASOCIADO,
                xasociado: helper.decrypt(searchExtraCoverage.result.recordset[i].XASOCIADO),
                bactivo: searchExtraCoverage.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Extra Coverage not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateExtraCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateExtraCoverage' } });
        });
    }
});

const operationCreateExtraCoverage = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'ccobertura', 'cconceptocobertura', 'xdescripcion', 'fefectiva', 'mcoberturaextra', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let vehicleTypes = [];
    if(requestBody.vehicleTypes){
        vehicleTypes = requestBody.vehicleTypes;
        for(let i = 0; i < vehicleTypes.length; i++){
            if(!helper.validateRequestObj(vehicleTypes[i], ['ctipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
        }
    }
    let extraCoverageData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        vehicleTypes: vehicleTypes ? vehicleTypes : undefined,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        ccobertura: requestBody.ccobertura,
        cconceptocobertura: requestBody.cconceptocobertura,
        xdescripcion: helper.encrypt(requestBody.xdescripcion.toUpperCase()),
        fefectiva: requestBody.fefectiva,
        mcoberturaextra: requestBody.mcoberturaextra,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyExtraCoverageDescription = await bd.verifyExtraCoverageDescriptionToCreateQuery(extraCoverageData).then((res) => res);
    if(verifyExtraCoverageDescription.error){ return { status: false, code: 500, message: verifyExtraCoverageDescription.error }; }
    if(verifyExtraCoverageDescription.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'description-already-exist' }; }
    else{
        let createExtraCoverage = await bd.createExtraCoverageQuery(extraCoverageData).then((res) => res);
        if(createExtraCoverage.error){ return { status: false, code: 500, message: createExtraCoverage.error }; }
        if(createExtraCoverage.result.rowsAffected > 0){ return { status: true, ccoberturaextra: createExtraCoverage.result.recordset[0].CCOBERTURAEXTRA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createExtraCoverage' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailExtraCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailExtraCoverage' } });
        });
    }
});

const operationDetailExtraCoverage = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccoberturaextra'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let extraCoverageData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccoberturaextra: requestBody.ccoberturaextra
    };
    let getExtraCoverageData = await bd.getExtraCoverageDataQuery(extraCoverageData).then((res) => res);
    if(getExtraCoverageData.error){ return { status: false, code: 500, message: getExtraCoverageData.error }; }
    if(getExtraCoverageData.result.rowsAffected > 0){
        let vehicleTypes = [];
        let getExtraCoverageVehicleTypesData = await bd.getExtraCoverageVehicleTypesDataQuery(extraCoverageData.ccoberturaextra).then((res) => res);
        if(getExtraCoverageVehicleTypesData.error){ return { status: false, code: 500, message: getExtraCoverageVehicleTypesData.error }; }
        if(getExtraCoverageVehicleTypesData.result.rowsAffected > 0){
            for(let i = 0; i < getExtraCoverageVehicleTypesData.result.recordset.length; i++){
                let vehicleType = {
                    ctipovehiculo: getExtraCoverageVehicleTypesData.result.recordset[i].CTIPOVEHICULO,
                    xtipovehiculo: getExtraCoverageVehicleTypesData.result.recordset[i].XTIPOVEHICULO
                }
                vehicleTypes.push(vehicleType);
            }
        }
        return {
            status: true,
            ccoberturaextra: getExtraCoverageData.result.recordset[0].CCOBERTURAEXTRA,
            ccliente: getExtraCoverageData.result.recordset[0].CCLIENTE,
            casociado:  getExtraCoverageData.result.recordset[0].CASOCIADO,
            ccobertura: getExtraCoverageData.result.recordset[0].CCOBERTURA,
            cconceptocobertura: getExtraCoverageData.result.recordset[0].CCONCEPTOCOBERTURA,
            xdescripcion: helper.decrypt(getExtraCoverageData.result.recordset[0].XDESCRIPCION),
            fefectiva: getExtraCoverageData.result.recordset[0].FEFECTIVA,
            mcoberturaextra: getExtraCoverageData.result.recordset[0].MCOBERTURAEXTRA,
            bactivo: getExtraCoverageData.result.recordset[0].BACTIVO,
            vehicleTypes: vehicleTypes
        }
    }else{ return { status: false, code: 404, message: 'Extra Coverage not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateExtraCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateExtraCoverage' } });
        });
    }
});

const operationUpdateExtraCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccoberturaextra', 'ccliente', 'casociado', 'ccobertura', 'cconceptocobertura', 'xdescripcion', 'fefectiva', 'mcoberturaextra', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let extraCoverageData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccoberturaextra: requestBody.ccoberturaextra,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        ccobertura: requestBody.ccobertura,
        cconceptocobertura: requestBody.cconceptocobertura,
        xdescripcion: helper.encrypt(requestBody.xdescripcion.toUpperCase()),
        fefectiva: requestBody.fefectiva,
        mcoberturaextra: requestBody.mcoberturaextra,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyExtraCoverageDescription = await bd.verifyExtraCoverageDescriptionToUpdateQuery(extraCoverageData).then((res) => res);
    if(verifyExtraCoverageDescription.error){ return { status: false, code: 500, message: verifyExtraCoverageDescription.error }; }
    if(verifyExtraCoverageDescription.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'description-already-exist' }; }
    else{
        let updateExtraCoverage = await bd.updateExtraCoverageQuery(extraCoverageData).then((res) => res);
        if(updateExtraCoverage.error){ return { status: false, code: 500, message: updateExtraCoverage.error }; }
        if(updateExtraCoverage.result.rowsAffected > 0){
            if(requestBody.vehicleTypes){
                if(requestBody.vehicleTypes.create && requestBody.vehicleTypes.create.length > 0){
                    for(let i = 0; i < requestBody.vehicleTypes.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.create[i], ['ctipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let createVehicleTypesByExtraCoverageUpdate = await bd.createVehicleTypesByExtraCoverageUpdateQuery(requestBody.vehicleTypes.create, extraCoverageData).then((res) => res);
                    if(createVehicleTypesByExtraCoverageUpdate.error){ return { status: false, code: 500, message: createVehicleTypesByExtraCoverageUpdate.error }; }
                    if(createVehicleTypesByExtraCoverageUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createVehicleTypesByExtraCoverageUpdate' }; }
                } 
                if(requestBody.vehicleTypes.update && requestBody.vehicleTypes.update.length > 0){
                    for(let i = 0; i < requestBody.vehicleTypes.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.update[i], ['ctipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let updateVehicleTypesByExtraCoverageUpdate = await bd.updateVehicleTypesByExtraCoverageUpdateQuery(requestBody.vehicleTypes.update, extraCoverageData).then((res) => res);
                    if(updateVehicleTypesByExtraCoverageUpdate.error){ return { status: false, code: 500, message: updateVehicleTypesByExtraCoverageUpdate.error }; }
                    if(updateVehicleTypesByExtraCoverageUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Vehicle Type not found.' }; }
                }
                if(requestBody.vehicleTypes.delete && requestBody.vehicleTypes.delete.length){
                    for(let i = 0; i < requestBody.vehicleTypes.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.delete[i], ['ctipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteVehicleTypesByExtraCoverageUpdate = await bd.deleteVehicleTypesByExtraCoverageUpdateQuery(requestBody.vehicleTypes.delete, extraCoverageData).then((res) => res);
                    if(deleteVehicleTypesByExtraCoverageUpdate.error){ return { status: false, code: 500, message: deleteVehicleTypesByExtraCoverageUpdate.error }; }
                    if(deleteVehicleTypesByExtraCoverageUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteVehicleTypesByExtraCoverageUpdate' }; }
                }
            }
            return { status: true, ccoberturaextra: extraCoverageData.ccoberturaextra }; 
        }
        else{ return { status: false, code: 404, message: 'Extra Coverage not found.' }; }
    }
}

module.exports = router;