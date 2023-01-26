const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');
const { valid } = require('joi');
const { updateVehiclesByOwnerUpdateQuery } = require('../../../src/bd');

router.route('/api/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'searchThirdpartiesApiOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'owner', req.body, 'searchThirdpartiesProductionOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchOwner = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? requestBody.xdocidentidad : undefined,
        xnombre: requestBody.xnombre ? requestBody.xnombre.toUpperCase() : undefined,
        xapellido: requestBody.xapellido ? requestBody.xapellido.toUpperCase() : undefined,
        xemail: requestBody.xemail ? requestBody.xemail.toUpperCase() : undefined
    }
    let searchOwner = await db.searchOwnerQuery(searchData).then((res) => res);
    if(searchOwner.error){ return { status: false, code: 500, message: searchOwner.error }; }
    if(searchOwner.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Owner not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchOwner.result.recordset.length; i++){
        jsonList.push({
            cpropietario: searchOwner.result.recordset[i].CPROPIETARIO,
            xnombre: searchOwner.result.recordset[i].XNOMBRE,
            xapellido: searchOwner.result.recordset[i].XAPELLIDO,
            xdocidentidad: searchOwner.result.recordset[i].XDOCIDENTIDAD,
            bactivo: searchOwner.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/api/search/plate').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'searchThirdpartiesApiOwnerPlateSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchOwnerPlate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchOwnerPlate' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationSearchOwnerPlate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        xplaca: requestBody.xplaca
    }
    let searchOwnerPlate = await db.searchOwnerPlateQuery(searchData).then((res) => res);
    if(searchOwnerPlate.error){ return { status: false, code: 500, message: searchOwnerPlate.error }; }
    if(searchOwnerPlate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Plate not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchOwnerPlate.result.recordset.length; i++){
        jsonList.push({
            xplaca: helper.decrypt(searchOwnerPlate.result.recordset[i].XPLACA),
            cmarca: searchOwnerPlate.result.recordset[i].CMARCA,
            xmarca: searchOwnerPlate.result.recordset[i].XMARCA,
            cmodelo: searchOwnerPlate.result.recordset[i].CMODELO,
            xmodelo: searchOwnerPlate.result.recordset[i].XMODELO,
            cversion: searchOwnerPlate.result.recordset[i].CVERSION,
            xversion: searchOwnerPlate.result.recordset[i].XVERSION
        });
    }
    return { status: true, list: jsonList };
}

router.route('/api/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'createThirdpartiesApiOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateOwner(req.header('Authorization'), req.body, 'API').then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateOwner' } });
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
    let validateSchema = helper.validateSchema('production', 'owner', req.body, 'createThirdpartiesProductionOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateOwner(req.header('Authorization'), req.body, 'PRO').then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateOwner = async (authHeader, requestBody, cprocedencia) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let vehicles = [];
    if(requestBody.vehicles){
        vehicles = requestBody.vehicles;
        for(let i = 0; i < vehicles.length; i++){
            vehicles[i].xplaca = vehicles[i].xplaca;
            vehicles[i].xcertificadoorigen = vehicles[i].xcertificadoorigen;
            vehicles[i].xserialcarroceria = vehicles[i].xserialcarroceria;
            vehicles[i].xserialmotor = vehicles[i].xserialmotor;
        }
    }
    let ownerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        documents: requestBody.documents ? requestBody.documents : undefined,
        vehicles: vehicles ? vehicles : undefined,
        xnombre: requestBody.xnombre.toUpperCase(),
        xapellido: requestBody.xapellido.toUpperCase(),
        cestadocivil: requestBody.cestadocivil,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        fnacimiento: requestBody.fnacimiento,
        xprofesion: requestBody.xprofesion ? requestBody.xprofesion.toUpperCase() : undefined,
        xocupacion: requestBody.xocupacion ? requestBody.xocupacion.toUpperCase() : undefined,
        xdocidentidad: requestBody.xdocidentidad,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccion: requestBody.xdireccion.toUpperCase(),
        xemail: requestBody.xemail.toUpperCase(),
        xtelefonocasa: requestBody.xtelefonocasa ? requestBody.xtelefonocasa : undefined,
        xtelefonocelular: requestBody.xtelefonocelular,
        xfax: requestBody.xfax ? requestBody.xfax : undefined,
        cparentesco: requestBody.cparentesco,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion,
        csexo: requestBody.csexo,
        xnacionalidad: requestBody.xnacionalidad,
        cprocedencia: cprocedencia
    }
    if(ownerData.vehicles && ownerData.vehicles.length > 0){
        for(let i = 0; i < ownerData.vehicles.length; i++){
            let verifyVehiclePlate = await db.verifyVehiclePlateToCreateQuery(ownerData.vehicles[i].xplaca, ownerData.cpais).then((res) => res);
            if(verifyVehiclePlate.error){ return { status: false, code: 500, message: verifyVehiclePlate.error }; }
            if(verifyVehiclePlate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-plate-already-exist', xplaca: helper.decrypt(ownerData.vehicles[i].xplaca) }; }
        }
    }
    let verifyOwnerIdentification = await db.verifyOwnerIdentificationToCreateQuery(ownerData).then((res) => res);
    if(verifyOwnerIdentification.error){ return { status: false, code: 500, message: verifyOwnerIdentification.error }; }
    if(verifyOwnerIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    let verifyOwnerEmail = await db.verifyOwnerEmailToCreateQuery(ownerData).then((res) => res);
    if(verifyOwnerEmail.error){ return { status: false, code: 500, message: verifyOwnerEmail.error }; }
    if(verifyOwnerEmail.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'email-already-exist' }; }
    let createOwner = await db.createOwnerQuery(ownerData).then((res) => res);
    if(createOwner.error){ return { status: false, code: 500, message: createOwner.error }; }
    if(createOwner.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createOwner' }; }
    return { status: true, cpropietario: createOwner.result.recordset[0].CPROPIETARIO };
}

router.route('/api/create/vehicle').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'createThirdpartiesApiOwnerVehicleSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateOwnerVehicle(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateOwnerVehicle' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationCreateOwnerVehicle = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ownerVehicleData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cpropietario: requestBody.cpropietario,
        cmarca: requestBody.cmarca,
        cmodelo: requestBody.cmodelo,
        cversion: requestBody.cversion,
        xplaca: requestBody.xplaca,
        fano: requestBody.fano,
        ccolor: requestBody.ccolor,
        nkilometraje: requestBody.nkilometraje,
        bimportado: requestBody.bimportado,
        xcertificadoorigen: requestBody.xcertificadoorigen,
        mpreciovehiculo: requestBody.mpreciovehiculo,
        xserialcarroceria: requestBody.xserialcarroceria,
        xserialmotor: requestBody.xserialmotor,
        cmoneda: requestBody.cmoneda,
        xuso: requestBody.xuso,
        xtipomodelo: requestBody.xtipomodelo,
        ncapacidadcarga: requestBody.ncapacidadcarga,
        ncapacidadpasajeros: requestBody.ncapacidadpasajeros,
        images: requestBody.images,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyVehiclePlate = await db.verifyVehiclePlateToCreateQuery(ownerVehicleData.xplaca, ownerVehicleData.cpais).then((res) => res);
    if(verifyVehiclePlate.error){ return { status: false, code: 500, message: verifyVehiclePlate.error }; }
    if(verifyVehiclePlate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-plate-already-exist', xplaca: helper.decrypt(ownerVehicleData.xplaca) }; }
    let verifyOwnerExist = await db.verifyOwnerExistQuery(ownerVehicleData).then((res) => res);
    if(verifyOwnerExist.error){ return { status: false, code: 500, message: verifyOwnerExist.error }; }
    if(verifyOwnerExist.result.rowsAffected == 0){ return { status: false, code: 200, condition: 'owner-does-not-exist' }; }
    let createOwnerVehicle = await db.createOwnerVehicleQuery(ownerVehicleData).then((res) => res);
    if(createOwnerVehicle.error){ return { status: false, code: 500, message: createOwnerVehicle.error }; }
    if(createOwnerVehicle.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createOwnerVehicle' }; }
    return { status: true, cpropietario: ownerVehicleData.cpropietario, cvehiculopropietario: createOwnerVehicle.result.recordset[0].CVEHICULOPROPIETARIO };
}

router.route('/api/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'detailThirdpartiesApiOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'owner', req.body, 'detailThirdpartiesProductionOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailOwner = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ownerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cpropietario: requestBody.cpropietario
    };
    let getOwnerData = await db.getOwnerDataQuery(ownerData).then((res) => res);
    if(getOwnerData.error){ return { status: false, code: 500, message: getOwnerData.error }; }
    if(getOwnerData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Owner not found.' }; }
    /*let documents = [];
    let getOwnerDocumentsData = await db.getOwnerDocumentsDataQuery(ownerData.cpropietario).then((res) => res);
    if(getOwnerDocumentsData.error){ return { status: false, code: 500, message: getOwnerDocumentsData.error }; }
    if(getOwnerDocumentsData.result.rowsAffected > 0){
        for(let i = 0; i < getOwnerDocumentsData.result.recordset.length; i++){
            let document = {
                cdocumentopropietario: getOwnerDocumentsData.result.recordset[i].CDOCUMENTOPROPIETARIO,
                cdocumento: getOwnerDocumentsData.result.recordset[i].CDOCUMENTO,
                xdocumento: getOwnerDocumentsData.result.recordset[i].XDOCUMENTO,
                xrutaarchivo: getOwnerDocumentsData.result.recordset[i].XRUTAARCHIVO
            }
            documents.push(document);
        }
    }*/
    let vehicles = [];
    let getOwnerVehiclesData = await db.getOwnerVehiclesDataQuery(ownerData.cpropietario).then((res) => res);
    if(getOwnerVehiclesData.error){ return { status: false, code: 500, message: getOwnerVehiclesData.error }; }
    if(getOwnerVehiclesData.result.rowsAffected > 0){
        for(let i = 0; i < getOwnerVehiclesData.result.recordset.length; i++){
            let images = [];
            /*let getImagesVehicleData = await db.getImagesVehicleDataQuery(getOwnerVehiclesData.result.recordset[i].CVEHICULOPROPIETARIO).then((res) => res);
            if(getImagesVehicleData.error){ return { status: false, code: 500, message: getImagesVehicleData.error }; }
            if(getImagesVehicleData.result.rowsAffected > 0){
                for(let i = 0; i < getImagesVehicleData.result.recordset.length; i++){
                    let image = {
                        cimagen: getImagesVehicleData.result.recordset[i].CIMAGEN,
                        ximagen: getImagesVehicleData.result.recordset[i].XIMAGEN,
                        xrutaimagen: getImagesVehicleData.result.recordset[i].XRUTAIMAGEN
                    }
                    images.push(image);
                }
            }*/
            let vehicle = {
                cvehiculopropietario: getOwnerVehiclesData.result.recordset[i].CVEHICULOPROPIETARIO,
                cmarca: getOwnerVehiclesData.result.recordset[i].CMARCA,
                xmarca: getOwnerVehiclesData.result.recordset[i].XMARCA,
                cmodelo: getOwnerVehiclesData.result.recordset[i].CMODELO,
                xmodelo: getOwnerVehiclesData.result.recordset[i].XMODELO,
                cversion: getOwnerVehiclesData.result.recordset[i].CVERSION,
                xversion: getOwnerVehiclesData.result.recordset[i].XVERSION,
                xplaca: getOwnerVehiclesData.result.recordset[i].XPLACA,
                fano: getOwnerVehiclesData.result.recordset[i].FANO,
                ccolor: getOwnerVehiclesData.result.recordset[i].CCOLOR,
                xcolor: getOwnerVehiclesData.result.recordset[i].XCOLOR,
                nkilometraje: getOwnerVehiclesData.result.recordset[i].NKILOMETRAJE,
                bimportado: getOwnerVehiclesData.result.recordset[i].BIMPORTADO,
                xcertificadoorigen: getOwnerVehiclesData.result.recordset[i].XCERTIFICADOORIGEN,
                mpreciovehiculo: getOwnerVehiclesData.result.recordset[i].MPRECIOVEHICULO,
                xserialcarroceria: getOwnerVehiclesData.result.recordset[i].XSERIALCARROCERIA,
                xserialmotor: getOwnerVehiclesData.result.recordset[i].XSERIALMOTOR,
                cmoneda: getOwnerVehiclesData.result.recordset[i].CMONEDA,
                xmoneda: getOwnerVehiclesData.result.recordset[i].xmoneda,
                xuso: getOwnerVehiclesData.result.recordset[i].XUSO,
                ctipovehiculo: getOwnerVehiclesData.result.recordset[i].CTIPOVEHICULO,
                xtipovehiculo: getOwnerVehiclesData.result.recordset[i].XTIPOVEHICULO,
                xclase: getOwnerVehiclesData.result.recordset[i].XCLASE,
                ncapacidadcarga: getOwnerVehiclesData.result.recordset[i].NCAPACIDADCARGA,
                ncapacidadpasajeros: getOwnerVehiclesData.result.recordset[i].NCAPACIDADPASAJEROS,
                xtipo: getOwnerVehiclesData.result.recordset[i].xtipo,
                images: images
            }
            vehicles.push(vehicle);
        }
    }
    return {
        status: true,
        cpropietario: getOwnerData.result.recordset[0].CPROPIETARIO,
        xnombre: getOwnerData.result.recordset[0].XNOMBRE,
        xapellido: getOwnerData.result.recordset[0].XAPELLIDO,
        cestadocivil: getOwnerData.result.recordset[0].CESTADOCIVIL,
        fnacimiento: getOwnerData.result.recordset[0].FNACIMIENTO,
        xprofesion: getOwnerData.result.recordset[0].XPROFESION ? getOwnerData.result.recordset[0].XPROFESION : undefined,
        xocupacion: getOwnerData.result.recordset[0].XOCUPACION ? getOwnerData.result.recordset[0].XOCUPACION : undefined,
        ctipodocidentidad: getOwnerData.result.recordset[0].CTIPODOCIDENTIDAD,
        xdocidentidad: getOwnerData.result.recordset[0].XDOCIDENTIDAD,
        cestado: getOwnerData.result.recordset[0].CESTADO,
        cciudad: getOwnerData.result.recordset[0].CCIUDAD,
        xdireccion: getOwnerData.result.recordset[0].XDIRECCION,
        xemail: getOwnerData.result.recordset[0].XEMAIL,
        xtelefonocasa: getOwnerData.result.recordset[0].XTELEFONOCASA ? getOwnerData.result.recordset[0].XTELEFONOCASA : undefined,
        xtelefonocelular: getOwnerData.result.recordset[0].XTELEFONOCELULAR,
        xfax: getOwnerData.result.recordset[0].XFAX ? getOwnerData.result.recordset[0].XFAX : undefined,
        cparentesco: getOwnerData.result.recordset[0].CPARENTESCO,
        bactivo: getOwnerData.result.recordset[0].BACTIVO,
        cprocedencia: getOwnerData.result.recordset[0].CPROCEDENCIA,
        //documents: documents,
        vehicles: vehicles
    }
}

router.route('/api/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'updateThirdpartiesApiOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'owner', req.body, 'updateThirdpartiesProductionOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateOwner' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateOwner = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ownerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cpropietario: requestBody.cpropietario,
        xnombre: requestBody.xnombre.toUpperCase(),
        xapellido: requestBody.xapellido ? requestBody.xapellido.toUpperCase() : undefined,
        cestadocivil: requestBody.cestadocivil ? requestBody.cestadocivil : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        fnacimiento: requestBody.fnacimiento ? requestBody.fnacimiento : undefined,
        xprofesion: requestBody.xprofesion ? requestBody.xprofesion.toUpperCase() : undefined,
        xocupacion: requestBody.xocupacion ? requestBody.xocupacion.toUpperCase() : undefined,
        xdocidentidad: requestBody.xdocidentidad,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccion: requestBody.xdireccion.toUpperCase(),
        xemail: requestBody.xemail.toUpperCase(),
        xtelefonocasa: requestBody.xtelefonocasa ? requestBody.xtelefonocasa : undefined,
        xtelefonocelular: requestBody.xtelefonocelular,
        xfax: requestBody.xfax ? requestBody.xfax : undefined,
        cparentesco: requestBody.cparentesco ? requestBody.cparentesco : undefined,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    /*if(requestBody.vehicles){
        if(requestBody.vehicles.create && requestBody.vehicles.create.length > 0){
            for(let i = 0; i < requestBody.vehicles.create.length; i++){
                let plate = requestBody.vehicles.create[i].xplaca
                /*let verifyVehiclePlate = await db.verifyVehiclePlateToCreateQuery(plate, ownerData.cpais).then((res) => res);
                if(verifyVehiclePlate.error){ return { status: false, code: 500, message: verifyVehiclePlate.error }; }
                if(verifyVehiclePlate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-plate-already-exist', xplaca: requestBody.vehicles.create[i].xplaca }; }
            }
        }
        if(requestBody.vehicles.update && requestBody.vehicles.update.length > 0){
            for(let i = 0; i < requestBody.vehicles.update.length; i++){
                let plate = requestBody.vehicles.update[i].xplaca
                let verifyData = {
                    xplaca: plate,
                    cvehiculopropietario: requestBody.vehicles.update[i].cvehiculopropietario,
                    cpais: ownerData.cpais
                }
                let verifyVehiclePlate = await db.verifyVehiclePlateToUpdateQuery(verifyData).then((res) => res);
                if(verifyVehiclePlate.error){ return { status: false, code: 500, message: verifyVehiclePlate.error }; }
                if(verifyVehiclePlate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-plate-already-exist', xplaca: requestBody.vehicles.update[i].xplaca }; }
            }
        }
    }*/
    let verifyOwnerIdentification = await db.verifyOwnerIdentificationToUpdateQuery(ownerData).then((res) => res);
    if(verifyOwnerIdentification.error){ console.log(verifyOwnerIdentification.error);return { status: false, code: 500, message: verifyOwnerIdentification.error }; }
    if(verifyOwnerIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    let verifyOwnerEmail = await db.verifyOwnerEmailToUpdateQuery(ownerData).then((res) => res);
    if(verifyOwnerEmail.error){ console.log(verifyOwnerEmail.error); return { status: false, code: 500, message: verifyOwnerEmail.error }; }
    if(verifyOwnerEmail.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'email-already-exist' }; }
    let updateOwner = await db.updateOwnerQuery(ownerData).then((res) => res);
    if(updateOwner.error){ console.log(updateOwner.error); return { status: false, code: 500, message: updateOwner.error }; }
    if(updateOwner.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Owner not found.' }; }
    if(requestBody.documents){
        if(requestBody.documents.delete && requestBody.documents.delete.length > 0){
            let deleteDocumentsByOwnerUpdate = await db.deleteDocumentsByOwnerUpdateQuery(requestBody.documents.delete, ownerData).then((res) => res);
            if(deleteDocumentsByOwnerUpdate.error){ return { status: false, code: 500, message: deleteDocumentsByOwnerUpdate.error }; }
            if(deleteDocumentsByOwnerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteDocumentsByOwnerUpdate' }; }
        }
        if(requestBody.documents.update && requestBody.documents.update.length > 0){
            let updateDocumentsByOwnerUpdate = await db.updateDocumentsByOwnerUpdateQuery(requestBody.documents.update, ownerData).then((res) => res);
            if(updateDocumentsByOwnerUpdate.error){ return { status: false, code: 500, message: updateDocumentsByOwnerUpdate.error }; }
            if(updateDocumentsByOwnerUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Document not found.' }; }
        }
        if(requestBody.documents.create && requestBody.documents.create.length > 0){
            let createDocumentsByOwnerUpdate = await db.createDocumentsByOwnerUpdateQuery(requestBody.documents.create, ownerData).then((res) => res);
            if(createDocumentsByOwnerUpdate.error){ return { status: false, code: 500, message: createDocumentsByOwnerUpdate.error }; }
            if(createDocumentsByOwnerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDocumentsByOwnerUpdate' }; }
        }
    }
    if(requestBody.vehicles){
        if(requestBody.vehicles.delete && requestBody.vehicles.delete.length > 0){
            let deleteVehiclesByOwnerUpdate = await db.deleteVehiclesByOwnerUpdateQuery(requestBody.vehicles.delete, ownerData).then((res) => res);
            if(deleteVehiclesByOwnerUpdate.error){ return { status: false, code: 500, message: deleteVehiclesByOwnerUpdate.error }; }
            if(deleteVehiclesByOwnerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteVehiclesByOwnerUpdate' }; }
        }
        if(requestBody.vehicles.update && requestBody.vehicles.update.length > 0){
            for(let i = 0; i < requestBody.vehicles.update.length; i++){
                requestBody.vehicles.update[i].xplaca = requestBody.vehicles.update[i].xplaca;
                requestBody.vehicles.update[i].xcertificadoorigen = requestBody.vehicles.update[i].xcertificadoorigen;
                requestBody.vehicles.update[i].xserialcarroceria = requestBody.vehicles.update[i].xserialcarroceria;
                requestBody.vehicles.update[i].xserialmotor = requestBody.vehicles.update[i].xserialmotor;
            }
            let updateVehiclesByOwnerUpdate = await db.updateVehiclesByOwnerUpdateQuery(requestBody.vehicles.update, ownerData).then((res) => res);
            if(updateVehiclesByOwnerUpdate.error){ console.log(updateVehiclesByOwnerUpdate.error);return { status: false, code: 500, message: updateVehiclesByOwnerUpdate.error }; }
            if(updateVehiclesByOwnerUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Vehicle not found.' }; }
        }
        if(requestBody.vehicles.create && requestBody.vehicles.create.length > 0){
            for(let i = 0; i < requestBody.vehicles.create.length; i++){
                requestBody.vehicles.create[i].xplaca = requestBody.vehicles.create[i].xplaca;
                requestBody.vehicles.create[i].xcertificadoorigen = requestBody.vehicles.create[i].xcertificadoorigen;
                requestBody.vehicles.create[i].xserialcarroceria = requestBody.vehicles.create[i].xserialcarroceria;
                requestBody.vehicles.create[i].xserialmotor = requestBody.vehicles.create[i].xserialmotor;
            }
            let createVehiclesByOwnerUpdate = await db.createVehiclesByOwnerUpdateQuery(requestBody.vehicles.create, ownerData).then((res) => res);
            if(createVehiclesByOwnerUpdate.error){ return { status: false, code: 500, message: createVehiclesByOwnerUpdate.error }; }
            if(createVehiclesByOwnerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createVehiclesByOwnerUpdate' }; }
        }
    }
    return { status: true, cpropietario: ownerData.cpropietario };
}

router.route('/api/update/vehicle/image').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'owner', req.body, 'updateThirdpartiesApiOwnerVehicleImageSchema');
    if(validateSchema.error){ 
        
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateOwnerVehicleImage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateOwnerVehicleImage' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationUpdateOwnerVehicleImage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ownerVehicleImageData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cpropietario: requestBody.cpropietario,
        cvehiculopropietario: requestBody.cvehiculopropietario,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyOwnerExist = await db.verifyOwnerExistQuery(ownerVehicleImageData).then((res) => res);
    if(verifyOwnerExist.error){ return { status: false, code: 500, message: verifyOwnerExist.error }; }
    if(verifyOwnerExist.result.rowsAffected == 0){ return { status: false, code: 200, condition: 'owner-does-not-exist' }; }
    let verifyOwnerVehicleExist = await db.verifyOwnerVehicleExistQuery(ownerVehicleImageData).then((res) => res);
    if(verifyOwnerVehicleExist.error){ return { status: false, code: 500, message: verifyOwnerVehicleExist.error }; }
    if(verifyOwnerVehicleExist.result.rowsAffected == 0){ return { status: false, code: 200, condition: 'owner-vehicle-does-not-exist' }; }
    if(requestBody.images){
        if(requestBody.images.delete && requestBody.images.delete.length > 0){
            let deleteImagesByOwnerVehicleImageUpdate = await db.deleteImagesByOwnerVehicleImageUpdateQuery(requestBody.images.delete, ownerVehicleImageData).then((res) => res);
            if(deleteImagesByOwnerVehicleImageUpdate.error){ return { status: false, code: 500, message: deleteImagesByOwnerVehicleImageUpdate.error }; }
            if(deleteImagesByOwnerVehicleImageUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteImagesByOwnerVehicleImageUpdate' }; }
        }
        if(requestBody.images.update && requestBody.images.update.length > 0){
            let updateImagesByOwnerVehicleImageUpdate = await db.updateImagesByOwnerVehicleImageUpdateQuery(requestBody.images.update, ownerVehicleImageData).then((res) => res);
            if(updateImagesByOwnerVehicleImageUpdate.error){ return { status: false, code: 500, message: updateImagesByOwnerVehicleImageUpdate.error }; }
            if(updateImagesByOwnerVehicleImageUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Image not found.' }; }
        }
        if(requestBody.images.create && requestBody.images.create.length > 0){
            let createImagesByOwnerVehicleImageUpdate = await db.createImagesByOwnerVehicleImageUpdateQuery(requestBody.images.create, ownerVehicleImageData).then((res) => res);
            if(createImagesByOwnerVehicleImageUpdate.error){ return { status: false, code: 500, message: createImagesByOwnerVehicleImageUpdate.error }; }
            if(createImagesByOwnerVehicleImageUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createImagesByOwnerVehicleImageUpdate' }; }
        }
    }
    return { status: true, cpropietario: ownerVehicleImageData.cpropietario, cvehiculopropietario: ownerVehicleImageData.cvehiculopropietario };
}

module.exports = router;