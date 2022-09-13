const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchFeesRegister(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchFeesRegister' } });
        });
    }
});

const operationSearchFeesRegister = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        casociado: requestBody.casociado ? requestBody.casociado : undefined
    }
    let searchFeesRegister = await bd.searchFeesRegisterQuery(searchData).then((res) => res);
    if(searchFeesRegister.error){ return { status: false, code: 500, message: searchFeesRegister.error }; }
    if(searchFeesRegister.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchFeesRegister.result.recordset.length; i++){
            jsonList.push({
                cregistrotasa: searchFeesRegister.result.recordset[i].CREGISTROTASA,
                ccliente: searchFeesRegister.result.recordset[i].CCLIENTE,
                xcliente: helper.decrypt(searchFeesRegister.result.recordset[i].XCLIENTE),
                casociado: searchFeesRegister.result.recordset[i].CASOCIADO,
                xasociado: helper.decrypt(searchFeesRegister.result.recordset[i].XASOCIADO),
                bactivo: searchFeesRegister.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Fees Register not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateFeesRegister(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateFeesRegister' } });
        });
    }
});

const operationCreateFeesRegister = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let vehicleTypes = [];
    if(requestBody.vehicleTypes){
        vehicleTypes = requestBody.vehicleTypes;
        for(let i = 0; i < vehicleTypes.length; i++){
            if(!helper.validateRequestObj(vehicleTypes[i], ['ctipovehiculo', 'miniciointervalo', 'mfinalintervalo', 'ptasa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            if(vehicleTypes[i].intervals)
            for(let j = 0; j < vehicleTypes[i].intervals.length; j++){
                if(!helper.validateRequestObj(vehicleTypes[i].intervals[j], ['fanoinicio', 'fanofinal', 'ptasainterna'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
        }
    }
    let feesRegisterData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        vehicleTypes: vehicleTypes ? vehicleTypes : undefined,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyFeesRegisterAssociate = await bd.verifyFeesRegisterAssociateToCreateQuery(feesRegisterData).then((res) => res);
    if(verifyFeesRegisterAssociate.error){ return { status: false, code: 500, message: verifyFeesRegisterAssociate.error }; }
    if(verifyFeesRegisterAssociate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-already-exist' }; }
    else{
        let createFeesRegister = await bd.createFeesRegisterQuery(feesRegisterData).then((res) => res);
        if(createFeesRegister.error){ return { status: false, code: 500, message: createFeesRegister.error }; }
        if(createFeesRegister.result.rowsAffected > 0){ return { status: true, cregistrotasa: createFeesRegister.result.recordset[0].CREGISTROTASA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createFeesRegister' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailFeesRegister(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailFeesRegister' } });
        });
    }
});

const operationDetailFeesRegister = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cregistrotasa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let feesRegisterData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cregistrotasa: requestBody.cregistrotasa
    };
    let getFeesRegisterData = await bd.getFeesRegisterDataQuery(feesRegisterData).then((res) => res);
    if(getFeesRegisterData.error){ return { status: false, code: 500, message: getFeesRegisterData.error }; }
    if(getFeesRegisterData.result.rowsAffected > 0){
        let vehicleTypes = [];
        let getFeesRegisterVehicleTypesData = await bd.getFeesRegisterVehicleTypesDataQuery(feesRegisterData.cregistrotasa).then((res) => res);
        if(getFeesRegisterVehicleTypesData.error){ return { status: false, code: 500, message: getFeesRegisterVehicleTypesData.error }; }
        if(getFeesRegisterVehicleTypesData.result.rowsAffected > 0){
            for(let i = 0; i < getFeesRegisterVehicleTypesData.result.recordset.length; i++){
                let intervals = [];
                let getYearRangesVehicleTypeData = await bd.getYearRangesVehicleTypeDataQuery(getFeesRegisterVehicleTypesData.result.recordset[i].CTIPOVEHICULOREGISTROTASA).then((res) => res);
                if(getYearRangesVehicleTypeData.error){ return { status: false, code: 500, message: getYearRangesVehicleTypeData.error }; }
                if(getYearRangesVehicleTypeData.result.rowsAffected > 0){
                    for(let i = 0; i < getYearRangesVehicleTypeData.result.recordset.length; i++){
                        let interval = {
                            crangoanotipovehiculo: getYearRangesVehicleTypeData.result.recordset[i].CRANGOANOTIPOVEHICULO,
                            fanoinicio: getYearRangesVehicleTypeData.result.recordset[i].FANOINICIO,
                            fanofinal: getYearRangesVehicleTypeData.result.recordset[i].FANOFINAL,
                            ptasainterna: getYearRangesVehicleTypeData.result.recordset[i].PTASAINTERNA
                        }
                        intervals.push(interval);
                    }
                }
                let vehicleType = {
                    ctipovehiculo: getFeesRegisterVehicleTypesData.result.recordset[i].CTIPOVEHICULO,
                    xtipovehiculo: getFeesRegisterVehicleTypesData.result.recordset[i].XTIPOVEHICULO,
                    ctipovehiculoregistrotasa: getFeesRegisterVehicleTypesData.result.recordset[i].CTIPOVEHICULOREGISTROTASA,
                    miniciointervalo: getFeesRegisterVehicleTypesData.result.recordset[i].MINICIOINTERVALO,
                    mfinalintervalo: getFeesRegisterVehicleTypesData.result.recordset[i].MFINALINTERVALO,
                    ptasa: getFeesRegisterVehicleTypesData.result.recordset[i].PTASA,
                    intervals: intervals
                }
                vehicleTypes.push(vehicleType);
            }
        }
        return {
            status: true,
            cregistrotasa: getFeesRegisterData.result.recordset[0].CREGISTROTASA,
            ccliente: getFeesRegisterData.result.recordset[0].CCLIENTE,
            casociado:  getFeesRegisterData.result.recordset[0].CASOCIADO,
            bactivo: getFeesRegisterData.result.recordset[0].BACTIVO,
            vehicleTypes: vehicleTypes
        }
    }else{ return { status: false, code: 404, message: 'Fees Register not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateFeesRegister(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateFeesRegister' } });
        });
    }
});

const operationUpdateFeesRegister = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cregistrotasa', 'ccliente', 'casociado', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let feesRegisterData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cregistrotasa: requestBody.cregistrotasa,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyFeesRegisterAssociate = await bd.verifyFeesRegisterAssociateToUpdateQuery(feesRegisterData).then((res) => res);
    if(verifyFeesRegisterAssociate.error){ return { status: false, code: 500, message: verifyFeesRegisterAssociate.error }; }
    if(verifyFeesRegisterAssociate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-already-exist' }; }
    else{
        let updateFeesRegister = await bd.updateFeesRegisterQuery(feesRegisterData).then((res) => res);
        if(updateFeesRegister.error){ return { status: false, code: 500, message: updateFeesRegister.error }; }
        if(updateFeesRegister.result.rowsAffected > 0){
            if(requestBody.vehicleTypes){
                if(requestBody.vehicleTypes.create && requestBody.vehicleTypes.create.length > 0){
                    for(let i = 0; i < requestBody.vehicleTypes.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.create[i], ['ctipovehiculo', 'miniciointervalo', 'mfinalintervalo', 'ptasa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        if(requestBody.vehicleTypes.create[i].intervals && requestBody.vehicleTypes.create[i].intervals.length > 0){
                            for(let j = 0; j < requestBody.vehicleTypes.create[i].intervals.length; j++){
                                if(!helper.validateRequestObj(requestBody.vehicleTypes.create[i].intervals[j], ['fanoinicio', 'fanofinal', 'ptasainterna'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                            }
                        }
                    }
                    let createVehicleTypesByFeesRegisterUpdate = await bd.createVehicleTypesByFeesRegisterUpdateQuery(requestBody.vehicleTypes.create, feesRegisterData).then((res) => res);
                    if(createVehicleTypesByFeesRegisterUpdate.error){ return { status: false, code: 500, message: createVehicleTypesByFeesRegisterUpdate.error }; }
                    if(createVehicleTypesByFeesRegisterUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createVehicleTypesByFeesRegisterUpdate' }; }
                } 
                if(requestBody.vehicleTypes.update && requestBody.vehicleTypes.update.length > 0){
                    for(let i = 0; i < requestBody.vehicleTypes.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.update[i], ['ctipovehiculoregistrotasa', 'ctipovehiculo', 'miniciointervalo', 'mfinalintervalo', 'ptasa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        if(requestBody.vehicleTypes.update[i].intervalsResult){
                            if(requestBody.vehicleTypes.update[i].intervalsResult.create && requestBody.vehicleTypes.update[i].intervalsResult.create.length > 0){
                                for(let j = 0; j < requestBody.vehicleTypes.update[i].intervalsResult.create.length; j++){
                                    if(!helper.validateRequestObj(requestBody.vehicleTypes.update[i].intervalsResult.create[j], ['fanoinicio', 'fanofinal', 'ptasainterna'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                                }
                            }
                            if(requestBody.vehicleTypes.update[i].intervalsResult.update && requestBody.vehicleTypes.update[i].intervalsResult.update.length > 0){
                                for(let j = 0; j < requestBody.vehicleTypes.update[i].intervalsResult.update.length; j++){
                                    if(!helper.validateRequestObj(requestBody.vehicleTypes.update[i].intervalsResult.update[j], ['crangoanotipovehiculo', 'fanoinicio', 'fanofinal', 'ptasainterna'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                                }
                            }
                            if(requestBody.vehicleTypes.update[i].intervalsResult.delete && requestBody.vehicleTypes.update[i].intervalsResult.delete.length > 0){
                                for(let j = 0; j < requestBody.vehicleTypes.update[i].intervalsResult.delete.length; j++){
                                    if(!helper.validateRequestObj(requestBody.vehicleTypes.update[i].intervalsResult.delete[j], ['crangoanotipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                                }
                            }
                        }
                    }
                    let updateVehicleTypesByFeesRegisterUpdate = await bd.updateVehicleTypesByFeesRegisterUpdateQuery(requestBody.vehicleTypes.update, feesRegisterData).then((res) => res);
                    if(updateVehicleTypesByFeesRegisterUpdate.error){ return { status: false, code: 500, message: updateVehicleTypesByFeesRegisterUpdate.error }; }
                    if(updateVehicleTypesByFeesRegisterUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Vehicle Type not found.' }; }
                }
                if(requestBody.vehicleTypes.delete && requestBody.vehicleTypes.delete.length){
                    for(let i = 0; i < requestBody.vehicleTypes.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.vehicleTypes.delete[i], ['ctipovehiculoregistrotasa'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteVehicleTypesByFeesRegisterUpdate = await bd.deleteVehicleTypesByFeesRegisterUpdateQuery(requestBody.vehicleTypes.delete, feesRegisterData).then((res) => res);
                    if(deleteVehicleTypesByFeesRegisterUpdate.error){ return { status: false, code: 500, message: deleteVehicleTypesByFeesRegisterUpdate.error }; }
                    if(deleteVehicleTypesByFeesRegisterUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteVehicleTypesByFeesRegisterUpdate' }; }
                }
            }
            return { status: true, cregistrotasa: feesRegisterData.cregistrotasa }; 
        }
        else{ return { status: false, code: 404, message: 'Fees Register not found.' }; }
    }
}

module.exports = router;