const router = require('express').Router();
const helper = require('../../../helpers/helper');
const mailer = require('../../../helpers/mailer');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'service-request', req.body, 'searchEventsProductionServiceRequestSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchServiceRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceRequest' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationSearchServiceRequest = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido) : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        isolicitante: requestBody.isolicitante ? requestBody.isolicitante : undefined,
    }
    let searchServiceRequest = await db.searchServiceRequestQuery(searchData).then((res) => res);
    if(searchServiceRequest.error){ return { status: false, code: 500, message: searchServiceRequest.error }; }
    if(searchServiceRequest.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Service Request not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchServiceRequest.result.recordset.length; i++){
        jsonList.push({
            csolicitudservicio: searchServiceRequest.result.recordset[i].CSOLICITUDSERVICIO,
            xnombre: helper.decrypt(searchServiceRequest.result.recordset[0].XNOMBRE),
            xapellido: helper.decrypt(searchServiceRequest.result.recordset[i].XAPELLIDO),
            xdocidentidad: helper.decrypt(searchServiceRequest.result.recordset[i].XDOCIDENTIDAD),
            xtiposervicio: searchServiceRequest.result.recordset[i].XTIPOSERVICIO,
            xservicio: searchServiceRequest.result.recordset[i].XSERVICIO,
            xproveedor: helper.decrypt(searchServiceRequest.result.recordset[i].XPROVEEDOR),
            bactivo: searchServiceRequest.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/search/club-contract-management').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'service-request', req.body, 'searchEventsProductionServiceRequestClubContractManagementSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchServiceRequestClubContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceRequestClubContractManagement' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchServiceRequestClubContractManagement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido.toUpperCase()) : undefined
    }
    let searchClubContractManagement = await db.searchClubContractManagementQuery(searchData).then((res) => res);
    if(searchClubContractManagement.error){ return { status: false, code: 500, message: searchClubContractManagement.error }; }
    if(searchClubContractManagement.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Contract Management not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchClubContractManagement.result.recordset.length; i++){
        jsonList.push({
            ccontratoclub: searchClubContractManagement.result.recordset[i].CCONTRATOCLUB,
            cpropietario: searchClubContractManagement.result.recordset[i].CPROPIETARIO,
            cvehiculopropietario: searchClubContractManagement.result.recordset[i].CVEHICULOPROPIETARIO,
            xplaca: helper.decrypt(searchClubContractManagement.result.recordset[i].XPLACA),
            xnombrepropietario: helper.decrypt(searchClubContractManagement.result.recordset[i].XNOMBREPROPIETARIO),
            xapellidopropietario: helper.decrypt(searchClubContractManagement.result.recordset[i].XAPELLIDOPROPIETARIO),
            xdocidentidadpropietario: helper.decrypt(searchClubContractManagement.result.recordset[i].XDOCIDENTIDADPROPIETARIO),
            xemailpropietario: helper.decrypt(searchClubContractManagement.result.recordset[i].XEMAILPROPIETARIO),
            xnombre: helper.decrypt(searchClubContractManagement.result.recordset[i].XNOMBRE),
            xapellido: helper.decrypt(searchClubContractManagement.result.recordset[i].XAPELLIDO),
            xdocidentidad: helper.decrypt(searchClubContractManagement.result.recordset[i].XDOCIDENTIDAD),
            xemail: helper.decrypt(searchClubContractManagement.result.recordset[i].XEMAIL),
            ctipoplan: searchClubContractManagement.result.recordset[i].CTIPOPLAN,
            cplan: searchClubContractManagement.result.recordset[i].CPLAN,
            bactivo: searchClubContractManagement.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/api/search/provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'service-request', req.body, 'searchEventsApiServiceRequestProviderSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchServiceRequestProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceRequestProvider' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/search/provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'service-request', req.body, 'searchEventsProductionServiceRequestProviderSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchServiceRequestProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceRequestProvider' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchServiceRequestProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        ctiposervicio: requestBody.ctiposervicio,
        cservicio: requestBody.cservicio
    }
    let searchServiceRequestProvider = await db.searchServiceRequestProviderQuery(searchData).then((res) => res);
    if(searchServiceRequestProvider.error){ return { status: false, code: 500, message: searchServiceRequestProvider.error }; }
    if(searchServiceRequestProvider.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Service Request Provider not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchServiceRequestProvider.result.recordset.length; i++){
        jsonList.push({
            cproveedor: searchServiceRequestProvider.result.recordset[i].CPROVEEDOR,
            xproveedor: helper.decrypt(searchServiceRequestProvider.result.recordset[i].XPROVEEDOR),
            xrazonsocial: helper.decrypt(searchServiceRequestProvider.result.recordset[i].XRAZONSOCIAL),
            xemail: helper.decrypt(searchServiceRequestProvider.result.recordset[i].XEMAIL),
            xestado: searchServiceRequestProvider.result.recordset[i].XESTADO,
            xciudad: searchServiceRequestProvider.result.recordset[i].XCIUDAD,
            xdireccion: helper.decrypt(searchServiceRequestProvider.result.recordset[i].XDIRECCION),
            bactivo: searchServiceRequestProvider.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/api/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'service-request', req.body, 'createEventsApiServiceRequestSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateServiceRequest(req.header('Authorization'), req.body, 'API').then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateServiceRequest' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'service-request', req.body, 'createEventsProductionServiceRequestSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateServiceRequest(req.header('Authorization'), req.body, 'PRO').then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateServiceRequest' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateServiceRequest = async (authHeader, requestBody, cprocedencia) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let serviceRequestData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        fgestion: requestBody.fgestion ? requestBody.fgestion : undefined,
        isolicitante: requestBody.isolicitante,
        ccontratoclub: requestBody.ccontratoclub,
        cproveedor: requestBody.cproveedor,
        ctiposervicio: requestBody.ctiposervicio,
        cservicio: requestBody.cservicio,
        bcubierto: true,
        bactivo: true,
        ctiposeguimiento: requestBody.ctiposeguimiento ? requestBody.ctiposeguimiento : undefined,
        cmotivoseguimiento: requestBody.cmotivoseguimiento ? requestBody.cmotivoseguimiento : undefined,
        fseguimientosolicitudservicio: requestBody.fseguimientosolicitudservicio ? requestBody.fseguimientosolicitudservicio : undefined,
        cusuariocreacion: requestBody.cusuariocreacion,
        cprocedencia: cprocedencia,
        ilenguaje: requestBody.ilenguaje ? requestBody.ilenguaje.toUpperCase() : undefined
    }
    let getClubContractManagementData = await db.getClubContractManagementDataQuery(serviceRequestData).then((res) => res);
    if(getClubContractManagementData.error){ return { status: false, code: 500, message: getClubContractManagementData.error }; }
    if(getClubContractManagementData.result.rowsAffected == 0){ return { status: false, code: 200, condition: 'club-contract-management-not-found' }; }
    if(!getClubContractManagementData.result.recordset[0].BACTIVO){ return { status: false, code: 200, condition: 'club-contract-management-not-active' }; }
    let getRequestedServiceData = await db.getRequestedServiceDataQuery(serviceRequestData, getClubContractManagementData.result.recordset[0].CPLAN).then((res) => res);
    if(getRequestedServiceData.error){ return { status: false, code: 500, message: getRequestedServiceData.error }; }
    if(getRequestedServiceData.result.rowsAffected == 0){ return { status: false, code: 200, condition: 'service-not-found' }; }
    let serviceCoverQuantity = getRequestedServiceData.result.recordset[0].NCANTIDAD;
    let getServiceRequestQuantity = await db.getServiceRequestQuantityQuery(serviceRequestData).then((res) => res);
    if(getServiceRequestQuantity.error){ return { status: false, code: 500, message: getServiceRequestQuantity.error }; }
    if(getServiceRequestQuantity.result.rowsAffected >= serviceCoverQuantity){ serviceRequestData.bcubierto = false; }
    let createServiceRequest = await db.createServiceRequestQuery(serviceRequestData).then((res) => res);
    if(createServiceRequest.error){ return { status: false, code: 500, message: createServiceRequest.error }; }
    if(createServiceRequest.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClubContractManagement' }; }
    if(serviceRequestData.cprocedencia == 'API'){
        let getServiceRequestData = await db.getServiceRequestDataQuery({ cpais: serviceRequestData.cpais, ccompania: serviceRequestData.ccompania, csolicitudservicio: createServiceRequest.result.recordset[0].CSOLICITUDSERVICIO }).then((res) => res);
        if(getServiceRequestData.error){ console.log(getServiceRequestData.error); }
        if(getServiceRequestData.result.rowsAffected > 0){
            let emailAlertData = {
                xcorreo: 'SOLICITUD-DE-SERVICIO-RECIBIDA',
                ilenguaje: serviceRequestData.ilenguaje,
                cpais: serviceRequestData.cpais,
                ccompania: serviceRequestData.ccompania,
                params: {
                    "<--SERVICE_REQUEST_CODE-->": createServiceRequest.result.recordset[0].CSOLICITUDSERVICIO,
                    "<--IDENTIFICATION_DOCUMENT_TYPE-->": getServiceRequestData.result.recordset[0].XTIPODOCIDENTIDAD,
                    "<--IDENTIFICATION_DOCUMENT-->": helper.decrypt(getServiceRequestData.result.recordset[0].XDOCIDENTIDAD),
                    "<--NAME-->": helper.decrypt(getServiceRequestData.result.recordset[0].XNOMBRE),
                    "<--LASTNAME-->": helper.decrypt(getServiceRequestData.result.recordset[0].XAPELLIDO)
                }
            };
            operationSendEmailAlert(emailAlertData);
        }
    }
    return { status: true, csolicitudservicio: createServiceRequest.result.recordset[0].CSOLICITUDSERVICIO, bcubierto: serviceRequestData.bcubierto };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'service-request', req.body, 'detailEventsProductionServiceRequestSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailServiceRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailServiceRequest' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailServiceRequest = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let serviceRequestData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        csolicitudservicio: requestBody.csolicitudservicio
    };
    let getServiceRequestData = await db.getServiceRequestDataQuery(serviceRequestData).then((res) => res);
    if(getServiceRequestData.error){ return { status: false, code: 500, message: getServiceRequestData.error }; }
    if(getServiceRequestData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Service Request not found.' }; }
    let tracings = [];
    let getServiceRequestTracingsData = await db.getServiceRequestTracingsDataQuery(serviceRequestData.csolicitudservicio).then((res) => res);
    if(getServiceRequestTracingsData.error){ return { status: false, code: 500, message: getServiceRequestTracingsData.error }; }
    if(getServiceRequestTracingsData.result.rowsAffected > 0){
        for(let i = 0; i < getServiceRequestTracingsData.result.recordset.length; i++){
            let tracing = {
                cseguimientosolicitudservicio: getServiceRequestTracingsData.result.recordset[i].CSEGUIMIENTOSOLICITUDSERVICIO,
                ctiposeguimiento: getServiceRequestTracingsData.result.recordset[i].CTIPOSEGUIMIENTO,
                xtiposeguimiento: getServiceRequestTracingsData.result.recordset[i].XTIPOSEGUIMIENTO,
                cmotivoseguimiento: getServiceRequestTracingsData.result.recordset[i].CMOTIVOSEGUIMIENTO,
                xmotivoseguimiento: getServiceRequestTracingsData.result.recordset[i].XMOTIVOSEGUIMIENTO,
                fseguimientosolicitudservicio: getServiceRequestTracingsData.result.recordset[i].FSEGUIMIENTOSOLICITUDSERVICIO,
                bcerrado: getServiceRequestTracingsData.result.recordset[i].BCERRADO,
                xobservacion: getServiceRequestTracingsData.result.recordset[i].XOBSERVACION ? helper.decrypt(getServiceRequestTracingsData.result.recordset[i].XOBSERVACION) : undefined
            }
            tracings.push(tracing);
        }
    }
    return {
        status: true,
        csolicitudservicio: getServiceRequestData.result.recordset[0].CSOLICITUDSERVICIO,
        isolicitante: getServiceRequestData.result.recordset[0].ISOLICITANTE,
        fgestion: getServiceRequestData.result.recordset[0].FGESTION,
        fcreacion: getServiceRequestData.result.recordset[0].FCREACION,
        bcubierto: getServiceRequestData.result.recordset[0].BCUBIERTO,
        bactivo: getServiceRequestData.result.recordset[0].BACTIVO,
        cprocedencia: getServiceRequestData.result.recordset[0].CPROCEDENCIA,
        ccontratoclub: getServiceRequestData.result.recordset[0].CCONTRATOCLUB,
        cplan: getServiceRequestData.result.recordset[0].CPLAN,
        xnombre: helper.decrypt(getServiceRequestData.result.recordset[0].XNOMBRE),
        xapellido: helper.decrypt(getServiceRequestData.result.recordset[0].XAPELLIDO),
        xdocidentidad: helper.decrypt(getServiceRequestData.result.recordset[0].XDOCIDENTIDAD),
        xplaca: helper.decrypt(getServiceRequestData.result.recordset[0].XPLACA),
        ctiposervicio: getServiceRequestData.result.recordset[0].CTIPOSERVICIO,
        cservicio: getServiceRequestData.result.recordset[0].CSERVICIO,
        cproveedor: getServiceRequestData.result.recordset[0].CPROVEEDOR,
        xproveedor: helper.decrypt(getServiceRequestData.result.recordset[0].XPROVEEDOR),
        xrazonsocial: helper.decrypt(getServiceRequestData.result.recordset[0].XRAZONSOCIAL),
        xestado: getServiceRequestData.result.recordset[0].XESTADO,
        xciudad: getServiceRequestData.result.recordset[0].XCIUDAD,
        xdireccion: helper.decrypt(getServiceRequestData.result.recordset[0].XDIRECCION),
        tracings: tracings
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'service-request', req.body, 'updateEventsProductionServiceRequestSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateServiceRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateServiceRequest' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateServiceRequest = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let serviceRequestData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        csolicitudservicio: requestBody.csolicitudservicio,
        fgestion: requestBody.fgestion ? requestBody.fgestion : undefined,
        ccontratoclub: requestBody.ccontratoclub,
        cproveedor: requestBody.cproveedor,
        ctiposervicio: requestBody.ctiposervicio,
        cservicio: requestBody.cservicio,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let updateServiceRequest = await db.updateServiceRequestQuery(serviceRequestData).then((res) => res);
    if(updateServiceRequest.error){ return { status: false, code: 500, message: updateServiceRequest.error }; }
    if(updateServiceRequest.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Service Request Not Found.' }; }
    if(requestBody.tracings){
        if(requestBody.tracings.update && requestBody.tracings.update.length > 0){
            for(let i = 0; i < requestBody.tracings.update.length; i++){
                requestBody.tracings.update[i].xobservacion ? requestBody.tracings.update[i].xobservacion = helper.encrypt(requestBody.tracings.update[i].xobservacion.toUpperCase()) : undefined;
            }
            let updateTracingsByServiceRequestUpdate = await db.updateTracingsByServiceRequestUpdateQuery(requestBody.tracings.update, serviceRequestData).then((res) => res);
            if(updateTracingsByServiceRequestUpdate.error){ return { status: false, code: 500, message: updateTracingsByServiceRequestUpdate.error }; }
            if(updateTracingsByServiceRequestUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Tracing not found.' }; }
        }
        if(requestBody.tracings.create && requestBody.tracings.create.length > 0){
            let closeTracingsByServiceRequestUpdate = await db.closeTracingsByServiceRequestUpdateQuery(serviceRequestData).then((res) => res);
            if(closeTracingsByServiceRequestUpdate.error){ return { status: false, code: 500, message: closeTracingsByServiceRequestUpdate.error }; }
            let createTracingsByServiceRequestUpdate = await db.createTracingsByServiceRequestUpdateQuery(requestBody.tracings.create, serviceRequestData).then((res) => res);
            if(createTracingsByServiceRequestUpdate.error){ return { status: false, code: 500, message: createTracingsByServiceRequestUpdate.error }; }
            if(createTracingsByServiceRequestUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTracingsByServiceRequestUpdate' }; }
        }
    }
    return { status: true, csolicitudservicio: serviceRequestData.csolicitudservicio };
}

const operationSendEmailAlert = async(operationData) => {
    let getEmailAlertData = await db.getEmailAlertOperationDataQuery(operationData).then((res) => res);
    if(getEmailAlertData.error){ return console.log(getEmailAlertData.error); }
    if(getEmailAlertData.result.rowsAffected == 0){ return console.log('Email Alert Not Found'); }
    let getUserEmailsData = await db.getUserEmailsDataQuery(getEmailAlertData.result.recordset[0].CCORREO).then((res) => res);
    if(getUserEmailsData.error){ return console.log(getUserEmailsData.error); }
    if(getUserEmailsData.result.rowsAffected == 0){ return console.log('User Emails Not Found'); }
    let emails = [];
    for(let i = 0; i < getUserEmailsData.result.recordset.length; i++){
        emails.push(helper.decrypt(getUserEmailsData.result.recordset[i].XEMAIL));
    }
    let keysArray = Object.keys(operationData.params);
    let body = getEmailAlertData.result.recordset[0].XHTML;
    let subject = getEmailAlertData.result.recordset[0].XASUNTO;
    for(var i = 0; i < keysArray.length; i++){
        subject = subject.replace(new RegExp(keysArray[i], "gi"), operationData.params[keysArray[i]]);
        body = body.replace(new RegExp(keysArray[i], "gi"), operationData.params[keysArray[i]]);
    }
    mailer.sendEmail({ to: emails, subject: subject, body: body });
    return;
}

module.exports = router;