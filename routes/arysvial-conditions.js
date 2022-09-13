const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchArysVial(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchArysVial' } });
        });
    }
});

const operationSearchArysVial = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        ctipovehiculo: requestBody.ctipovehiculo ? requestBody.ctipovehiculo.toUpperCase() : undefined
    }
    let searchArysVial = await bd.searchArysVialQuery(searchData).then((res) => res);
    if(searchArysVial.error){ return { status: false, code: 500, message: searchArysVial.error }; }
    if(searchArysVial.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchArysVial.result.recordset.length; i++){
            jsonList.push({
                carysvial: searchArysVial.result.recordset[i].CARYSVIAL,
                ctipovehiculo: searchArysVial.result.recordset[i].CTIPOVEHICULO,
                xtipovehiculo: searchArysVial.result.recordset[i].XTIPOVEHICULO,
                xmoneda: searchArysVial.result.recordset[i].xmoneda,
                mprima: searchArysVial.result.recordset[i].MPRIMA
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailVehicleType' } });
        });
    }
});

const operationDetailVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let getVehicleTypeData = await bd.getVehicleTypeDataQuery(searchData).then((res) => res);
    if(getVehicleTypeData.error){ return { status: false, code: 500, message: getVehicleTypeData.error }; }
    if(getVehicleTypeData.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < getVehicleTypeData.result.recordset.length; i++){
            jsonList.push({
                ctipovehiculo: getVehicleTypeData.result.recordset[i].CTIPOVEHICULO,
                xtipovehiculo: getVehicleTypeData.result.recordset[i].XTIPOVEHICULO,
                ctarifa: getVehicleTypeData.result.recordset[i].CTARIFA,
                mtarifa: getVehicleTypeData.result.recordset[i].MTARIFA,
                ncantidad: getVehicleTypeData.result.recordset[i].NCANTIDAD,
                mcoberturamax: getVehicleTypeData.result.recordset[i].MCOBERTURAMAX,
                cmoneda: getVehicleTypeData.result.recordset[i].CMONEDA,
                xmoneda: getVehicleTypeData.result.recordset[i].xmoneda,
                bactivo: getVehicleTypeData.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList }
    }else{ return { status: false, code: 404, message: 'Color not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateVehicleType' } });
        });
    }
});

const operationUpdateVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchdata = {
        cpais: requestBody.cpais
    }
    if(requestBody.vehicletype){
        let vehicleTypeUpdate = [];
        for(let i = 0; i < requestBody.vehicletype.update.length; i++){
            vehicleTypeUpdate.push({
                ctipovehiculo: requestBody.vehicletype.update[i].ctipovehiculo,
                mtarifa: requestBody.vehicletype.update[i].mtarifa,
                ncantidad: requestBody.vehicletype.update[i].ncantidad,
                mcoberturamax: requestBody.vehicletype.update[i].mcoberturamax,
                cmoneda: requestBody.vehicletype.update[i].cmoneda
            });
        }   
        let updateVehicleType = await bd.updateVehicleTypeQuery(vehicleTypeUpdate, searchdata).then((res) => res);
        if(updateVehicleType.error){ return { status: false, code: 500, message: updateVehicleType.error }; }
        if(updateVehicleType.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
    }
    return { status: true };
}

router.route('/detail-row').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailRowVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailRowVehicleType' } });
        });
    }
});

const operationDetailRowVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ctipovehiculo: requestBody.ctipovehiculo
    };
    let getVehicleTypeRowData = await bd.getVehicleTypeRowDataQuery(searchData).then((res) => res);
    if(getVehicleTypeRowData.error){ return { status: false, code: 500, message: getVehicleTypeRowData.error }; }
    if(getVehicleTypeRowData.result.rowsAffected > 0){
         
        return { status: true, 
            ctipovehiculo: getVehicleTypeRowData.result.recordset[0].CTIPOVEHICULO,
            xtipovehiculo: getVehicleTypeRowData.result.recordset[0].XTIPOVEHICULO,
            ctarifa: getVehicleTypeRowData.result.recordset[0].CTARIFA,
            mtarifa: getVehicleTypeRowData.result.recordset[0].MTARIFA,
            ncantidad: getVehicleTypeRowData.result.recordset[0].NCANTIDAD,
            mcoberturamax: getVehicleTypeRowData.result.recordset[0].MCOBERTURAMAX,
            cmoneda: getVehicleTypeRowData.result.recordset[0].CMONEDA,
            xmoneda: getVehicleTypeRowData.result.recordset[0].xmoneda,
            bactivo: getVehicleTypeRowData.result.recordset[0].BACTIVO
         }
    }else{ return { status: false, code: 404, message: 'Color not found.' }; }
}


module.exports = router;