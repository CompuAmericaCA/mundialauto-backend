const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const db = require('../data/db');
const { format } = require('express/lib/response');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchFleetContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchFleetContractManagement' } });
        });
    }
});

const operationSearchFleetContractManagement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        ccarga: requestBody.ccarga ? requestBody.ccarga : undefined,
        clote: requestBody.clote ? requestBody.clote : undefined,
        crecibo: requestBody.crecibo ? requestBody.crecibo : undefined,
        xplaca: requestBody.xplaca ? requestBody.xplaca : undefined,
        ccompania: requestBody.ccompania
    };
   
    let searchFleetContractManagement = await bd.searchFleetContractManagementQuery(searchData).then((res) => res);
    if(searchFleetContractManagement.error){ return  { status: false, code: 500, message: searchFleetContractManagement.error }; }
    if(searchFleetContractManagement.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchFleetContractManagement.result.recordset.length; i++){
            jsonList.push({
                ccontratoflota: searchFleetContractManagement.result.recordset[i].CCONTRATOFLOTA,
                cmarca: searchFleetContractManagement.result.recordset[i].CMARCA,
                xmarca: searchFleetContractManagement.result.recordset[i].XMARCA,
                cmodelo: searchFleetContractManagement.result.recordset[i].CMODELO,
                xmodelo: searchFleetContractManagement.result.recordset[i].XMODELO,
                cversion: searchFleetContractManagement.result.recordset[i].CVERSION,
                xversion: searchFleetContractManagement.result.recordset[i].XVERSION,
                xplaca: searchFleetContractManagement.result.recordset[i].XPLACA,
                xcliente: searchFleetContractManagement.result.recordset[i].XCLIENTE,
                xestatusgeneral: searchFleetContractManagement.result.recordset[i].XESTATUSGENERAL,
                xpoliza: searchFleetContractManagement.result.recordset[i].xpoliza,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Fleet Contract Management not found.' }; } 
} 


router.route('/search/client/worker').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchClientWorker(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClientWorker' } });
        });
    }
})

const operationSearchClientWorker = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccliente'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccliente: requestBody.ccliente,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido.toUpperCase()) : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined
    };
    let searchClientWorker = await bd.searchClientWorkerQuery(searchData).then((res) => res);
    if(searchClientWorker.error){ return  { status: false, code: 500, message: searchClientWorker.error }; }
    if(searchClientWorker.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchClientWorker.result.recordset.length; i++){
            jsonList.push({
                ctrabajador: searchClientWorker.result.recordset[i].CTRABAJADOR,
                xnombre: helper.decrypt(searchClientWorker.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(searchClientWorker.result.recordset[i].XAPELLIDO),
                ctipodocidentidad: searchClientWorker.result.recordset[i].CTIPODOCIDENTIDAD,
                xdocidentidad: helper.decrypt(searchClientWorker.result.recordset[i].XDOCIDENTIDAD),
                xdireccion: helper.decrypt(searchClientWorker.result.recordset[i].XDIRECCION),
                xtelefonocelular: helper.decrypt(searchClientWorker.result.recordset[i].XTELEFONOCELULAR),
                xemail: helper.decrypt(searchClientWorker.result.recordset[i].XEMAIL)
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Client Worker not found.' }; }
}

router.route('/search/owner').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchOwner' } });
        });
    }
})

const operationSearchOwner = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido.toUpperCase()) : undefined
    };
    let searchOwner = await bd.searchOwnerQuery(searchData).then((res) => res);
    if(searchOwner.error){ return  { status: false, code: 500, message: searchOwner.error }; }
    if(searchOwner.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchOwner.result.recordset.length; i++){
            jsonList.push({
                cpropietario: searchOwner.result.recordset[i].CPROPIETARIO,
                xnombre: helper.decrypt(searchOwner.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(searchOwner.result.recordset[i].XAPELLIDO),
                ctipodocidentidad: searchOwner.result.recordset[i].CTIPODOCIDENTIDAD,
                xdocidentidad: helper.decrypt(searchOwner.result.recordset[i].XDOCIDENTIDAD),
                xdireccion: helper.decrypt(searchOwner.result.recordset[i].XDIRECCION),
                xtelefonocelular: helper.decrypt(searchOwner.result.recordset[i].XTELEFONOCELULAR),
                xemail: helper.decrypt(searchOwner.result.recordset[i].XEMAIL),
                bactivo: searchOwner.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Owner not found.' }; }
}

router.route('/search/owner/vehicle').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchOwnerVehicle(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchOwnerVehicle' } });
        });
    }
})

const operationSearchOwnerVehicle = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpropietario', 'ccliente'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpropietario: requestBody.cpropietario,
        ccliente: requestBody.ccliente,
        xplaca: requestBody.xplaca ? helper.encrypt(requestBody.xplaca) : undefined,
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        cversion: requestBody.cversion ? requestBody.cversion : undefined,
        xserialcarroceria: requestBody.xserialcarroceria ? helper.encrypt(requestBody.xserialcarroceria) : undefined,
        xserialmotor: requestBody.xserialmotor ? helper.encrypt(requestBody.xserialmotor) : undefined
    };
    let searchOwnerVehicle = await bd.searchOwnerVehicleQuery(searchData).then((res) => res);
    if(searchOwnerVehicle.error){ return  { status: false, code: 500, message: searchOwnerVehicle.error }; }
    if(searchOwnerVehicle.result.rowsAffected > 0){
        let queryClient = await db.getClientModelsDataQuery(searchData.ccliente).then((res) => res);
        if(queryClient.error){ return { status: false, code: 500, message: queryClient.error }; }
        if(queryClient.result.rowsAffected > 0){
            for(let i = 0; i < queryClient.result.recordset.length; i++){
                searchOwnerVehicle.result.recordset = searchOwnerVehicle.result.recordset.filter((vehicle) => { 
                    return vehicle.CMODELO != queryClient.result.recordset[i].CMODELO;
                });
            }
        }
        let jsonList = [];
        for(let i = 0; i < searchOwnerVehicle.result.recordset.length; i++){
            jsonList.push({
                cvehiculopropietario: searchOwnerVehicle.result.recordset[i].CVEHICULOPROPIETARIO,
                xmarca: searchOwnerVehicle.result.recordset[i].XMARCA,
                xmodelo: searchOwnerVehicle.result.recordset[i].XMODELO,
                xversion: searchOwnerVehicle.result.recordset[i].XVERSION,
                xplaca: helper.decrypt(searchOwnerVehicle.result.recordset[i].XPLACA),
                fano: searchOwnerVehicle.result.recordset[i].FANO,
                xcolor: searchOwnerVehicle.result.recordset[i].XCOLOR,
                xserialcarroceria: helper.decrypt(searchOwnerVehicle.result.recordset[i].XSERIALCARROCERIA),
                xserialmotor: helper.decrypt(searchOwnerVehicle.result.recordset[i].XSERIALMOTOR),
                mpreciovehiculo: searchOwnerVehicle.result.recordset[i].MPRECIOVEHICULO,
                ctipovehiculo: searchOwnerVehicle.result.recordset[i].CTIPOVEHICULO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Owner Vehicle not found.' }; }
}

router.route('/search/vehicle-type/fee').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchVehicleTypeFee(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchVehicleTypeFee' } });
        });
    }
})

const operationSearchVehicleTypeFee = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'ctipovehiculo', 'fano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        ctipovehiculo: requestBody.ctipovehiculo,
        fano: requestBody.fano
    };
    let searchFeesRegister = await bd.searchFeesRegisterQuery(searchData).then((res) => res);
    if(searchFeesRegister.error){ return  { status: false, code: 500, message: searchFeesRegister.error }; }
    if(searchFeesRegister.result.rowsAffected > 0){
        let searchVehicleTypeFee = await bd.searchVehicleTypeFeeQuery(searchData, searchFeesRegister.result.recordset[0].CREGISTROTASA).then((res) => res);
        if(searchVehicleTypeFee.error){ return  { status: false, code: 500, message: searchVehicleTypeFee.error }; }
        if(searchVehicleTypeFee.result.rowsAffected > 0){
            let searchRangeFee = await bd.searchRangeFeeQuery(searchData, searchVehicleTypeFee.result.recordset[0].CTIPOVEHICULOREGISTROTASA).then((res) => res);
            if(searchRangeFee.error){ return  { status: false, code: 500, message: searchRangeFee.error }; }
            if(searchRangeFee.result.rowsAffected > 0){
                return {
                    status: true,
                    cregistrotasa: searchFeesRegister.result.recordset[0].CREGISTROTASA,
                    ptasaaseguradora: searchVehicleTypeFee.result.recordset[0].PTASA,
                    ptasagestion: searchRangeFee.result.recordset[0].PTASAINTERNA,
                    mmaximoadministrado:  searchVehicleTypeFee.result.recordset[0].MFINALINTERVALO,
                    cmoneda:  searchVehicleTypeFee.result.recordset[0].CMONEDA
                }
            }else{ return { status: false, code: 404, message: 'Range Date not found.', condition: 'range-date-not-found' }; }
        }else{ return { status: false, code: 404, message: 'Vehicle Type not found.', condition: 'vehicle-type-not-found' }; }
    }else{ return { status: false, code: 404, message: 'Fees Register not found.', condition: 'fees-register-not-found' }; }
}

router.route('/search/vehicle-type/road-management').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchVehicleTypeRoadManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchVehicleTypeRoadManagement' } });
        });
    }
})

const operationSearchVehicleTypeRoadManagement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'ctipovehiculo', 'fano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        ctipovehiculo: requestBody.ctipovehiculo,
        fano: requestBody.fano
    };
    let searchRoadManagement = await bd.searchRoadManagementQuery(searchData).then((res) => res);
    if(searchRoadManagement.error){ return  { status: false, code: 500, message: searchRoadManagement.error }; }
    if(searchRoadManagement.result.rowsAffected > 0){
        let searchVehicleTypeRoadManagement = await bd.searchVehicleTypeRoadManagementQuery(searchData, searchRoadManagement.result.recordset[0].CCONFIGURACIONGESTIONVIAL).then((res) => res);
        if(searchVehicleTypeRoadManagement.error){ return  { status: false, code: 500, message: searchVehicleTypeRoadManagement.error }; }
        if(searchVehicleTypeRoadManagement.result.rowsAffected > 0){
            let amount = 0;
            let limit = searchVehicleTypeRoadManagement.result.recordset[0].NLIMITEANO;
            let date = new Date();
            let year = date.getFullYear();
            if((year - searchData.fano) > limit){
                amount = searchVehicleTypeRoadManagement.result.recordset[0].MMAYORLIMITEANO
            }else{
                amount = searchVehicleTypeRoadManagement.result.recordset[0].MTIPOVEHICULOCONFIGURACIONGESTIONVIAL
            }
            return {
                status: true,
                cconfiguraciongestionvial: searchVehicleTypeRoadManagement.result.recordset[0].CCONFIGURACIONGESTIONVIAL,
                mgestionvial: amount
            }
        }else{ return { status: false, code: 404, message: 'Vehicle Type not found.', condition: 'vehicle-type-not-found' }; }
    }else{ return { status: false, code: 404, message: 'Road Management not found.', condition: 'road-management-not-found' }; }
}

router.route('/search/vehicle-type/extra-coverage').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchVehicleTypeExtraCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchVehicleTypeExtraCoverage' } });
        });
    }
})

const operationSearchVehicleTypeExtraCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'ctipovehiculo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        ctipovehiculo: requestBody.ctipovehiculo
    };
    let searchQuoteByFleet = await bd.searchQuoteByFleetQuery(searchData).then((res) => res);
    if(searchQuoteByFleet.error){ return { status: false, code: 500, message: searchQuoteByFleet.error }; }
    if(searchQuoteByFleet.result.rowsAffected > 0){
        let jsonList = [];
        let getQuoteByFleetExtraCoveragesData = await bd.getQuoteByFleetExtraCoveragesDataQuery(searchQuoteByFleet.result.recordset[0].CCOTIZADORFLOTA).then((res) => res);
        if(getQuoteByFleetExtraCoveragesData.error){ return { status: false, code: 500, message: getQuoteByFleetExtraCoveragesData.error }; }
        if(getQuoteByFleetExtraCoveragesData.result.rowsAffected > 0){
            for(let i = 0; i < getQuoteByFleetExtraCoveragesData.result.recordset.length; i++){
                let getExtraCoverageData = await bd.getExtraCoverageDataQuery({cpais: searchData.cpais, ccompania: searchData.ccompania, ccoberturaextra: getQuoteByFleetExtraCoveragesData.result.recordset[i].CCOBERTURAEXTRA}).then((res) => res);
                if(getExtraCoverageData.error){ return { status: false, code: 500, message: getExtraCoverageData.error }; }
                if(getExtraCoverageData.result.rowsAffected > 0){
                    let getExtraCoverageVehicleTypesData = await bd.getExtraCoverageVehicleTypesDataQuery(getQuoteByFleetExtraCoveragesData.result.recordset[i].CCOBERTURAEXTRA).then((res) => res);
                    if(getExtraCoverageVehicleTypesData.error){ return { status: false, code: 500, message: getExtraCoverageVehicleTypesData.error }; }
                    if(getExtraCoverageVehicleTypesData.result.rowsAffected > 0){
                        for(let j = 0; j < getExtraCoverageVehicleTypesData.result.recordset.length; j++){
                            if(getExtraCoverageVehicleTypesData.result.recordset[j].CTIPOVEHICULO == searchData.ctipovehiculo){
                                jsonList.push({
                                    ccoberturaextra: getQuoteByFleetExtraCoveragesData.result.recordset[i].CCOBERTURAEXTRA,
                                    xdescripcion: helper.decrypt(getExtraCoverageData.result.recordset[0].XDESCRIPCION),
                                    mcoberturaextra: getExtraCoverageData.result.recordset[0].MCOBERTURAEXTRA
                                });
                                break;
                            }
                        }
                    }
                }else{ return { status: false, code: 404, message: 'Extra Coverage not found.' }; }
            }
        }
        return { status: true, ccotizadorflota: searchQuoteByFleet.result.recordset[0].CCOTIZADORFLOTA, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Quote By Fleet not found.', confition: 'quote-by-fleet-not-found' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateFleetContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateFleetContractManagement' } });
        });
    }
});

const operationCreateFleetContractManagement = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cmodulo', 'cpais', 'ccompania', 'ccliente', 'casociado', 'cagrupador', 'finicio', 'fhasta' ,'xcertificadoasociado', 'ctrabajador', 'cpropietario', 'cvehiculopropietario', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let accesories = [];
    if(requestBody.accesories){
        accesories = requestBody.accesories;
        for(let i = 0; i < accesories.length; i++){
            if(!helper.validateRequestObj(accesories[i], ['caccesorio', 'maccesoriocontratoflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
        }
    }
    let inspections = [];
    if(requestBody.inspections){
        inspections = requestBody.inspections;
        for(let i = 0; i < inspections.length; i++){
            if(!helper.validateRequestObj(inspections[i], ['cperito', 'ctipoinspeccion', 'finspeccion', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            inspections[i].xobservacion = helper.encrypt(inspections[i].xobservacion.toUpperCase());
            if(inspections[i].images)
            for(let j = 0; j < inspections[i].images.length; j++){
                if(!helper.validateRequestObj(inspections[i].images[j], ['xrutaimagen'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
        }
    }
    let fleetContractData = {
        cmodulo: requestBody.cmodulo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        inspections: inspections ? inspections : undefined,
        accesories: accesories ? accesories : undefined,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        cagrupador: requestBody.cagrupador,
        finicio: requestBody.finicio,
        fhasta: requestBody.fhasta,
        cestatusgeneral: '',
        xcertificadoasociado: helper.encrypt(requestBody.xcertificadoasociado),
        xsucursalemision: requestBody.xsucursalemision,
        xsucursalsuscriptora: requestBody.xsucursalsuscriptora,
        ctrabajador: requestBody.ctrabajador,
        cpropietario: requestBody.cpropietario,
        cvehiculopropietario: requestBody.cvehiculopropietario,
        ctipoplan: requestBody.ctipoplan,
        cplan: requestBody.cplan,
        cmetodologiapago: requestBody.cmetodologiapago,
        ctiporecibo: requestBody.ctiporecibo,
        fhastarecibo: requestBody.fhastarecibo,
        bactivo: true,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyFleetContractVehicle = await bd.verifyFleetContractVehicleToCreateQuery(fleetContractData).then((res) => res);
    if(verifyFleetContractVehicle.error){ return { status: false, code: 500, message: verifyFleetContractVehicle.error }; }
    if(verifyFleetContractVehicle.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-contract-already-exist' }; }
    else{
        let getDefaultGeneralStatus = await bd.getDefaultGeneralStatusQuery(fleetContractData).then((res) => res);
        if(getDefaultGeneralStatus.error){ return { status: false, code: 500, message: getDefaultGeneralStatus.error }; }
        if(getDefaultGeneralStatus.result.rowsAffected > 0){ 
            fleetContractData.cestatusgeneral = getDefaultGeneralStatus.result.recordset[0].CESTATUSGENERAL
        }
        else { return { status: false, code: 200, condition: 'not-have-default-general-estatus' }; }
        let createFleetContract = await bd.createFleetContractQuery(fleetContractData).then((res) => res);
        if(createFleetContract.error){ return { status: false, code: 500, message: createFleetContract.error }; }
        if(createFleetContract.result.rowsAffected > 0){
            let getClientData = await db.getClientDataQuery(fleetContractData).then((res) => res);
            if(getClientData.error){ return { status: false, code: 500, message: getClientData.error }; }
            if(getClientData.result.rowsAffected > 0){
                if(getClientData.result.recordset[0].IFACTURACION == 'G'){
                    let getClientCollectionOrderFleetContractData = await bd.getClientCollectionOrderFleetContractDataQuery(getClientData.result.recordset[0].CCLIENTE, fleetContractData).then((res) => res);
                    if(getClientCollectionOrderFleetContractData.error){ return { status: false, code: 500, message: getClientCollectionOrderFleetContractData.error }; }
                    if(getClientCollectionOrderFleetContractData.result.rowsAffected > 0){
                        let createSuscriptionByFleetContractCreate = await bd.createSuscriptionByFleetContractCreateQuery(getClientCollectionOrderFleetContractData.result.recordset[0].CSOLICITUDCOBROCONTRATOFLOTA, createFleetContract.result.recordset[0].CCONTRATOFLOTA, fleetContractData).then((res) => res);
                        if(createSuscriptionByFleetContractCreate.error){ return { status: false, code: 500, message: createSuscriptionByFleetContractCreate.error }; }
                    }else{
                        let getDefaultGeneralStatusToCollectionOrder = await bd.getDefaultGeneralStatusQuery({ cpais: requestBody.cpais, ccompania: requestBody.ccompania, cmodulo: 92 }).then((res) => res);
                        if(getDefaultGeneralStatusToCollectionOrder.error){ return { status: false, code: 500, message: getDefaultGeneralStatusToCollectionOrder.error }; }
                        if(getDefaultGeneralStatusToCollectionOrder.result.rowsAffected > 0){ 
                            let cestatusgeneral = getDefaultGeneralStatusToCollectionOrder.result.recordset[0].CESTATUSGENERAL;
                            let createCollectionOrderFleetContract = await bd.createCollectionOrderFleetContractQuery({ ccliente: getClientData.result.recordset[0].CCLIENTE, ifacturacion: getClientData.result.recordset[0].IFACTURACION, cestatusgeneral: cestatusgeneral, bactivo: true, cpais: fleetContractData.cpais, ccompania: fleetContractData.ccompania, cusuariocreacion: fleetContractData.cusuariocreacion }).then((res) => res);
                            if(createCollectionOrderFleetContract.error){ return { status: false, code: 500, message: createCollectionOrderFleetContract.error }; }
                            if(createCollectionOrderFleetContract.result.rowsAffected > 0){
                                let createSuscriptionByFleetContractCreate = await bd.createSuscriptionByFleetContractCreateQuery(createCollectionOrderFleetContract.result.recordset[0].CSOLICITUDCOBROCONTRATOFLOTA, createFleetContract.result.recordset[0].CCONTRATOFLOTA, fleetContractData).then((res) => res);
                                if(createSuscriptionByFleetContractCreate.error){ return { status: false, code: 500, message: createSuscriptionByFleetContractCreate.error }; }
                            }
                        }
                    }
                }else{
                    let getDefaultGeneralStatusToCollectionOrder = await bd.getDefaultGeneralStatusQuery({ cpais: requestBody.cpais, ccompania: requestBody.ccompania, cmodulo: 92 }).then((res) => res);
                    if(getDefaultGeneralStatusToCollectionOrder.error){ return { status: false, code: 500, message: getDefaultGeneralStatusToCollectionOrder.error }; }
                    if(getDefaultGeneralStatusToCollectionOrder.result.rowsAffected > 0){ 
                        let cestatusgeneral = getDefaultGeneralStatusToCollectionOrder.result.recordset[0].CESTATUSGENERAL;
                        let createCollectionOrderFleetContract = await bd.createCollectionOrderFleetContractQuery({ ccliente: getClientData.result.recordset[0].CCLIENTE, ifacturacion: getClientData.result.recordset[0].IFACTURACION, cestatusgeneral: cestatusgeneral, bactivo: true, cpais: fleetContractData.cpais, ccompania: fleetContractData.ccompania, cusuariocreacion: fleetContractData.cusuariocreacion }).then((res) => res);
                        if(createCollectionOrderFleetContract.error){ return { status: false, code: 500, message: createCollectionOrderFleetContract.error }; }
                        if(createCollectionOrderFleetContract.result.rowsAffected > 0){
                            let createSuscriptionByFleetContractCreate = await bd.createSuscriptionByFleetContractCreateQuery(createCollectionOrderFleetContract.result.recordset[0].CSOLICITUDCOBROCONTRATOFLOTA, createFleetContract.result.recordset[0].CCONTRATOFLOTA, fleetContractData).then((res) => res);
                            if(createSuscriptionByFleetContractCreate.error){ return { status: false, code: 500, message: createSuscriptionByFleetContractCreate.error }; }
                        }
                    }
                }
            }else{
                return { status: false, code: 500, message: 'Server Internal Error.', hint: 'getClientData' };
            }
            return { status: true, ccontratoflota: createFleetContract.result.recordset[0].CCONTRATOFLOTA };
        }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createFleetContract' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailFleetContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailFleetContractManagement' } });
        });
    }
});

const operationDetailFleetContractManagement = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccontratoflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let fleetContractData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccontratoflota: requestBody.ccontratoflota
    };
    let getFleetContractData = await bd.getFleetContractDataQuery(fleetContractData).then((res) => res);
    if(getFleetContractData.error){ return { status: false, code: 500, message: getFleetContractData.error }; }
    if(getFleetContractData.result.rowsAffected > 0){
        /*let getFleetContractWorkerData = await bd.getFleetContractWorkerDataQuery(getFleetContractData.result.recordset[0].CCLIENTE, getFleetContractData.result.recordset[0].CTRABAJADOR).then((res) => res);
        if(getFleetContractWorkerData.error){ return { status: false, code: 500, message: getFleetContractWorkerData.error }; }
        if(getFleetContractWorkerData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Worker not found.' }; }
        */let getFleetContractOwnerData = await bd.getFleetContractOwnerDataQuery(fleetContractData, getFleetContractData.result.recordset[0].CPROPIETARIO).then((res) => res);
        if(getFleetContractOwnerData.error){console.log(getFleetContractOwnerData.error); return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        let telefonopropietario;
        if(getFleetContractOwnerData.result.recordset[0].XTELEFONOCELULAR){
            telefonopropietario = getFleetContractOwnerData.result.recordset[0].XTELEFONOCELULAR;
        }else{
            telefonopropietario = getFleetContractOwnerData.result.recordset[0].XTELEFONOCASA
        }
        if(getFleetContractOwnerData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Owner not found.' }; }
        /*let getFleetContractOwnerVehicleData = await bd.getFleetContractOwnerVehicleDataQuery(getFleetContractData.result.recordset[0].CPROPIETARIO, getFleetContractData.result.recordset[0].CVEHICULOPROPIETARIO).then((res) => res);
        if(getFleetContractOwnerVehicleData.error){ console.log(getFleetContractOwnerVehicleData.error); return { status: false, code: 500, message: getFleetContractOwnerVehicleData.error }; }
        if(getFleetContractOwnerVehicleData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Owner Vehicle not found.' }; }
        *//*let searchQuoteByFleet = await bd.searchQuoteByFleetQuery(fleetContractData).then((res) => res);
        if(searchQuoteByFleet.error){ return { status: false, code: 500, message: searchQuoteByFleet.error }; }
        if(searchQuoteByFleet.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Quote By Fleet not found.' }; }*/
        /*let accesories = [];
        let getFleetContractAccesoriesData = await bd.getFleetContractAccesoriesDataQuery(fleetContractData.ccontratoflota).then((res) => res);
        if(getFleetContractAccesoriesData.error){ return { status: false, code: 500, message: getFleetContractAccesoriesData.error }; }
        if(getFleetContractAccesoriesData.result.rowsAffected > 0){
            for(let i = 0; i < getFleetContractAccesoriesData.result.recordset.length; i++){
                let accesory = {
                    caccesorio: getFleetContractAccesoriesData.result.recordset[i].CACCESORIO,
                    xaccesorio: getFleetContractAccesoriesData.result.recordset[i].XACCESORIO,
                    maccesoriocontratoflota: getFleetContractAccesoriesData.result.recordset[i].MACCESORIOCONTRATOFLOTA
                }
                accesories.push(accesory);
            }
        }*/
        let getFleetContractClientData = await db.getContractClientData(getFleetContractData.result.recordset[0].CCLIENTE);
        let inspections = [];/*
        let getFleetContractInspectionsData = await bd.getFleetContractInspectionsDataQuery(fleetContractData.ccontratoflota).then((res) => res);
        if(getFleetContractInspectionsData.error){ return { status: false, code: 500, message: getFleetContractInspectionsData.error }; }
        if(getFleetContractInspectionsData.result.rowsAffected > 0){
            for(let i = 0; i < getFleetContractInspectionsData.result.recordset.length; i++){
                let images = [];
                let getImagesInspectionData = await bd.getImagesInspectionDataDataQuery(getFleetContractInspectionsData.result.recordset[i].CINSPECCIONCONTRATOFLOTA).then((res) => res);
                if(getImagesInspectionData.error){ return { status: false, code: 500, message: getImagesInspectionData.error }; }
                if(getImagesInspectionData.result.rowsAffected > 0){
                    for(let i = 0; i < getImagesInspectionData.result.recordset.length; i++){
                        let image = {
                            cimageninspeccion: getImagesInspectionData.result.recordset[i].CIMAGENINSPECCION,
                            xrutaimagen: getImagesInspectionData.result.recordset[i].XRUTAIMAGEN
                        }
                        images.push(image);
                    }
                }
                let inspection = {
                    cinspeccioncontratoflota: getFleetContractInspectionsData.result.recordset[i].CINSPECCIONCONTRATOFLOTA,
                    cperito: getFleetContractInspectionsData.result.recordset[i].CPERITO,
                    xperito: helper.decrypt(getFleetContractInspectionsData.result.recordset[i].XPERITO),
                    ctipoinspeccion: getFleetContractInspectionsData.result.recordset[i].CTIPOINSPECCION,
                    xtipoinspeccion: getFleetContractInspectionsData.result.recordset[i].XTIPOINSPECCION,
                    finspeccion: getFleetContractInspectionsData.result.recordset[i].FINSPECCION,
                    xobservacion: helper.decrypt(getFleetContractInspectionsData.result.recordset[i].XOBSERVACION),
                    images: images
                }
                inspections.push(inspection);
            }
        }*/
        let mprimatotal = 0;
        let mprimaprorratatotal = 0; 
        let getPlanData = await db.getPlanData(getFleetContractData.result.recordset[0].CPLAN);
        if(getPlanData.error){ return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        if(getPlanData.result.rowsAffected < 0){ console.log(getPlanData.error); return { status: false, code: 404, message: 'Fleet Contract Plan not found.' }; }
        let realCoverages = [];
        let coverageAnnexes = [];
        let getPlanCoverages = await db.getPlanCoverages(getFleetContractData.result.recordset[0].CPLAN, getFleetContractData.result.recordset[0].CCONTRATOFLOTA);
        if(getPlanCoverages.error){ console.log(getPlanCoverages.error); return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        if(getPlanCoverages.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Plan Coverages not found.' }; }
        for (let i = 0; i < getPlanCoverages.result.recordset.length; i++) {
            /*let getCoverageServices = await db.getCoverageServices(getPlanCoverages.result.recordset[i].ccobertura);
            for(let i = 0; i < getCoverageServices.result.recordset.length; i++) {
                let service = {
                    cservicio: getCoverageServices.result.recordset[i].cservicio,
                    xservicio: getCoverageServices.result.recordset[i].XSERVICIO
                }
                services.push(service);
            }*/
            // Solo se suma si el codigo de la moneda es 2 (usd), si la moneda es bs no lo toma en cuenta
            if (getPlanCoverages.result.recordset[i].cmoneda == 2 && getPlanCoverages.result.recordset[i].mprima) {
                mprimatotal = mprimatotal + getPlanCoverages.result.recordset[i].mprima;
            } 
            if (getPlanCoverages.result.recordset[i].cmoneda == 2 && getPlanCoverages.result.recordset[i].mprimaprorrata) {
                mprimaprorratatotal = mprimaprorratatotal + getPlanCoverages.result.recordset[i].mprimaprorrata
            }
            let getCoverageAnnexes = await db.getCoverageAnnexesQuery(getPlanCoverages.result.recordset[i].CCOBERTURA)
            if (getCoverageAnnexes.result) {
                for (let i = 0; i < getCoverageAnnexes.result.recordset.length; i++) {
                    let annex = {
                        ccobertura: getCoverageAnnexes.result.recordset[i].CCOBERTURA,
                        canexo: getCoverageAnnexes.result.recordset[i].CANEXO,
                        xanexo: getCoverageAnnexes.result.recordset[i].XANEXO
                    }
                    coverageAnnexes.push(annex);
                }
            }
            let coverage = {
                ccobertura: getPlanCoverages.result.recordset[i].CCOBERTURA,
                xcobertura: getPlanCoverages.result.recordset[i].XCOBERTURA,
                ptasa: getPlanCoverages.result.recordset[i].ptasa,
                msumaasegurada: getPlanCoverages.result.recordset[i].msuma_aseg,
                mprima: getPlanCoverages.result.recordset[i].mprima,
                mprimaprorrata: getPlanCoverages.result.recordset[i].mprimaprorrata,
                ititulo: getPlanCoverages.result.recordset[i].ititulo,
                xmoneda: getPlanCoverages.result.recordset[i].xmoneda,
                ccontratoflota: getPlanCoverages.result.recordset[i].ccontratoflota,
            }
            realCoverages.push(coverage);
        }
        //Se redondea el total de la prima a dos decimales. 96,336 -> 96,34
        mprimatotal = Math.round10(mprimatotal, -2);
        if (mprimaprorratatotal > 0) {
            mprimaprorratatotal = Math.round10(mprimaprorratatotal, -2);
        }
        let services = [];
        let getFleetContractServices = await db.getFleetContractServices(getFleetContractData.result.recordset[0].ccarga);
        if(getFleetContractServices.error){ console.log(getFleetContractServices.error); return { status: false, code: 500, message: getFleetContractServices.error }; }
        if(getFleetContractServices.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Service not found.' }; }
        if (getFleetContractServices.result.rowsAffected > 0) {
            for(let i = 0; i < getFleetContractServices.result.recordset.length; i++){
                let service = {
                    cservicio: getFleetContractServices.result.recordset[i].cservicio,
                    xservicio: getFleetContractServices.result.recordset[i].XSERVICIO,
                }
                services.push(service);
            }
        }
        let getBroker = await bd.getBroker(getFleetContractData.result.recordset[0].ccorredor);
        if(getBroker.error){ console.log(getBroker.error); return { status: false, code: 500, message: getBroker.error }; }
        if(getBroker.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Service not found.' }; }
        /*let getPlanServicesData = await db.getPlanServicesDataQuery(getFleetContractData.result.recordset[0].CPLAN).then((res) => res);
        if(getPlanServicesData.error){ return { status: false, code: 500, message: getPlanServicesData.error }; }
        if(getPlanServicesData.result.rowsAffected > 0){
            for(let i = 0; i < getPlanServicesData.result.recordset.length; i++){
                let coverages = [];
                let getCoveragesServiceData = await db.getCoveragesServiceDataQuery(getPlanServicesData.result.recordset[i].CSERVICIOPLAN).then((res) => res);
                if(getCoveragesServiceData.error){ return { status: false, code: 500, message: getCoveragesServiceData.error }; }
                if(getCoveragesServiceData.result.rowsAffected > 0){
                    for(let i = 0; i < getCoveragesServiceData.result.recordset.length; i++){
                        let coverage = {
                            ccobertura: getCoveragesServiceData.result.recordset[i].CCOBERTURA,
                            xcobertura: getCoveragesServiceData.result.recordset[i].XCOBERTURA,
                            cconceptocobertura: getCoveragesServiceData.result.recordset[i].CCONCEPTOCOBERTURA,
                            xconceptocobertura: getCoveragesServiceData.result.recordset[i].XCONCEPTOCOBERTURA
                        }
                        coverages.push(coverage);
                    }
                }
                let service = {
                    cservicio: getPlanServicesData.result.recordset[i].CSERVICIO,
                    cservicioplan: getPlanServicesData.result.recordset[i].CSERVICIOPLAN,
                    xservicio: getPlanServicesData.result.recordset[i].XSERVICIO,
                    ctiposervicio: getPlanServicesData.result.recordset[i].CTIPOSERVICIO,
                    xtiposervicio: getPlanServicesData.result.recordset[i].XTIPOSERVICIO,
                    ctipoagotamientoservicio: getPlanServicesData.result.recordset[i].CTIPOAGOTAMIENTOSERVICIO,
                    ncantidad: getPlanServicesData.result.recordset[i].NCANTIDAD,
                    pservicio: getPlanServicesData.result.recordset[i].PSERVICIO,
                    mmaximocobertura: getPlanServicesData.result.recordset[i].MMAXIMOCOBERTURA,
                    mdeducible: getPlanServicesData.result.recordset[i].MDEDUCIBLE,
                    bserviciopadre: getPlanServicesData.result.recordset[i].BSERVICIOPADRE,
                    coverages: coverages
                }
                services.push(service);
            }
        }*/
        let getPlanArysData = await db.getPlanArys(getFleetContractData.result.recordset[0].CPLAN);
        if(getPlanArysData.error){ console.log(getPlanArysData.error); return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        if(getPlanArysData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Plan Arys not found.' }; }
        let xplanservicios;
        if (getPlanArysData.result.recordset[0].XPLAN) {
            let xplan = getPlanArysData.result.recordset[0].XPLAN.toLowerCase()
            xplanservicios = xplan.charAt(0).toUpperCase() + xplan.slice(1);
        }
        let accesories = []
        let getFleetContractAccesories = await db.getFleetContractAccesoriesQuery(fleetContractData.ccontratoflota);
        if(getFleetContractAccesories.error){ return { status: false, code: 500, message: getFleetContractAccesories.error }; }
        if (getFleetContractAccesories.result.rowsAffected > 0) {
            for(let i = 0; i < getFleetContractAccesories.result.recordset.length; i++){
                let accessory = {
                    caccesorio: getFleetContractAccesories.result.recordset[i].CACCESORIO,
                    xaccesorio: getFleetContractAccesories.result.recordset[i].XACCESORIO,
                    msuma_accesorio: getFleetContractAccesories.result.recordset[i].MSUMA_ACCESORIO,
                    mprima_accesorio: getFleetContractAccesories.result.recordset[i].MPRIMA_ACCESORIO
                }
                accesories.push(accessory);
            }
        }
        let getPolicyEffectiveDate = await bd.getPolicyEffectiveDateQuery(fleetContractData.ccontratoflota);
        if(getPolicyEffectiveDate.error){ return { status: false, code: 500, message: getPolicyEffectiveDate.error }; }
        if(getPolicyEffectiveDate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Receipts not found.' }; }
        return {
            status: true,
            ccarga: getFleetContractData.result.recordset[0].ccarga,
            ccontratoflota: getFleetContractData.result.recordset[0].CCONTRATOFLOTA,
            xrecibo: getFleetContractData.result.recordset[0].xrecibo,
            xpoliza: getFleetContractData.result.recordset[0].xpoliza,
            xtituloreporte: getFleetContractData.result.recordset[0].XTITULO_REPORTE,
            xtransmision: getFleetContractData.result.recordset[0].XTRANSMISION,
            xanexo: getFleetContractData.result.recordset[0].XANEXO,
            xobservaciones: getFleetContractData.result.recordset[0].XOBSERVACIONES,
            xdocidentidadrepresentantelegal: getFleetContractData.result.recordset[0].XDOCIDENTIDAD,
            xnombrerepresentantelegal: getFleetContractData.result.recordset[0].XREPRESENTANTELEGAL,
            ccliente: getFleetContractData.result.recordset[0].CCLIENTE,
            xnombrecliente: getFleetContractClientData.result.recordset[0].XCLIENTE,
            xdocidentidadcliente: getFleetContractClientData.result.recordset[0].XDOCIDENTIDAD,
            xdireccionfiscalcliente: getFleetContractClientData.result.recordset[0].XDIRECCIONFISCAL,
            xtelefonocliente:getFleetContractClientData.result.recordset[0].XTELEFONO,
            xemailcliente: getFleetContractClientData.result.recordset[0].XEMAIL,
            xrepresentantecliente: getFleetContractClientData.result.recordset[0].XREPRESENTANTE,
            xestadocliente: getFleetContractClientData.result.recordset[0].XESTADO,
            xciudadcliente: getFleetContractClientData.result.recordset[0].XCIUDAD,
            casociado:  getFleetContractData.result.recordset[0].CASOCIADO,
            xcertificadogestion: '',//`${getFleetContractData.result.recordset[0].CCLIENTE}-${searchQuoteByFleet.result.recordset[0].CCOTIZADORFLOTA}-${getFleetContractData.result.recordset[0].CCONTRATOFLOTA}`,
            xcertificadoasociado: getFleetContractData.result.recordset[0].XCERTIFICADOASOCIADO,
            xsucursalemision: getFleetContractData.result.recordset[0].XSUCURSALEMISION,
            xsucursalsuscriptora: getFleetContractData.result.recordset[0].XSUCURSALSUSCRIPTORA,
            cagrupador: getFleetContractData.result.recordset[0].CAGRUPADOR,
            fsuscripcion: getFleetContractData.result.recordset[0].FCREACION,
            finicio: getFleetContractData.result.recordset[0].FDESDE_POL,
            fhasta: getFleetContractData.result.recordset[0].FHASTA_POL,
            finiciorecibo: getFleetContractData.result.recordset[0].FDESDE_REC,
            fhastarecibo: getFleetContractData.result.recordset[0].FHASTA_REC,
            femision: getFleetContractData.result.recordset[0].FINICIO,
            cestatusgeneral: getFleetContractData.result.recordset[0].CESTATUSGENERAL,
            xestatusgeneral: getFleetContractData.result.recordset[0].XESTATUSGENERAL,
            ctrabajador: getFleetContractData.result.recordset[0].CTRABAJADOR,
            ccorredor: getBroker.result.recordset[0].CCORREDOR,
            xcorredor: getBroker.result.recordset[0].XCORREDOR,

            /*xnombretrabajador: getFleetContractWorkerData.result.recordset[0].XNOMBRE,
            xtipodocidentidadtrabajador: getFleetContractWorkerData.result.recordset[0].XTIPODOCIDENTIDAD,
            xdocidentidadtrabajador: getFleetContractWorkerData.result.recordset[0].XDOCIDENTIDAD,
            xdirecciontrabajador: getFleetContractWorkerData.result.recordset[0].XDIRECCION,
            xtelefonocelulartrabajador: getFleetContractWorkerData.result.recordset[0].XTELEFONOCELULAR,
            xemailtrabajador: getFleetContractWorkerData.result.recordset[0].XEMAIL,*/
            cpropietario: getFleetContractData.result.recordset[0].CPROPIETARIO,
            xnombrepropietario: getFleetContractOwnerData.result.recordset[0].XNOMBRE,
            xtipodocidentidadpropietario: getFleetContractOwnerData.result.recordset[0].XTIPODOCIDENTIDAD,
            xdocidentidadpropietario: getFleetContractOwnerData.result.recordset[0].XDOCIDENTIDAD,
            xdireccionpropietario: getFleetContractOwnerData.result.recordset[0].XDIRECCION,
            xtelefonocelularpropietario: getFleetContractOwnerData.result.recordset[0].telefonopropietario,
            xestadopropietario: getFleetContractOwnerData.result.recordset[0].XESTADO,
            xciudadpropietario: getFleetContractOwnerData.result.recordset[0].XCIUDAD,
            fnacimientopropietario: getFleetContractOwnerData.result.recordset[0].FNACIMIENTO,
            xapellidopropietario: getFleetContractOwnerData.result.recordset[0].XAPELLIDO,
            xocupacionpropietario: getFleetContractOwnerData.result.recordset[0].XOCUPACION,
            xestadocivilpropietario: getFleetContractOwnerData.result.recordset[0].XESTADOCIVIL,
            xemailpropietario: getFleetContractOwnerData.result.recordset[0].XEMAIL,
            xsexopropietario: getFleetContractOwnerData.result.recordset[0].XSEXO,
            xnacionalidadpropietario: getFleetContractOwnerData.result.recordset[0].XNACIONALIDAD,
            xtelefonopropietario: getFleetContractOwnerData.result.recordset[0].telefonopropietario,
            cvehiculopropietario: getFleetContractData.result.recordset[0].CVEHICULOPROPIETARIO,
            ctipoplan: getFleetContractData.result.recordset[0].CTIPOPLAN,
            cplan: getFleetContractData.result.recordset[0].CPLAN,
            cmetodologiapago: getFleetContractData.result.recordset[0].CMETODOLOGIAPAGO,
            ctiporecibo: getFleetContractData.result.recordset[0].CTIPORECIBO,
            xmarca: getFleetContractData.result.recordset[0].XMARCA,
            xmoneda: getFleetContractData.result.recordset[0].xmoneda,
            xmodelo: getFleetContractData.result.recordset[0].XMODELO,
            xversion: getFleetContractData.result.recordset[0].XVERSION,
            xcolor: getFleetContractData.result.recordset[0].XCOLOR,
            xplaca: getFleetContractData.result.recordset[0].XPLACA,
            xuso: getFleetContractData.result.recordset[0].XUSO,
            xtipovehiculo: getFleetContractData.result.recordset[0].XTIPOVEHICULO,
            fano: getFleetContractData.result.recordset[0].FANO,
            xserialcarroceria: getFleetContractData.result.recordset[0].XSERIALCARROCERIA,
            xserialmotor: getFleetContractData.result.recordset[0].XSERIALMOTOR,
            mpreciovehiculo: getFleetContractData.result.recordset[0].MPRECIOVEHICULO,
            ctipovehiculo: getFleetContractData.result.recordset[0].CTIPOVEHICULO,
            xtipomodelovehiculo: getFleetContractData.result.recordset[0].XTIPOMODELO,
            ncapacidadcargavehiculo: getFleetContractData.result.recordset[0].NCAPACIDADCARGA,
            ncapacidadpasajerosvehiculo: getFleetContractData.result.recordset[0].NCAPACIDADPASAJEROS,
            xplancoberturas: getPlanData.result.recordset[0].XPLAN_RC,
            xtomador: getFleetContractData.result.recordset[0].XTOMADOR,
            xprofesion: getFleetContractData.result.recordset[0].XPROFESION,
            xrif: getFleetContractData.result.recordset[0].XRIF,
            xdomicilio: getFleetContractData.result.recordset[0].XDOMICILIO,
            xzona_postal: getFleetContractData.result.recordset[0].XZONA_POSTAL,
            xtelefono: getFleetContractData.result.recordset[0].XTELEFONO,
            xcorreo: getFleetContractData.result.recordset[0].XCORREO,
            xestado: getFleetContractData.result.recordset[0].XESTADO,
            xciudad: getFleetContractData.result.recordset[0].XCIUDAD,
            xclase: getFleetContractData.result.recordset[0].XCLASE,
            nkilometraje: getFleetContractData.result.recordset[0].NKILOMETRAJE,
            xzona_postal_propietario: getFleetContractData.result.recordset[0].XZONA_POSTAL_PROPIETARIO,
            xplanservicios: xplanservicios,
            mprimatotal: mprimatotal,
            mprimaprorratatotal: mprimaprorratatotal,
            accesories: accesories,
            inspections: inspections,
            services:services,
            realCoverages: realCoverages,
            coverageAnnexes: coverageAnnexes,
            fdesde_pol: getPolicyEffectiveDate.result.recordset[0].FDESDE_POL,
            fhasta_pol: getPolicyEffectiveDate.result.recordset[0].FHASTA_POL
        }
    }else{ return { status: false, code: 404, message: 'Fleet Contract not found.' }; }
}

router.route('/receipt-detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationReceiptDetail(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationReceiptDetail' } });
        });
    }
});

const operationReceiptDetail = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let receiptData = {
        crecibo: requestBody.crecibo
    };
    let xnombretomador;
    let xdocidentidadtomador;
    let xdirecciontomador;
    let xemailtomador;
    let xestadotomador;
    let xciudadtomador;
    let getReceiptData = await bd.getReceiptData(receiptData);
    if(getReceiptData.error){ return { status: false, code: 500, message: getReceiptData.error }; }
    if(getReceiptData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Receipt Data not found.' }; }
    if(getReceiptData.result.recordset[0].CTOMADOR && getReceiptData.result.recordset[0].CTOMADOR != 0) {
        let getPolicyHolder = await bd.getPolicyHolderData(getReceiptData.result.recordset[0].CTOMADOR);
        if(getPolicyHolder.error){ return { status: false, code: 500, message: getPolicyHolder.error }; }
        if(getPolicyHolder.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Policy Holder Data not found.' }; }
        xnombretomador = getPolicyHolder.result.recordset[0].XTOMADOR;
        xdocidentidadtomador = getPolicyHolder.result.recordset[0].XRIF;
        xdirecciontomador = getPolicyHolder.result.recordset[0].XDOMICILIO;
        xtelefonotomador = getPolicyHolder.result.recordset[0].XTELEFONO;
        xemailtomador = getPolicyHolder.result.recordset[0].XCORREO;
        xestadotomador = getPolicyHolder.result.recordset[0].XESTADO;
        xciudadtomador = getPolicyHolder.result.recordset[0].XCIUDAD;
    } else{
        xnombretomador = getReceiptData.result.recordset[0].XCLIENTE;
        xdocidentidadtomador = getReceiptData.result.recordset[0].XDOCIDENTIDAD;
        xdirecciontomador = getReceiptData.result.recordset[0].XDIRECCIONFISCAL;
        xtelefonotomador = getReceiptData.result.recordset[0].XTELEFONO;
        xemailtomador = getReceiptData.result.recordset[0].XEMAIL;
        xestadotomador = getReceiptData.result.recordset[0].XESTADO;
        xciudadtomador = getReceiptData.result.recordset[0].XCIUDAD;
    }
    return {
        status: true,
        ccarga: getReceiptData.result.recordset[0].CCARGA,
        crecibo: getReceiptData.result.recordset[0].CRECIBO,
        xrecibo: getReceiptData.result.recordset[0].XRECIBO,
        xpoliza: getReceiptData.result.recordset[0].xpoliza,
        nconsecutivo: getReceiptData.result.recordset[0].NCONSECUTIVO,
        femision: getReceiptData.result.recordset[0].FEMISION,
        fsubscripcion: getReceiptData.result.recordset[0].FCREACION,
        fdesde_pol: getReceiptData.result.recordset[0].FDESDE_POL,
        fhasta_pol: getReceiptData.result.recordset[0].FHASTA_POL,
        fdesde_rec: getReceiptData.result.recordset[0].FDESDE_REC,
        fhasta_rec: getReceiptData.result.recordset[0].FHASTA_REC,
        xsucursalemision: getReceiptData.result.recordset[0].XSUCURSALEMISION,
        xsucursalsuscriptora: getReceiptData.result.recordset[0].XSUCURSALSUSCRIPTORA,
        cmoneda: getReceiptData.result.recordset[0].CMONEDA,
        xmoneda: getReceiptData.result.recordset[0].xmoneda,
        mprimaanual: getReceiptData.result.recordset[0].MPRIMA_ANUAL,
        mprimaprorrata: getReceiptData.result.recordset[0].MPRIMA_PRORRATA,
        fanulado: getReceiptData.result.recordset[0].FANULADO,
        fcobro: getReceiptData.result.recordset[0].FCOBRO,
        iestado: getReceiptData.result.recordset[0].iestado,
        xnombretomador: xnombretomador,
        xdocidentidadtomador: xdocidentidadtomador,
        xdireccionfiscaltomador: xdirecciontomador,
        xtelefonotomador: xtelefonotomador,
        xemailtomador: xemailtomador,
        xestadotomador: xestadotomador,
        xciudadtomador: xciudadtomador,
        xnombrepropietario: getReceiptData.result.recordset[0].XNOMBRE + ' ' + getReceiptData.result.recordset[0].XAPELLIDO,
        xdocidentidadpropietario: getReceiptData.result.recordset[0].XDOCIDENTIDADPROPIETARIO,
        xdireccionpropietario: getReceiptData.result.recordset[0].XDIRECCION,
        xtelefonopropietario: getReceiptData.result.recordset[0].XTELEFONOCASA,
        xemailpropietario: getReceiptData.result.recordset[0].XEMAILPROPIETARIO,
        xmetodologiapago: getReceiptData.result.recordset[0].XMETODOLOGIAPAGO,
        xestadorpopietario: getReceiptData.result.recordset[0].XESTADOPROPIETARIO,
        xciudadpropietario: getReceiptData.result.recordset[0].XCIUDADPROPIETARIO,
        ccorredor: getReceiptData.result.recordset[0].CCORREDOR,
        xcorredor: getReceiptData.result.recordset[0].XCORREDOR,
        xplaca: getReceiptData.result.recordset[0].XPLACA,
        fano: getReceiptData.result.recordset[0].FANO,
        xserialcarroceria: getReceiptData.result.recordset[0].XSERIALCARROCERIA,
        xserialmotor: getReceiptData.result.recordset[0].XSERIALMOTOR,
        xuso: getReceiptData.result.recordset[0].XUSO,
        xtipo: getReceiptData.result.recordset[0].XTIPO,
        xcolor: getReceiptData.result.recordset[0].XCOLOR,
        xmarca: getReceiptData.result.recordset[0].XMARCA,
        xmodelo: getReceiptData.result.recordset[0].XMODELO,
        xversion: getReceiptData.result.recordset[0].XVERSION,
        xtransmision: getReceiptData.result.recordset[0].XTRANSMISION,
        npasajeros: getReceiptData.result.recordset[0].NPASAJERO,
        nkilometraje: getReceiptData.result.recordset[0].NKILOMETRAJE,
        xtituloreporte: getReceiptData.result.recordset[0].XTITULO_REPORTE,
        xrepresentantelegal: getReceiptData.result.recordset[0].XREPRESENTANTELEGAL,
        xdocidentidadrepresentantelegal: getReceiptData.result.recordset[0].XDOCIDENTIDADREPRESENTANTELEGAL,
        cestatusgeneral: getReceiptData.result.recordset[0].CESTATUSGENERAL
    }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateFleetContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateFleetContractManagement' } });
        });
    }
});

const operationUpdateFleetContractManagement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccontratoflota', 'ccliente', 'casociado', 'cagrupador', 'finicio', 'fhasta' ,'cestatusgeneral', 'xcertificadoasociado', 'ctrabajador', 'cpropietario', 'cvehiculopropietario', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let fleetContractData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccontratoflota: requestBody.ccontratoflota,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        cagrupador: requestBody.cagrupador,
        finicio: requestBody.finicio,
        fhasta: requestBody.fhasta,
        cestatusgeneral: requestBody.cestatusgeneral,
        xcertificadoasociado: helper.encrypt(requestBody.xcertificadoasociado),
        xsucursalemision: requestBody.xsucursalemision,
        xsucursalsuscriptora: requestBody.xsucursalsuscriptora,
        ctrabajador: requestBody.ctrabajador,
        cpropietario: requestBody.cpropietario,
        cvehiculopropietario: requestBody.cvehiculopropietario,
        cplan: requestBody.cplan,
        ctipoplan: requestBody.ctipoplan,
        cmetodologiapago: requestBody.cmetodologiapago,
        ctiporecibo: requestBody.ctiporecibo,
        fhastarecibo: requestBody.fhastarecibo,
        cusuariomodificacion: requestBody.cusuariomodificacion,
        xanexo: requestBody.xanexo.toUpperCase(),
        xobservaciones: requestBody.xobservaciones.toUpperCase(),
    }
    let verifyFleetContractVehicle = await bd.verifyFleetContractVehicleToUpdateQuery(fleetContractData).then((res) => res);
    if(verifyFleetContractVehicle.error){ return { status: false, code: 500, message: verifyFleetContractVehicle.error }; }
    if(verifyFleetContractVehicle.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-contract-already-exist' }; }
    else{
        let updateFleetContract = await bd.updateFleetContractQuery(fleetContractData).then((res) => res);
        if(updateFleetContract.error){ return { status: false, code: 500, message: updateFleetContract.error }; }
        if(updateFleetContract.result.rowsAffected > 0){
            if(requestBody.accesories){
                if(requestBody.accesories.create && requestBody.accesories.create.length > 0){
                    for(let i = 0; i < requestBody.accesories.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.accesories.create[i], ['caccesorio','maccesoriocontratoflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let createAccesoriesByFleetContractUpdate = await bd.createAccesoriesByFleetContractUpdateQuery(requestBody.accesories.create, fleetContractData).then((res) => res);
                    if(createAccesoriesByFleetContractUpdate.error){ return { status: false, code: 500, message: createAccesoriesByFleetContractUpdate.error }; }
                    if(createAccesoriesByFleetContractUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createAccesoriesByFleetContractUpdate' }; }
                } 
                if(requestBody.accesories.update && requestBody.accesories.update.length > 0){
                    for(let i = 0; i < requestBody.accesories.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.accesories.update[i], ['caccesorio','maccesoriocontratoflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let updateAccesoriesByFleetContractUpdate = await bd.updateAccesoriesByFleetContractUpdateQuery(requestBody.accesories.update, fleetContractData).then((res) => res);
                    if(updateAccesoriesByFleetContractUpdate.error){ return { status: false, code: 500, message: updateAccesoriesByFleetContractUpdate.error }; }
                    if(updateAccesoriesByFleetContractUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Accesory not found.' }; }
                }
                if(requestBody.accesories.delete && requestBody.accesories.delete.length){
                    for(let i = 0; i < requestBody.accesories.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.accesories.delete[i], ['caccesorio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteAccesoriesByFleetContractUpdate = await bd.deleteAccesoriesByFleetContractUpdateQuery(requestBody.accesories.delete, fleetContractData).then((res) => res);
                    if(deleteAccesoriesByFleetContractUpdate.error){ return { status: false, code: 500, message: deleteAccesoriesByFleetContractUpdate.error }; }
                    if(deleteAccesoriesByFleetContractUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteAccesoriesByFleetContractUpdate' }; }
                }
            }
            if(requestBody.inspections){
                if(requestBody.inspections.create && requestBody.inspections.create.length > 0){
                    for(let i = 0; i < requestBody.inspections.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.inspections.create[i], ['cperito', 'ctipoinspeccion', 'finspeccion', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        requestBody.inspections.create[i].xobservacion = helper.encrypt(requestBody.inspections.create[i].xobservacion.toUpperCase());
                        if(requestBody.inspections.create[i].images && requestBody.inspections.create[i].images.length > 0){
                            for(let j = 0; j < requestBody.inspections.create[i].images.length; j++){
                                if(!helper.validateRequestObj(requestBody.inspections.create[i].images[j], ['xrutaimagen'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                            }
                        }
                    }
                    let createInspectonsByFleetContractUpdate = await bd.createInspectonsByFleetContractUpdateQuery(requestBody.inspections.create, fleetContractData).then((res) => res);
                    if(createInspectonsByFleetContractUpdate.error){ return { status: false, code: 500, message: createInspectonsByFleetContractUpdate.error }; }
                    if(createInspectonsByFleetContractUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createInspectonsByFleetContractUpdate' }; }
                } 
                if(requestBody.inspections.update && requestBody.inspections.update.length > 0){
                    for(let i = 0; i < requestBody.inspections.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.inspections.update[i], ['cinspeccioncontratoflota', 'cperito', 'ctipoinspeccion', 'finspeccion', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        requestBody.inspections.update[i].xobservacion = helper.encrypt(requestBody.inspections.update[i].xobservacion.toUpperCase());
                        if(requestBody.inspections.update[i].imagesResult){
                            if(requestBody.inspections.update[i].imagesResult.create && requestBody.inspections.update[i].imagesResult.create.length > 0){
                                for(let j = 0; j < requestBody.inspections.update[i].imagesResult.create.length; j++){
                                    if(!helper.validateRequestObj(requestBody.inspections.update[i].imagesResult.create[j], ['xrutaimagen'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                                }
                            }
                            if(requestBody.inspections.update[i].imagesResult.update && requestBody.inspections.update[i].imagesResult.update.length > 0){
                                for(let j = 0; j < requestBody.inspections.update[i].imagesResult.update.length; j++){
                                    if(!helper.validateRequestObj(requestBody.inspections.update[i].imagesResult.update[j], ['cimageninspeccion', 'xrutaimagen'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                                }
                            }
                            if(requestBody.inspections.update[i].imagesResult.delete && requestBody.inspections.update[i].imagesResult.delete.length > 0){
                                for(let j = 0; j < requestBody.inspections.update[i].imagesResult.delete.length; j++){
                                    if(!helper.validateRequestObj(requestBody.inspections.update[i].imagesResult.delete[j], ['cimageninspeccion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                                }
                            }
                        }
                    }
                    let updateInspectionsByFleetContractUpdate = await bd.updateInspectionsByFleetContractUpdateQuery(requestBody.inspections.update, fleetContractData).then((res) => res);
                    if(updateInspectionsByFleetContractUpdate.error){ return { status: false, code: 500, message: updateInspectionsByFleetContractUpdate.error }; }
                    if(updateInspectionsByFleetContractUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Inspection not found.' }; }
                }
                if(requestBody.inspections.delete && requestBody.inspections.delete.length){
                    for(let i = 0; i < requestBody.inspections.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.inspections.delete[i], ['cinspeccioncontratoflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteInspectionsByFleetContractUpdate = await bd.deleteInspectionsByFleetContractUpdateQuery(requestBody.inspections.delete, fleetContractData).then((res) => res);
                    if(deleteInspectionsByFleetContractUpdate.error){ return { status: false, code: 500, message: deleteInspectionsByFleetContractUpdate.error }; }
                    if(deleteInspectionsByFleetContractUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteInspectionsByFleetContractUpdate' }; }
                }
            }
            return { status: true, ccontratoflota: fleetContractData.ccontratoflota }; 
        }
        else{ return { status: false, code: 404, message: 'Fleet Contract not found.' }; }
    }
}

router.route('/charge-contracts').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationChargeContracts(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateFleetContractManagement' } });
        });
    }
});

const operationChargeContracts = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let processCharge = await bd.createChargeQuery(requestBody.parsedData, requestBody.ccliente, requestBody.ctipopago, requestBody.npoliza);
    if(processCharge.error){ return { status: false, code: 500, message: getReceiptData.error }; }
    if(processCharge.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Receipt Data not found.' }; }
    return {
        status: true,
        code: 200,
        message: "todo bien"
    }
}

router.route('/create/individualContract').post((req, res) => {
    operationCreateIndividualContract(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        console.log(err.message)
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateIndividualContract' } });
    });
});

const operationCreateIndividualContract = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    
    let userData = {
        xnombre: requestBody.xnombre.toUpperCase(),
        xapellido: requestBody.xapellido.toUpperCase(),
        cano: requestBody.cano ? requestBody.cano : undefined,
        xcolor: requestBody.xcolor ? requestBody.xcolor : undefined,
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        cversion: requestBody.cversion ? requestBody.cversion : undefined,
        xrif_cliente: requestBody.xrif_cliente ? requestBody.xrif_cliente : undefined,
        email: requestBody.email ? requestBody.email : undefined,
        xtelefono_prop: requestBody.xtelefono_prop ? requestBody.xtelefono_prop : undefined,
        xdireccionfiscal: requestBody.xdireccionfiscal.toUpperCase(),
        xserialmotor: requestBody.xserialmotor.toUpperCase(),
        xserialcarroceria: requestBody.xserialcarroceria.toUpperCase(),
        xplaca: requestBody.xplaca.toUpperCase(),
        xtelefono_emp: requestBody.xtelefono_emp,
        cplan: requestBody.cplan,
        ccorredor: requestBody.ccorredor ? requestBody.ccorredor : undefined,
        mgrua: requestBody.mgrua ? requestBody.mgrua : undefined,
        xcedula:requestBody.xcedula,
        xcobertura: requestBody.xcobertura.toUpperCase(),
        ncapacidad_p: requestBody.ncapacidad_p,
        ctarifa_exceso: requestBody.ctarifa_exceso,
        cmetodologiapago: requestBody.cmetodologiapago ? requestBody.cmetodologiapago : undefined,
        msuma_aseg: requestBody.msuma_aseg ? requestBody.msuma_aseg : undefined,
        pcasco: requestBody.pcasco ? requestBody.pcasco : undefined,
        mprima_casco: requestBody.mprima_casco ? requestBody.mprima_casco : undefined,
        mcatastrofico: requestBody.mcatastrofico ? requestBody.mcatastrofico : undefined,
        pdescuento: requestBody.pdescuento ? requestBody.pdescuento : undefined,
        ifraccionamiento: requestBody.ifraccionamiento ? requestBody.ifraccionamiento : undefined,
        ncuotas: requestBody.ncuotas ? requestBody.ncuotas : undefined,
        mprima_bruta: requestBody.mprima_bruta ? requestBody.mprima_bruta : undefined,
        mprima_blindaje: requestBody.mprima_blindaje ? requestBody.mprima_blindaje : undefined,
        msuma_blindaje: requestBody.msuma_blindaje ? requestBody.msuma_blindaje : undefined,
        pcatastrofico: requestBody.pcatastrofico ? requestBody.pcatastrofico : undefined,
        pmotin: requestBody.pmotin ? requestBody.pmotin : undefined,
        mmotin: requestBody.mmotin ? requestBody.mmotin : undefined,
        pblindaje: requestBody.pblindaje ? requestBody.pblindaje : undefined,
        cestado: requestBody.cestado ? requestBody.cestado : undefined,
        cciudad: requestBody.cciudad ? requestBody.cciudad : undefined,
        cpais: requestBody.cpais ? requestBody.cpais : undefined,
        icedula: requestBody.icedula ? requestBody.icedula : undefined,
        femision: requestBody.femision ,
        ivigencia: requestBody.ivigencia ? requestBody.ivigencia : undefined,
        cproductor: requestBody.cproductor ? requestBody.cproductor : undefined,
        ccodigo_ubii: requestBody.ccodigo_ubii ? requestBody.ccodigo_ubii : undefined,
        ctomador: requestBody.ctomador ? requestBody.ctomador : undefined,
        cusuario: requestBody.cusuario ? requestBody.cusuario : undefined,
        xzona_postal: requestBody.xzona_postal ? requestBody.xzona_postal : undefined,
        cuso: requestBody.cuso ? requestBody.cuso : undefined,
        ctipovehiculo: requestBody.ctipovehiculo ? requestBody.ctipovehiculo : undefined,
        nkilometraje: requestBody.nkilometraje ? requestBody.nkilometraje : undefined,
        cclase: requestBody.cclase ? requestBody.cclase : undefined,
    };
    let paymentList = {};
    if(requestBody.payment){
        paymentList = {
            ctipopago: requestBody.payment.ctipopago,
            xreferencia: requestBody.payment.xreferencia,
            fcobro: requestBody.payment.fcobro,
            cbanco: requestBody.payment.cbanco,
            cbanco_destino: requestBody.payment.cbanco_destino,
            mprima_pagada: requestBody.payment.mprima_pagada,
            mprima_bs: requestBody.payment.mprima_bs,
            xnota: requestBody.payment.xnota,
            mtasa_cambio: requestBody.payment.mtasa_cambio,
            ftasa_cambio: requestBody.payment.ftasa_cambio,
            cestatusgeneral: requestBody.payment.cestatusgeneral,
        }
    }else{
        paymentList = {
            ctipopago:  requestBody.ctipopago ? requestBody.ctipopago: undefined,
            xreferencia:  requestBody.xreferencia ? requestBody.xreferencia: undefined,
            fcobro: requestBody.fcobro ? requestBody.fcobro: undefined,
            cbanco: requestBody.cbanco ? requestBody.cbanco: undefined,
            cbanco_destino: requestBody.cbanco_destino ? requestBody.cbanco_destino: undefined,
            mprima_pagada: requestBody.mprima_pagada ? requestBody.mprima_pagada: undefined,
            mprima_bs: requestBody.mprima_bs ? requestBody.mprima_bs: undefined,
            xnota: requestBody.xnota ? equestBody.xnota: undefined,
            mtasa_cambio: requestBody.mtasa_cambio ? requestBody.mtasa_cambio: undefined,
            ftasa_cambio: requestBody.ftasa_cambio ? requestBody.ftasa_cambio: undefined,
            cestatusgeneral: requestBody.cestatusgeneral ? requestBody.cestatusgeneral: undefined,
        }
    }
    
    if(userData){
        let operationCreateIndividualContract = await bd.createIndividualContractQuery(userData, paymentList).then((res) => res);
        if(operationCreateIndividualContract.error){ return { status: false, code: 500, message: operationCreateIndividualContract.error }; }
    }
    if(requestBody.accessory){
        let accessoryData = [];
        for(let i = 0; i < requestBody.accessory.length; i++){
            accessoryData.push({
                caccesorio:  requestBody.accessory[i].caccesorio,
                msuma_accesorio:  requestBody.accessory[i].msuma_aseg,
                mprima_accesorio:  requestBody.accessory[i].mprima,
                ptasa:  requestBody.accessory[i].ptasa
            })
        }
        console.log(accessoryData)
        let createAccesories = await bd.createAccesoriesFromFleetContractIndividual(accessoryData).then((res) => res);
        if(createAccesories.error){ return { status: false, code: 500, message: createAccesories.error }; }
    }
    let lastFleetContract = await bd.getLastFleetContract();
    if(lastFleetContract.error){ return { status: false, code: 500, message: lastFleetContract.error }; }
    let lastReceipt = await bd.getLastReceipt(requestBody.xplaca.toUpperCase(), lastFleetContract.ccontratoflota);
    if(lastReceipt.error){ return { status: false, code: 500, message: lastReceipt.error }; }
    let getCharge = await bd.getCharge(lastReceipt.ccarga);
    if(getCharge.error){ return { status: false, code: 500, message: getCharge.error }; }
    return { 
        status: true, 
        code: 200, 
        ccontratoflota: lastFleetContract.ccontratoflota, 
        ccliente: lastFleetContract.ccliente, 
        cpropietario: lastFleetContract.cpropietario, 
        cvehiculopropietario: lastFleetContract.cvehiculopropietario, 
        crecibo: lastReceipt.crecibo, 
        femision: lastReceipt.femision, 
        fdesde_pol: lastReceipt.fdesde_pol, 
        fhasta_pol: lastReceipt.fhasta_pol, 
        fdesde_rec: lastReceipt.fdesde_rec, 
        fhasta_rec: lastReceipt.fhasta_rec, 
        xrecibo: lastReceipt.xrecibo,
        fsuscripcion: getCharge.fsuscripcion
    };
}




// Funcion para redondear, tomada de: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Math/round
(function() {
    /**
     * Ajuste decimal de un número.
     *
     * @param {String}  tipo  El tipo de ajuste.
     * @param {Number}  valor El numero.
     * @param {Integer} exp   El exponente (el logaritmo 10 del ajuste base).
     * @returns {Number} El valor ajustado.
     */
    function decimalAdjust(type, value, exp) {
      // Si el exp no está definido o es cero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // Si el valor no es un número o el exp no es un entero...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Shift back
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
  
    // Decimal round
    if (!Math.round10) {
      Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
      };
    }
    // Decimal floor
    if (!Math.floor10) {
      Math.floor10 = function(value, exp) {
        return decimalAdjust('floor', value, exp);
      };
    }
    // Decimal ceil
    if (!Math.ceil10) {
      Math.ceil10 = function(value, exp) {
        return decimalAdjust('ceil', value, exp);
      };
    }
  })();

router.route('/search-tarifa').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchTarifa(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTarifa' } });
        });
    }
});

const operationSearchTarifa = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let getSeatchTarifa = await bd.getSeatchTarifaData(receiptData);
    if(getSeatchTarifa.error){ return { status: false, code: 500, message: getSeatchTarifa.error }; }
    if(getSeatchTarifa.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Receipt Data not found.' }; }
    return {
        status: true,
            id: getSeatchTarifa.result.recordset[0].ID,
            xmodelo: getSeatchTarifa.result.recordset[0].XMODELO
    }
}

router.route('/tarifa-casco').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationTarifaCasco(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationTarifaCasco' } });
        });
    }
});

const operationTarifaCasco = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xtipo: requestBody.xtipo,
        xmarca: requestBody.xmarca,
        xmodelo: requestBody.xmodelo,
        cano: parseInt(requestBody.cano),
        xcobertura:requestBody.xcobertura,
    };
    if(requestBody.xcobertura == 'AMPLIA'){
        let query = await bd.SearchTarifaCasco(searchData).then((res) => res);
        if(query.error){ return { status: false, code: 500, message: operationTarifaCasco.error };  }
        if(query.result){
            let tarifa = await bd.SearchTarifas(searchData).then((res) => res);
            if(tarifa.error){ return { status: false, code: 500, message: operationTarifas.error };}
            let jsonList = [];
            for(let i = 0; i < tarifa.result.recordset.length; i++){
                jsonList.push({ptarifa: tarifa.result.recordset[i].PTARIFA});
            }
            return { status: true,
                    ptasa_casco: query.result.recordset[0].PTASA_CASCO,
                    ptarifa: jsonList
                    }
        }
        return { status: true,
                ptasa_casco: query.result.recordset[0].PTASA_CASCO
                }
    }
    
    else if(requestBody.xcobertura == 'PERDIDA TOTAL'){
        let query = await bd.SearchTarifaPerdida(searchData).then((res) => res);
        if(query.error){ return { status: false, code: 500, message: query.error }; }
        if(query.result){
            let tarifa = await bd.SearchTarifas(searchData).then((res) => res);
            if(tarifa.error){ return { status: false, code: 500, message: operationTarifas.error };}
            let jsonList = [];
            for(let i = 0; i < tarifa.result.recordset.length; i++){
                jsonList.push({ptarifa: tarifa.result.recordset[i].PTARIFA});
            }
            return { status: true,
                     ptasa_casco: query.result.recordset[0].PTASA_CASCO,
                     ptarifa: jsonList
                    }
        }
        return { status: true,
                 ptasa_casco: query.result.recordset[0].PTASA_CASCO,
                }
    }       
}

router.route('/tarifa-casco/validation').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValidateTarifaCasco(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValidateTarifaCasco' } });
        });
    }
});

const operationValidateTarifaCasco = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xtipo: requestBody.xtipo,
        cano: parseInt(requestBody.cano),
        xcobertura:requestBody.xcobertura,
    };
    if(requestBody.xcobertura == 'AMPLIA'){
        let query = await bd.ValidateTarifaCasco(searchData).then((res) => res);
        if(query.error){ return { status: false, code: 505, message: operationValidateTarifaCasco.error };  }
        console.log(query.result.recordset)
        return { status: true,
            cano: query.result.recordset
        }
    }
    else if(requestBody.xcobertura == 'PERDIDA'){
        let query = await bd.ValidateTarifaPerdida(searchData).then((res) => res);
        if(query.error){ return { status: false, code: 505, message: query.error }; }

        return { status: true,
            cano: query.result.recordset
        }
    }       
}
router.route('/validate-plate').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValidatePlate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValidatePlace' } });
        });
    }
});

const operationValidatePlate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xplaca: requestBody.xplaca,
    };

        let query = await bd.ValidatePLate(searchData).then((res) => res);
        if(query.error){ return { status: false, code: 500, message: operationValidatePLace.error };  }
        return { status: true,
                xdocidentidad: query.result.recordset[0].XDOCIDENTIDAD,
                fdesde_pol: query.result.recordset[0].FDESDE_POL.toLocaleDateString(),
                fhasta_pol: query.result.recordset[0].FHASTA_POL.toLocaleDateString(),
                xpoliza: query.result.recordset[0].XPOLIZA,
                }
    
     
}


router.route('/value-plan').post((req, res) => {
    console.log('hola')
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValuePlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationPlanValue' } });
        });
    }
});

const operationValuePlan = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cplan_rc: requestBody.cplan,
        cmetodologiapago: requestBody.cmetodologiapago,
        ctarifa_exceso: requestBody.ctarifa_exceso,
        igrua: requestBody.igrua,
        ncapacidad_p: requestBody.ncapacidad_p
    };
    console.log(searchData)
    let valueplan = await bd.SearchPlanValue(searchData).then((res) => res);
    if(valueplan.error){ return { status: false, code: 500, message: ValuePlan.error }; }
    if(valueplan.result.rowsAffected > 0){
               
        return { 
                status : true,
                mprima: valueplan.result.recordset[0].MPRIMA.toFixed(2),
                ccubii: valueplan.result.recordset[0].CCUBII,
  
               };
                     
    }else{ return { status: false, code: 404, message: 'value not found.' }; }

    
}

router.route('/value-grua').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValueGrua(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationPlanValue' } });
        });
    }
});

const operationValueGrua = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ctarifa_exceso: requestBody.ctarifa_exceso
    };
    let valuegrua = await bd.SearchPlanGrua(searchData).then((res) => res);
    if(valuegrua.error){ return { status: false, code: 500, message: valuegrua.error }; }
    if(valuegrua.result.rowsAffected > 0){
         console.log(valuegrua.result.recordset[0].MGRUA)
        return { 
                status : true,
                mgrua: valuegrua.result.recordset[0].MGRUA,
  
               };
                     
    }else{ return { status: false, code: 404, message: 'value not found.' }; }

    
}
router.route('/update-coverage').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateFleetContractCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateFleetContractCoverage' } });
        });
    }
});

const operationUpdateFleetContractCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let datesList = []
    if(requestBody.fechas){
        datesList.push({
            ccarga: requestBody.fechas.ccarga,
            fdesde_pol: requestBody.fechas.fdesde_pol,
            fhasta_pol: requestBody.fechas.fhasta_pol,
            fdesde_rec: requestBody.fechas.fdesde_rec,
            fhasta_rec: requestBody.fechas.fhasta_rec
        })
        let updateDatesFromFleetContract = await bd.updateDatesFromFleetContractQuery(datesList).then((res) => res);
        if(updateDatesFromFleetContract.error){ return { status: false, code: 500, message: updateDatesFromFleetContract.error }; }
    }
    let coverageList = [];
    if(requestBody.coverage){
        coverageList.push({
            ccobertura: requestBody.coverage.update.ccobertura,
            ccontratoflota: requestBody.coverage.update.ccontratoflota,
            mprima: requestBody.coverage.update.mprima,
            msuma_aseg: requestBody.coverage.update.msuma_aseg
        })
        let updateCoverageFromFleetContract = await bd.updateCoverageFromFleetContractQuery(coverageList).then((res) => res);
        if(updateCoverageFromFleetContract.error){ return { status: false, code: 500, message: updateCoverageFromFleetContract.error }; }
    }
    let extraList=[]
    if(requestBody.extras){
        extras.push({
            ccontratoflota: requestBody.coverage.update.ccontratoflota,
            xanexo: requestBody.xanexo.toUpperCase(),
            xobservaciones: requestBody.xobservaciones.toUpperCase(),
        })
        let udpateExtras = await bd.updateCoverageFromFleetContractQuery(extraList).then((res) => res);
        if(udpateExtras.error){ return { status: false, code: 500, message: updateCoverageFromFleetContract.error }; }

    }
    return { status: true, ccarga: datesList[0].ccarga }; 
}

router.route('/detail-coverage').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCoverage' } });
        });
    }
});

const operationDetailCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccobertura: requestBody.ccobertura,
        ccontratoflota: requestBody.ccontratoflota
    }
    let detailCoverage = await bd.detailCoverageQuery(searchData).then((res) => res);
    if(detailCoverage.error){ return { status: false, code: 500, message: detailCoverage.error }; }
    if(detailCoverage.result.rowsAffected > 0){
        return {    
                status: true, 
                ccobertura: detailCoverage.result.recordset[0].CCOBERTURA,
                xcobertura: detailCoverage.result.recordset[0].XCOBERTURA,
                ccontratoflota: detailCoverage.result.recordset[0].ccontratoflota,
                mprima: detailCoverage.result.recordset[0].mprima,
                msuma_aseg: detailCoverage.result.recordset[0].msuma_aseg,
               };

    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}


router.route('/validationexistingcustomer').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValidationUser(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(404).json({ data: { status: false, code: 404, message: err.message, hint: 'operationSearchClient' } });
        });
    }
});


const operationValidationUser = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xdocidentidad: requestBody.xdocidentidad,
       
    };
    let query = await bd.ValidateCliente(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 404, message: operationSearchClient.error };  }
    if(query.result.rowsAffected > 0){
    return { status: true,
             xnombre: query.result.recordset[0].XNOMBRE,
             xapellido: query.result.recordset[0].XAPELLIDO,
             xdireccion:  query.result.recordset[0].XDIRECCION,
             xemail:  query.result.recordset[0].XEMAIL,
             xtelefonocelular:  query.result.recordset[0].XTELEFONOCELULAR,
             xtelefonocasa:  query.result.recordset[0].XTELEFONOCASA,
             ccorredor:  query.result.recordset[0].CCORREDOR,
             cpais:  query.result.recordset[0].CPAIS,
             xpais:  query.result.recordset[0].XPAIS,
             cestado:  query.result.recordset[0].CESTADO,
             xestado:  query.result.recordset[0].XESTADO,
             cciudad:  query.result.recordset[0].CCIUDAD,
             xciudad:  query.result.recordset[0].XCIUDAD,
            }
    }
}

router.route('/contractvalidationpaid').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationcontractvalidationpaid(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(404).json({ data: { status: false, code: 404, message: err.message, hint: 'operationvalidationpaid' } });
        });
    }
});


const operationcontractvalidationpaid = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccodigo_ubii: requestBody.ccodigo_ubii,
       
    };
    let query = await bd.Validatepayment(searchData).then((res) => res);
    console.log(query)
    if(query.error){ return { status: false, code: 404, message: operationvalidationpaid.error };  }
    if(query.result.rowsAffected > 0){
    return { status: true,
            cestatusgeneral : query.result.recordset[0].CESTAUSGENERAL
            }
    }
    else if(query.result.rowsAffected < 0){
        return { status: false,
            }
    }
}


router.route('/create/Contract-Broker').post((req, res) => {
    operationCreateContractBroker(req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        console.log(err.message)
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationContract' } });
    });
});

const operationCreateContractBroker = async(requestBody) => {
    let userData = {
        icedula: requestBody.icedula ? requestBody.icedula : undefined,
        xrif_cliente: requestBody.xrif_cliente ? requestBody.xrif_cliente : undefined,
        xnombre: requestBody.xnombre.toUpperCase(),
        xapellido: requestBody.xapellido.toUpperCase(),
        xtelefono_emp: requestBody.xtelefono_emp,
        xtelefono_prop: requestBody.xtelefono_prop ? requestBody.xtelefono_prop : undefined,
        email: requestBody.email ? requestBody.email : undefined,
        cpais: requestBody.cpais ? requestBody.cpais : undefined,
        cestado: requestBody.cestado ? requestBody.cestado : undefined,
        cciudad: requestBody.cciudad ? requestBody.cciudad : undefined,
        xdireccionfiscal: requestBody.xdireccionfiscal.toUpperCase(),
        xplaca: requestBody.xplaca.toUpperCase(),
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        cversion: requestBody.cversion ? requestBody.cversion : undefined,
        cano: requestBody.cano ? requestBody.cano : undefined,
        ncapacidad_p: requestBody.ncapacidad_p,
        xcolor: requestBody.xcolor ? requestBody.xcolor : undefined,
        xserialcarroceria: requestBody.xserialcarroceria.toUpperCase(),
        xserialmotor: requestBody.xserialmotor.toUpperCase(),
        xcobertura: requestBody.xcobertura.toUpperCase(),
        cplan: requestBody.cplan,
        cmetodologiapago: requestBody.cmetodologiapago ? requestBody.cmetodologiapago : undefined,
        femision: requestBody.femision ,
        ncobro: requestBody.ncobro ,
        corden: requestBody.corden,
        ccorredor: requestBody.ccorredor ? requestBody.ccorredor : undefined,
        xcedula:requestBody.xcedula,
        ivigencia: requestBody.ivigencia ? requestBody.ivigencia : undefined,
        msuma_aseg: requestBody.msuma_aseg ? requestBody.msuma_aseg : undefined,
        pcasco: requestBody.pcasco ? requestBody.pcasco : undefined,
        mprima_casco: requestBody.mprima_casco ? requestBody.mprima_casco : undefined,
        mcatastrofico: requestBody.mcatastrofico ? requestBody.mcatastrofico : undefined,
        pdescuento: requestBody.pdescuento ? requestBody.pdescuento : undefined,
        ifraccionamiento: requestBody.ifraccionamiento ? requestBody.ifraccionamiento : undefined,
        ncuotas: requestBody.ncuotas ? requestBody.ncuotas : undefined,
        mprima_bruta: requestBody.mprima_bruta ? requestBody.mprima_bruta : undefined,
        mprima_blindaje: requestBody.mprima_blindaje ? requestBody.mprima_blindaje : undefined,
        msuma_blindaje: requestBody.msuma_blindaje ? requestBody.msuma_blindaje : undefined,
        pcatastrofico: requestBody.pcatastrofico ? requestBody.pcatastrofico : undefined,
        pmotin: requestBody.pmotin ? requestBody.pmotin : undefined,
        mmotin: requestBody.mmotin ? requestBody.mmotin : undefined,
        pblindaje: requestBody.pblindaje ? requestBody.pblindaje : undefined,
        cproductor: requestBody.cproductor ? requestBody.cproductor : undefined,
        mgrua: requestBody.mgrua ? requestBody.mgrua : undefined,
        ctomador: requestBody.ctomador ? requestBody.ctomador : undefined,
        cusuario: requestBody.cusuario ? requestBody.cusuario : undefined,
        ctarifa_exceso: requestBody.ctarifa_exceso,
        xzona_postal: requestBody.xzona_postal ? requestBody.xzona_postal : undefined,
        xuso: requestBody.xuso ? requestBody.xuso : undefined,
        xtipo: requestBody.xtipo ? requestBody.xtipo : undefined,
        nkilometraje: requestBody.nkilometraje ? requestBody.nkilometraje : undefined,
        xclase: requestBody.xclase ? requestBody.xclase : undefined,

        //ccodigo_ubii: requestBody.ccodigo_ubii
    };
    console.log(userData)
    let paymentList = {};
    if(requestBody.payment){
        paymentList = {
            ctipopago: requestBody.payment.ctipopago,
            xreferencia: requestBody.payment.xreferencia,
            fcobro: requestBody.payment.fcobro,
            cbanco: requestBody.payment.cbanco,
            cbanco_destino: requestBody.payment.cbanco_destino,
            mprima_pagada: requestBody.payment.mprima_pagada,
            mprima_bs: requestBody.payment.mprima_bs,
            xnota: requestBody.payment.xnota,
            mtasa_cambio: requestBody.payment.mtasa_cambio,
            ftasa_cambio: requestBody.payment.ftasa_cambio,
            cestatusgeneral: requestBody.payment.cestatusgeneral,
        }
    }else{
        paymentList = {
            ctipopago:  requestBody.ctipopago ? requestBody.ctipopago: undefined,
            xreferencia:  requestBody.xreferencia ? requestBody.xreferencia: undefined,
            fcobro: requestBody.fcobro ? requestBody.fcobro: undefined,
            cbanco: requestBody.cbanco ? requestBody.cbanco: undefined,
            cbanco_destino: requestBody.cbanco_destino ? requestBody.cbanco_destino: undefined,
            mprima_pagada: requestBody.mprima_pagada ? requestBody.mprima_pagada: undefined,
            mprima_bs: requestBody.mprima_bs ? requestBody.mprima_bs: undefined,
            xnota: requestBody.xnota ? equestBody.xnota: undefined,
            mtasa_cambio: requestBody.mtasa_cambio ? requestBody.mtasa_cambio: undefined,
            ftasa_cambio: requestBody.ftasa_cambio ? requestBody.ftasa_cambio: undefined,
            cestatusgeneral: requestBody.cestatusgeneral ? requestBody.cestatusgeneral: undefined
        }
    }
    if(userData){
        let operationCreateIndividualContract = await bd.createContractBrokerQuery(userData, paymentList).then((res) => res);
        if(operationCreateIndividualContract.error){ console.log(operationCreateIndividualContract.error);return { status: false, code: 500, message: operationCreateIndividualContract.error }; }
    }
    let lastFleetContract = await bd.getLastFleetContract();
    if(lastFleetContract.error){ return { status: false, code: 500, message: lastFleetContract.error }; }
    let lastReceipt = await bd.getLastReceipt(requestBody.xplaca.toUpperCase(), lastFleetContract.ccontratoflota);
    if(lastReceipt.error){ return { status: false, code: 500, message: lastReceipt.error }; }
    let getCharge = await bd.getCharge(lastReceipt.ccarga);
    if(getCharge.error){ return { status: false, code: 500, message: getCharge.error }; }
    return { 
        status: true, 
        code: 200, 
        ccontratoflota: lastFleetContract.ccontratoflota, 
        ccliente: lastFleetContract.ccliente, 
        cpropietario: lastFleetContract.cpropietario, 
        cvehiculopropietario: lastFleetContract.cvehiculopropietario, 
        crecibo: lastReceipt.crecibo, 
        femision: lastReceipt.femision, 
        fdesde_pol: lastReceipt.fdesde_pol, 
        fhasta_pol: lastReceipt.fhasta_pol, 
        fdesde_rec: lastReceipt.fdesde_rec, 
        fhasta_rec: lastReceipt.fhasta_rec, 
        xrecibo: lastReceipt.xrecibo,
        fsuscripcion: getCharge.fsuscripcion
    };
}

router.route('/ubii/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateReceiptPayment(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateReceiptPayment' } });
        });
    }
});

const operationUpdateReceiptPayment = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentData = {
        ccontratoflota: requestBody.paymentData.ccontratoflota,
        orderId: requestBody.paymentData.orderId,
        ctipopago: requestBody.paymentData.ctipopago,
        xreferencia: requestBody.paymentData.xreferencia,
        fcobro: requestBody.paymentData.fcobro,
        mprima_pagada: requestBody.paymentData.mprima_pagada
    }
    let updateReceiptPayment = await bd.updateReceiptPaymentBrokerQuery(paymentData);
    if(updateReceiptPayment.error){ return { status: false, code: 500, message: updateReceiptPayment.error }; }
    if(updateReceiptPayment.result.rowsAffected > 0){ return { status: true }; }
    let updateFleetContractGeneralState = await bd.updateFleetContractGeneralStateQuery(paymentData.ccontratoflota);
    if(updateFleetContractGeneralState.error){ return { status: false, code: 500, message: updateFleetContractGeneralState.error }; }
    if(updateFleetContractGeneralState.result.rowsAffected > 0){ return { status: true }; }
    return { status: true };
}

router.route('/cancellations').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCancellations(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCancellations' } });
        });
    }
})

const operationCancellations = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
    };
    if(requestBody.anulacion){
        let cancellation = {
            ccarga: requestBody.anulacion.ccarga,
            ccausaanulacion: requestBody.anulacion.ccausaanulacion
        }
        let cancellationData = await bd.cancellationDataQuery(searchData, cancellation).then((res) => res);
        if(cancellationData.error){ return { status: false, code: 500, message: cancellationData.error }; }
    }
    return { status: true }; 
}

module.exports = router;