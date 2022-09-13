const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/api/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'club-contract-management', req.body, 'searchSubscriptionApiClubContractManagementSchema');
    if(validateSchema.error){
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchClubContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubContractManagement' } });
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
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'searchSubscriptionProductionClubContractManagementSchema');
    if(validateSchema.error){
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchClubContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubContractManagement' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchClubContractManagement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cpropietario: requestBody.cpropietario ? requestBody.cpropietario : undefined,
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
            xtipodocidentidad: searchClubContractManagement.result.recordset[i].XTIPODOCIDENTIDAD,
            xdocidentidad: helper.decrypt(searchClubContractManagement.result.recordset[i].XDOCIDENTIDAD),
            xemail: helper.decrypt(searchClubContractManagement.result.recordset[i].XEMAIL),
            xdireccion: helper.decrypt(searchClubContractManagement.result.recordset[i].XDIRECCION),
            xtelefonocelular: helper.decrypt(searchClubContractManagement.result.recordset[i].XTELEFONOCELULAR),
            xmarca: searchClubContractManagement.result.recordset[i].XMARCA,
            xmodelo: searchClubContractManagement.result.recordset[i].XMODELO,
            xversion: searchClubContractManagement.result.recordset[i].XVERSION,
            ctipoplan: searchClubContractManagement.result.recordset[i].CTIPOPLAN,
            cplan: searchClubContractManagement.result.recordset[i].CPLAN,
            bactivo: searchClubContractManagement.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/api/search/plate').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'club-contract-management', req.body, 'searchSubscriptionApiClubContractManagementPlateSchema');
    if(validateSchema.error){
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchClubContractManagementByPlate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubContractManagementByPlate' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationSearchClubContractManagementByPlate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xplaca: helper.encrypt(requestBody.xplaca)
    }
    let searchClubContractManagementByPlate = await db.searchClubContractManagementByPlateQuery(searchData).then((res) => res);
    if(searchClubContractManagementByPlate.error){ return { status: false, code: 500, message: searchClubContractManagementByPlate.error }; }
    if(searchClubContractManagementByPlate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Contract Management not found.' }; }
    return { 
        status: true,
        ccontratoclub: searchClubContractManagementByPlate.result.recordset[0].CCONTRATOCLUB,
        cpropietario: searchClubContractManagementByPlate.result.recordset[0].CPROPIETARIO,
        cvehiculopropietario: searchClubContractManagementByPlate.result.recordset[0].CVEHICULOPROPIETARIO,
        xplaca: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XPLACA),
        xnombrepropietario: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XNOMBREPROPIETARIO),
        xapellidopropietario: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XAPELLIDOPROPIETARIO),
        xdocidentidadpropietario: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XDOCIDENTIDADPROPIETARIO),
        xemailpropietario: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XEMAILPROPIETARIO),
        xnombre: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XNOMBRE),
        xapellido: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XAPELLIDO),
        xdocidentidad: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XDOCIDENTIDAD),
        xemail: helper.decrypt(searchClubContractManagementByPlate.result.recordset[0].XEMAIL),
        ctipoplan: searchClubContractManagementByPlate.result.recordset[0].CTIPOPLAN,
        cplan: searchClubContractManagementByPlate.result.recordset[0].CPLAN,
        bactivo: searchClubContractManagementByPlate.result.recordset[0].BACTIVO
    };
}

router.route('/production/search/owner').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'searchSubscriptionApiClubContractManagementOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationSearchClubContractManagementOwner(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubContractManagementOwner' } });
    });
});

const operationSearchClubContractManagementOwner = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido.toUpperCase()) : undefined,
        xemail: requestBody.xemail ? helper.encrypt(requestBody.xemail.toUpperCase()) : undefined
    }
    let searchOwner = await db.searchOwnerQuery(searchData).then((res) => res);
    if(searchOwner.error){ return { status: false, code: 500, message: searchOwner.error }; }
    if(searchOwner.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Owner not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchOwner.result.recordset.length; i++){
        jsonList.push({
            cpropietario: searchOwner.result.recordset[i].CPROPIETARIO,
            xnombre: helper.decrypt(searchOwner.result.recordset[i].XNOMBRE),
            xapellido: helper.decrypt(searchOwner.result.recordset[i].XAPELLIDO),
            xdocidentidad: helper.decrypt(searchOwner.result.recordset[i].XDOCIDENTIDAD),
            bactivo: searchOwner.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/search/owner/vehicle').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'searchSubscriptionApiClubContractManagementOwnerVehicleSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationSearchClubContractManagementOwnerVehicle(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubContractManagementOwnerVehicle' } });
    });
});

const operationSearchClubContractManagementOwnerVehicle = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpropietario: requestBody.cpropietario,
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        cversion: requestBody.cversion ? requestBody.cversion : undefined,
        xplaca: requestBody.xplaca ? helper.encrypt(requestBody.xplaca) : undefined
    }
    let searchOwnerVehicle = await db.searchOwnerVehicleQuery(searchData).then((res) => res);
    if(searchOwnerVehicle.error){ return { status: false, code: 500, message: searchOwnerVehicle.error }; }
    if(searchOwnerVehicle.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Vehicle not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchOwnerVehicle.result.recordset.length; i++){
        jsonList.push({
            cvehiculopropietario: searchOwnerVehicle.result.recordset[i].CVEHICULOPROPIETARIO,
            xmarca: searchOwnerVehicle.result.recordset[i].XMARCA,
            xmodelo: searchOwnerVehicle.result.recordset[i].XMODELO,
            xversion: searchOwnerVehicle.result.recordset[i].XVERSION,
            xplaca: helper.decrypt(searchOwnerVehicle.result.recordset[i].XPLACA),
            xserialcarroceria: helper.decrypt(searchOwnerVehicle.result.recordset[i].XSERIALCARROCERIA),
            xserialmotor: helper.decrypt(searchOwnerVehicle.result.recordset[i].XSERIALMOTOR)
        });
    }
    return { status: true, list: jsonList };
}

router.route('/api/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'club-contract-management', req.body, 'createSubscriptionApiClubContractManagementSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateClubContractManagement(req.header('Authorization'), req.body, 'API').then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateClubContractManagement' } });
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
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'createSubscriptionProductionClubContractManagementSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateClubContractManagement(req.header('Authorization'), req.body, 'PRO').then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateClubContractManagement' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateClubContractManagement = async (authHeader, requestBody, cprocedencia) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let paymentVouchers = [];
    if(requestBody.paymentVouchers){
        paymentVouchers = requestBody.paymentVouchers;
        for(let i = 0; i < paymentVouchers.length; i++){
            paymentVouchers[i].ctransaccion = helper.encrypt(paymentVouchers[i].ctransaccion);
            paymentVouchers[i].creferenciatransaccion = helper.encrypt(paymentVouchers[i].creferenciatransaccion);
        }
    }
    let clubContractManagementData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        paymentVouchers: paymentVouchers ? paymentVouchers : undefined,
        fvencimiento: requestBody.fvencimiento,
        cpropietario: requestBody.cpropietario,
        cvehiculopropietario: requestBody.cvehiculopropietario,
        bpropietario: requestBody.bpropietario,
        xnombre: helper.encrypt(requestBody.xnombre.toUpperCase()),
        xapellido: helper.encrypt(requestBody.xapellido.toUpperCase()),
        cestadocivil: requestBody.cestadocivil,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        fnacimiento: requestBody.fnacimiento,
        xprofesion: requestBody.xprofesion ? helper.encrypt(requestBody.xprofesion.toUpperCase()) : undefined,
        xocupacion: requestBody.xocupacion ? helper.encrypt(requestBody.xocupacion.toUpperCase()) : undefined,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xcontrasena: requestBody.xcontrasena ? helper.encrypt(requestBody.xcontrasena) : undefined,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xtelefonocasa: requestBody.xtelefonocasa ? helper.encrypt(requestBody.xtelefonocasa) : undefined,
        xtelefonocelular: helper.encrypt(requestBody.xtelefonocelular),
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax) : undefined,
        cparentesco: requestBody.cparentesco,
        ctipoplan: requestBody.ctipoplan,
        cplan: requestBody.cplan,
        cmetodologiapago: requestBody.cmetodologiapago,
        csexo: requestBody.csexo,
        xnacionalidad: requestBody.xnacionalidad,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion,
        cprocedencia: cprocedencia
    }
    let verifyClubContractManagementVehicle = await db.verifyClubContractManagementVehicleToCreateQuery(clubContractManagementData).then((res) => res);
    if(verifyClubContractManagementVehicle.error){ return { status: false, code: 500, message: verifyClubContractManagementVehicle.error }; }
    if(verifyClubContractManagementVehicle.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'vehicle-contract-already-exist' }; }
    let createClubContractManagement = await db.createClubContractManagementQuery(clubContractManagementData).then((res) => res);
    if(createClubContractManagement.error){ return { status: false, code: 500, message: createClubContractManagement.error }; }
    if(createClubContractManagement.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClubContractManagement' }; }
    let response = {
        status: true, 
        ccontratoclub: createClubContractManagement.result.recordset[0].CCONTRATOCLUB,
        cusuarioclub: undefined,
        condition: undefined,
        message: undefined
    }
    if(clubContractManagementData.cprocedencia == 'API'){
        let verifyEmailHasAccount = await db.verifyEmailHasAccountQuery(clubContractManagementData.xemail).then((res) => res);
        if(verifyEmailHasAccount.error){ response.condition = 'error-verifing-email-has-club-account' }
        if(verifyEmailHasAccount.result.rowsAffected > 0){ response.condition = 'error-verifing-email-has-club-account' }
        else{
            if(clubContractManagementData.bpropietario){
                let verifyOwnerHasClubAccount = await db.verifyOwnerHasClubAccountQuery(clubContractManagementData).then((res) => res);
                if(verifyOwnerHasClubAccount.error){ 
                    response.condition = 'error-verifing-owner-has-club-account';
                    response.message =  verifyOwnerHasClubAccount.error;
                }else{
                    if(verifyOwnerHasClubAccount.result.rowsAffected > 0){ response.cusuarioclub = verifyOwnerHasClubAccount.result.recordset[0].CUSUARIOCLUB; }
                    else{
                        let createClubAccount = await db.createClubAccountQuery(clubContractManagementData, createClubContractManagement.result.recordset[0].CCONTRATOCLUB, 'PRP').then((res) => res);
                        if(createClubAccount.error){ 
                            response.condition = 'error-creating-owner-club-account'; 
                            response.message =  createClubAccount.error;
                        }else{
                            if(createClubAccount.result.rowsAffected == 0){ 
                                response.condition = 'error-creating-owner-club-account';
                            }
                            else{ response.cusuarioclub = createClubAccount.result.recordset[0].CUSUARIOCLUB; }
                        }
                    }
                }
            }else{
                let verifyDriverHasClubAccount = await db.verifyDriverHasClubAccountQuery(clubContractManagementData).then((res) => res);
                if(verifyDriverHasClubAccount.error){ 
                    response.condition = 'error-verifing-driver-has-club-account';
                    response.message =  verifyDriverHasClubAccount.error;
                }else{
                    if(verifyDriverHasClubAccount.result.rowsAffected > 0){ response.cusuarioclub = verifyDriverHasClubAccount.result.recordset[0].CUSUARIOCLUB; }
                    else{
                        let createClubAccount = await db.createClubAccountQuery(clubContractManagementData, createClubContractManagement.result.recordset[0].CCONTRATOCLUB, 'CND').then((res) => res);
                        if(createClubAccount.error){ 
                            response.condition = 'error-creating-driver-club-account';
                            response.message =  createClubAccount.error;
                        }else{
                            if(createClubAccount.result.rowsAffected == 0){ 
                                response.condition = 'error-creating-driver-club-account'
                            }
                            else{ response.cusuarioclub = createClubAccount.result.recordset[0].CUSUARIOCLUB; }
                        }
                    }
                }
            }
        }
    }
    return response;
}

router.route('/production/detail/owner').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'detailSubscriptionProductionClubContractManagementOwnerSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationDetailClubContractManagementOwner(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClubContractManagementOwner' } });
    });
});

const operationDetailClubContractManagementOwner = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ownerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cpropietario: requestBody.cpropietario
    };
    let getOwnerData = await db.getOwnerDataQuery(ownerData).then((res) => res);
    if(getOwnerData.error){ return { status: false, code: 500, message: getOwnerData.error }; }
    if(getOwnerData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Owner not found.' }; }
    return {
        status: true,
        xnombre: helper.decrypt(getOwnerData.result.recordset[0].XNOMBRE),
        xapellido: helper.decrypt(getOwnerData.result.recordset[0].XAPELLIDO),
        cestadocivil: getOwnerData.result.recordset[0].CESTADOCIVIL,
        fnacimiento: getOwnerData.result.recordset[0].FNACIMIENTO,
        xprofesion: getOwnerData.result.recordset[0].XPROFESION ? helper.decrypt(getOwnerData.result.recordset[0].XPROFESION) : undefined,
        xocupacion: getOwnerData.result.recordset[0].XOCUPACION ? helper.decrypt(getOwnerData.result.recordset[0].XOCUPACION) : undefined,
        ctipodocidentidad: getOwnerData.result.recordset[0].CTIPODOCIDENTIDAD,
        xdocidentidad: helper.decrypt(getOwnerData.result.recordset[0].XDOCIDENTIDAD),
        cestado: getOwnerData.result.recordset[0].CESTADO,
        cciudad: getOwnerData.result.recordset[0].CCIUDAD,
        xdireccion: helper.decrypt(getOwnerData.result.recordset[0].XDIRECCION),
        xemail: helper.decrypt(getOwnerData.result.recordset[0].XEMAIL),
        xtelefonocasa: getOwnerData.result.recordset[0].XTELEFONOCASA ? helper.decrypt(getOwnerData.result.recordset[0].XTELEFONOCASA) : undefined,
        xtelefonocelular: helper.decrypt(getOwnerData.result.recordset[0].XTELEFONOCELULAR),
        xfax: getOwnerData.result.recordset[0].XFAX ? helper.decrypt(getOwnerData.result.recordset[0].XFAX) : undefined,
        cparentesco: getOwnerData.result.recordset[0].CPARENTESCO,
    }
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'detailSubscriptionProductionClubContractManagementSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailClubContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClubContractManagement' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailClubContractManagement = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clubContractManagementData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccontratoclub: requestBody.ccontratoclub
    };
    let getClubContractManagementData = await db.getClubContractManagementDataQuery(clubContractManagementData).then((res) => res);
    if(getClubContractManagementData.error){ return { status: false, code: 500, message: getClubContractManagementData.error }; }
    if(getClubContractManagementData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Contract Management not found.' }; }
    let paymentVouchers = [];
    let getClubContractManagementPaymentVouchersData = await db.getClubContractManagementPaymentVouchersDataQuery(clubContractManagementData.ccontratoclub).then((res) => res);
    if(getClubContractManagementPaymentVouchersData.error){ return { status: false, code: 500, message: getClubContractManagementPaymentVouchersData.error }; }
    if(getClubContractManagementPaymentVouchersData.result.rowsAffected > 0){
        for(let i = 0; i < getClubContractManagementPaymentVouchersData.result.recordset.length; i++){
            let paymentVoucher = {
                ccomprobantepago: getClubContractManagementPaymentVouchersData.result.recordset[i].CCOMPROBANTEPAGO,
                ctransaccion: helper.decrypt(getClubContractManagementPaymentVouchersData.result.recordset[i].CTRANSACCION),
                creferenciatransaccion: helper.decrypt(getClubContractManagementPaymentVouchersData.result.recordset[i].CREFERENCIATRANSACCION),
                cbanco: getClubContractManagementPaymentVouchersData.result.recordset[i].CBANCO,
                xbanco: getClubContractManagementPaymentVouchersData.result.recordset[i].XBANCO
            }
            paymentVouchers.push(paymentVoucher);
        }
    }
    return {
        status: true,
        ccontratoclub: getClubContractManagementData.result.recordset[0].CCONTRATOCLUB,
        cpropietario: getClubContractManagementData.result.recordset[0].CPROPIETARIO,
        xnombrepropietario: helper.decrypt(getClubContractManagementData.result.recordset[0].XNOMBREPROPIETARIO),
        xapellidopropietario: helper.decrypt(getClubContractManagementData.result.recordset[0].XAPELLIDOPROPIETARIO),
        xdocidentidadpropietario: helper.decrypt(getClubContractManagementData.result.recordset[0].XDOCIDENTIDADPROPIETARIO),
        cvehiculopropietario: getClubContractManagementData.result.recordset[0].CVEHICULOPROPIETARIO,
        xplaca: helper.decrypt(getClubContractManagementData.result.recordset[0].XPLACA),
        xmarca: getClubContractManagementData.result.recordset[0].XMARCA,
        xmodelo: getClubContractManagementData.result.recordset[0].XMODELO,
        xversion: getClubContractManagementData.result.recordset[0].XVERSION,
        bpropietario: getClubContractManagementData.result.recordset[0].BPROPIETARIO,
        xnombre: helper.decrypt(getClubContractManagementData.result.recordset[0].XNOMBRE),
        xapellido: helper.decrypt(getClubContractManagementData.result.recordset[0].XAPELLIDO),
        cestadocivil: getClubContractManagementData.result.recordset[0].CESTADOCIVIL,
        fnacimiento: getClubContractManagementData.result.recordset[0].FNACIMIENTO,
        xprofesion: getClubContractManagementData.result.recordset[0].XPROFESION ? helper.decrypt(getClubContractManagementData.result.recordset[0].XPROFESION) : undefined,
        xocupacion: getClubContractManagementData.result.recordset[0].XOCUPACION ? helper.decrypt(getClubContractManagementData.result.recordset[0].XOCUPACION) : undefined,
        ctipodocidentidad: getClubContractManagementData.result.recordset[0].CTIPODOCIDENTIDAD,
        xdocidentidad: helper.decrypt(getClubContractManagementData.result.recordset[0].XDOCIDENTIDAD),
        cestado: getClubContractManagementData.result.recordset[0].CESTADO,
        cciudad: getClubContractManagementData.result.recordset[0].CCIUDAD,
        xdireccion: helper.decrypt(getClubContractManagementData.result.recordset[0].XDIRECCION),
        xemail: helper.decrypt(getClubContractManagementData.result.recordset[0].XEMAIL),
        xtelefonocasa: getClubContractManagementData.result.recordset[0].XTELEFONOCASA ? helper.decrypt(getClubContractManagementData.result.recordset[0].XTELEFONOCASA) : undefined,
        xtelefonocelular: helper.decrypt(getClubContractManagementData.result.recordset[0].XTELEFONOCELULAR),
        xfax: getClubContractManagementData.result.recordset[0].XFAX ? helper.decrypt(getClubContractManagementData.result.recordset[0].XFAX) : undefined,
        cparentesco: getClubContractManagementData.result.recordset[0].CPARENTESCO,
        ctipoplan: getClubContractManagementData.result.recordset[0].CTIPOPLAN,
        cplan: getClubContractManagementData.result.recordset[0].CPLAN,
        cmetodologiapago: getClubContractManagementData.result.recordset[0].CMETODOLOGIAPAGO,
        finicio: getClubContractManagementData.result.recordset[0].FINICIO,
        fvencimiento: getClubContractManagementData.result.recordset[0].FVENCIMIENTO,
        frenovacion: getClubContractManagementData.result.recordset[0].FRENOVACION,
        bactivo: getClubContractManagementData.result.recordset[0].BACTIVO,
        cprocedencia: getClubContractManagementData.result.recordset[0].CPROCEDENCIA,
        paymentVouchers: paymentVouchers
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'club-contract-management', req.body, 'updateSubscriptionProductionClubContractManagementSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateClubContractManagement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateClubContractManagement' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateClubContractManagement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clubContractManagementData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccontratoclub: requestBody.ccontratoclub,
        cpropietario: requestBody.cpropietario,
        fvencimiento: requestBody.fvencimiento,
        frenovacion: requestBody.frenovacion ? requestBody.frenovacion : undefined,
        ctipoplan: requestBody.ctipoplan,
        cplan: requestBody.cplan,
        cmetodologiapago: requestBody.cmetodologiapago,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyClubContractManagementOwner = await db.verifyClubContractManagementOwnerToUpdateQuery(clubContractManagementData).then((res) => res);
    if(verifyClubContractManagementOwner.error){ return { status: false, code: 500, message: verifyClubContractManagementOwner.error }; }
    if(verifyClubContractManagementOwner.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'owner-already-exist' }; }
    let updateClubContractManagement = await db.updateClubContractManagementQuery(clubContractManagementData).then((res) => res);
    if(updateClubContractManagement.error){ return { status: false, code: 500, message: updateClubContractManagement.error }; }
    if(updateClubContractManagement.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Contract Management not found.' }; }
    if(requestBody.paymentVouchers){
        if(requestBody.paymentVouchers.delete && requestBody.paymentVouchers.delete.length > 0){
            let deletePaymentVouchersByClubContractManagementUpdate = await db.deletePaymentVouchersByClubContractManagementUpdateQuery(requestBody.paymentVouchers.delete, clubContractManagementData).then((res) => res);
            if(deletePaymentVouchersByClubContractManagementUpdate.error){ return { status: false, code: 500, message: deletePaymentVouchersByClubContractManagementUpdate.error }; }
            if(deletePaymentVouchersByClubContractManagementUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePaymentVouchersByClubContractManagementUpdate' }; }
        }
        if(requestBody.paymentVouchers.update && requestBody.paymentVouchers.update.length > 0){
            for(let i = 0; i < requestBody.paymentVouchers.update.length; i++){
                requestBody.paymentVouchers.update[i].ctransaccion = helper.encrypt(requestBody.paymentVouchers.update[i].ctransaccion);
                requestBody.paymentVouchers.update[i].creferenciatransaccion = helper.encrypt(requestBody.paymentVouchers.update[i].creferenciatransaccion);
            }
            let updatePaymentVouchersByClubContractManagementUpdate = await db.updatePaymentVouchersByClubContractManagementUpdateQuery(requestBody.paymentVouchers.update, clubContractManagementData).then((res) => res);
            if(updatePaymentVouchersByClubContractManagementUpdate.error){ return { status: false, code: 500, message: updatePaymentVouchersByClubContractManagementUpdate.error }; }
            if(updatePaymentVouchersByClubContractManagementUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Payment Voucher not found.' }; }
        }
        if(requestBody.paymentVouchers.create && requestBody.paymentVouchers.create.length > 0){
            for(let i = 0; i < requestBody.paymentVouchers.create.length; i++){
                requestBody.paymentVouchers.create[i].ctransaccion = helper.encrypt(requestBody.paymentVouchers.create[i].ctransaccion);
                requestBody.paymentVouchers.create[i].creferenciatransaccion = helper.encrypt(requestBody.paymentVouchers.create[i].creferenciatransaccion);
            }
            let createPaymentVouchersByClubContractManagementUpdate = await db.createPaymentVouchersByClubContractManagementUpdateQuery(requestBody.paymentVouchers.create, clubContractManagementData).then((res) => res);
            if(createPaymentVouchersByClubContractManagementUpdate.error){ return { status: false, code: 500, message: createPaymentVouchersByClubContractManagementUpdate.error }; }
            if(createPaymentVouchersByClubContractManagementUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPaymentVouchersByClubContractManagementUpdate' }; }
        }
    }
    return { status: true, ccontratoclub: clubContractManagementData.ccontratoclub }; 
}

module.exports = router;