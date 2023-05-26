const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    /*let validateSchema = helper.validateSchema('production', 'provider', req.body, 'searchProvidersProductionProviderSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }*/
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchProvider' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        xnombre: requestBody.xnombre ? requestBody.xnombre.toUpperCase() : undefined,
        xdocidentidad: requestBody.xdocidentidad ? requestBody.xdocidentidad.toUpperCase() : undefined
    };
    let searchProvider = await db.searchProviderQuery(searchData).then((res) => res);
    if(searchProvider.error){ return  { status: false, code: 500, message: searchProvider.error }; }
    if(searchProvider.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Provider not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchProvider.result.recordset.length; i++){
        jsonList.push({
            cproveedor: searchProvider.result.recordset[i].CPROVEEDOR,
            xnombre: searchProvider.result.recordset[i].XNOMBRE,
            xdocidentidad: searchProvider.result.recordset[i].XDOCIDENTIDAD,
            bactivo: searchProvider.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    // }
    // let validateSchema = helper.validateSchema('production', 'provider', req.body, 'createProvidersProductionProviderSchema');
    // if(validateSchema.error){ 
    //     res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
    //     return;
    // }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateProvider' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let banks = [];
    if(requestBody.banks){
        banks = requestBody.banks;
        for(let i = 0; i < banks.length; i++){
            banks[i].xnumerocuenta = banks[i].xnumerocuenta;
        }
    }
    let contacts = [];
    if(requestBody.contacts){
        contacts = requestBody.contacts;
        for(let i = 0; i < contacts.length; i++){
            contacts[i].xnombre = contacts[i].xnombre.toUpperCase();
            contacts[i].xapellido = contacts[i].xapellido.toUpperCase();
            contacts[i].xdocidentidad = contacts[i].xdocidentidad;
            contacts[i].xtelefonocelular = contacts[i].xtelefonocelular;
            contacts[i].xemail = contacts[i].xemail.toUpperCase();
            contacts[i].xcargo ? contacts[i].xcargo = contacts[i].xcargo.toUpperCase() : false;
            contacts[i].xfax ? contacts[i].xfax = contacts[i].xfax.toUpperCase() : false;
            contacts[i].xtelefonooficina ? contacts[i].xtelefonooficina = contacts[i].xtelefonooficina : false;
            contacts[i].xtelefonocasa ? contacts[i].xtelefonocasa = contacts[i].xtelefonocasa : false;
        }
    }
    let providerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        banks: banks ? banks : undefined,
        contacts: contacts ? contacts : undefined,
        states: requestBody.states ? requestBody.states : undefined,
        brands: requestBody.brands ? requestBody.brands : undefined,
        services: requestBody.services ? requestBody.services : undefined,
        xnombre: requestBody.xnombre.toUpperCase(),
        xdocidentidad: requestBody.xdocidentidad,
        xrazonsocial: requestBody.xrazonsocial.toUpperCase(),
        xtelefono: requestBody.xtelefono,
        xcorreo: requestBody.xcorreo ? requestBody.xcorreo.toUpperCase() : undefined,
        xdireccion: requestBody.xdireccion.toUpperCase(),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        pretencion: requestBody.pretencion ? requestBody.pretencion : undefined,
        centeimpuesto: requestBody.centeimpuesto,
        nlimite: requestBody.nlimite,
        xobservacion: requestBody.xobservacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        pislr: requestBody.pislr,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyProviderIdentification = await db.verifyProviderIdentificationToCreateQuery(providerData).then((res) => res);
    if(verifyProviderIdentification.error){ return { status: false, code: 500, message: verifyProviderIdentification.error }; }
    if(verifyProviderIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    let createProvider = await db.createProviderQuery(providerData).then((res) => res);
    if(createProvider.error){ return { status: false, code: 500, message: createProvider.error }; }
    if(createProvider.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createProvider' }; }
    return { status: true, cproveedor: createProvider.result.recordset[0].CPROVEEDOR };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'provider', req.body, 'detailProvidersProductionProviderSchema');
    if(validateSchema.error){ 
        res.status(401).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailProvider' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

router.route('/api/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'provider', req.body, 'detailProvidersApiProviderSchema');
    if(validateSchema.error){ 
        res.status(401).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailProvider' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationDetailProvider = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let providerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cproveedor: requestBody.cproveedor
    };
    let getProviderData = await db.getProviderDataQuery(providerData).then((res) => res);
    if(getProviderData.error){ return { status: false, code: 500, message: getProviderData.error }; }
    if(getProviderData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Provider not found.' }; }
    let banks = [];
    let getProviderBanksData = await db.getProviderBanksDataQuery(providerData.cproveedor).then((res) => res);
    if(getProviderBanksData.error){ return { status: false, code: 500, message: getProviderBanksData.error }; }
    if(getProviderBanksData.result.rowsAffected > 0){
        for(let i = 0; i < getProviderBanksData.result.recordset.length; i++){
            let bank = {
                cbanco: getProviderBanksData.result.recordset[i].CBANCO,
                xbanco: getProviderBanksData.result.recordset[i].XBANCO,
                ctipocuentabancaria: getProviderBanksData.result.recordset[i].CTIPOCUENTABANCARIA,
                xtipocuentabancaria: getProviderBanksData.result.recordset[i].XTIPOCUENTABANCARIA,
                xnumerocuenta: getProviderBanksData.result.recordset[i].XNUMEROCUENTA,
                bprincipal: getProviderBanksData.result.recordset[i].BPRINCIPAL,
            }
            banks.push(bank);
        }
    }
    let states = [];
    let getProviderStatesData = await db.getProviderStatesDataQuery(providerData.cproveedor).then((res) => res);
    if(getProviderStatesData.error){ return { status: false, code: 500, message: getProviderStatesData.error }; }
    if(getProviderStatesData.result.rowsAffected > 0){
        for(let i = 0; i < getProviderStatesData.result.recordset.length; i++){
            let state = {
                cestado: getProviderStatesData.result.recordset[i].CESTADO,
                xestado: getProviderStatesData.result.recordset[i].XESTADO,
                xpais: getProviderStatesData.result.recordset[i].XPAIS
            }
            states.push(state);
        }
    }
    let brands = [];
    let getProviderBrandsData = await db.getProviderBrandsDataQuery(providerData.cproveedor).then((res) => res);
    if(getProviderBrandsData.error){ return { status: false, code: 500, message: getProviderBrandsData.error }; }
    if(getProviderBrandsData.result.rowsAffected > 0){
        for(let i = 0; i < getProviderBrandsData.result.recordset.length; i++){
            let brand = {
                cmarca: getProviderBrandsData.result.recordset[i].CMARCA,
                xmarca: getProviderBrandsData.result.recordset[i].XMARCA
            }
            brands.push(brand);
        }
    }
    let services = [];
    let getProviderServicesData = await db.getProviderServicesDataQuery(providerData.cproveedor).then((res) => res);
    if(getProviderServicesData.error){ return { status: false, code: 500, message: getProviderServicesData.error }; }
    if(getProviderServicesData.result.rowsAffected > 0){
        for(let i = 0; i < getProviderServicesData.result.recordset.length; i++){
            let service = {
                cservicio: getProviderServicesData.result.recordset[i].CSERVICIO,
                xservicio: getProviderServicesData.result.recordset[i].XSERVICIO,
                ctiposervicio: getProviderServicesData.result.recordset[i].CTIPOSERVICIO,
                xtiposervicio: getProviderServicesData.result.recordset[i].XTIPOSERVICIO
            }
            services.push(service);
        }
    }
    let documents = [];
    let getProviderDocumentData = await db.getProviderDocumentsDataQuery(providerData.cproveedor).then((res) => res);
    if(getProviderDocumentData.error){ return { status: false, code: 500, message: getProviderDocumentData.error }; }
    if(getProviderDocumentData.result.rowsAffected > 0){
        for(let i = 0; i < getProviderDocumentData.result.recordset.length; i++){
            let document = {
                id: getProviderDocumentData.result.recordset[i].ID,
                xobservacion: getProviderDocumentData.result.recordset[i].XOBSERVACION,
                xruta: getProviderDocumentData.result.recordset[i].XRUTA,
            }
            documents.push(document);
        }
    }
    let contacts = [];
    let getProviderContactsData = await db.getProviderContactsDataQuery(providerData.cproveedor).then((res) => res);
    if(getProviderContactsData.error){ return { status: false, code: 500, message: getProviderContactsData.error }; }
    if(getProviderContactsData.result.rowsAffected > 0){
        for(let i = 0; i < getProviderContactsData.result.recordset.length; i++){
            let contact = {
                ccontacto: getProviderContactsData.result.recordset[i].CCONTACTO,
                xnombre: getProviderContactsData.result.recordset[i].XNOMBRE,
                xapellido: getProviderContactsData.result.recordset[i].XAPELLIDO,
                ctipodocidentidad: getProviderContactsData.result.recordset[i].CTIPODOCIDENTIDAD,
                xdocidentidad: getProviderContactsData.result.recordset[i].XDOCIDENTIDAD,
                xtelefonocelular: getProviderContactsData.result.recordset[i].XTELEFONOCELULAR,
                xemail: getProviderContactsData.result.recordset[i].XEMAIL,
                xcargo: getProviderContactsData.result.recordset[i].XCARGO ? getProviderContactsData.result.recordset[i].XCARGO : undefined,
                xtelefonocasa: getProviderContactsData.result.recordset[i].XTELEFONOCASA ? getProviderContactsData.result.recordset[i].XTELEFONOCASA : undefined,
                xtelefonooficina: getProviderContactsData.result.recordset[i].XTELEFONOOFICINA ? getProviderContactsData.result.recordset[i].XTELEFONOOFICINA : undefined,
                xfax: getProviderContactsData.result.recordset[i].XFAX ? getProviderContactsData.result.recordset[i].XFAX : undefined,
            }
            contacts.push(contact);
        }
    }
    return {
        status: true,
        cproveedor: getProviderData.result.recordset[0].CPROVEEDOR,
        xnombre: getProviderData.result.recordset[0].XNOMBRE,
        xdocidentidad: getProviderData.result.recordset[0].XDOCIDENTIDAD,
        xrazonsocial: getProviderData.result.recordset[0].XRAZONSOCIAL,
        cestado: getProviderData.result.recordset[0].CESTADO,
        cciudad: getProviderData.result.recordset[0].CCIUDAD,
        xdireccion: getProviderData.result.recordset[0].XDIRECCION,
        xtelefono: getProviderData.result.recordset[0].XTELEFONO,
        pretencion: getProviderData.result.recordset[0].PRETENCION ? getProviderData.result.recordset[0].PRETENCION : undefined,
        pislr: getProviderData.result.recordset[0].PISLR ? getProviderData.result.recordset[0].PISLR : undefined,
        centeimpuesto: getProviderData.result.recordset[0].CENTEIMPUESTO,
        nlimite: getProviderData.result.recordset[0].NLIMITE,
        xcorreo: getProviderData.result.recordset[0].XCORREO ? getProviderData.result.recordset[0].XCORREO : undefined,
        xobservacion: getProviderData.result.recordset[0].XOBSERVACION,
        bactivo: getProviderData.result.recordset[0].BACTIVO,
        banks: banks,
        states: states,
        brands: brands,
        services: services,
        documents: documents,
        contacts: contacts
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationUpdateProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateProvider' } });
        });
    }
});

const operationUpdateProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let providerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cproveedor: requestBody.cproveedor,
        xnombre: requestBody.xnombre ? requestBody.xnombre.toUpperCase() : undefined,
        xdocidentidad: requestBody.xdocidentidad,
        xrazonsocial: requestBody.xrazonsocial ? requestBody.xrazonsocial.toUpperCase() : undefined,
        xtelefono: requestBody.xtelefono,
        xcorreo: requestBody.xcorreo ? requestBody.xcorreo.toUpperCase() : undefined,
        xdireccion: requestBody.xdireccion ? requestBody.xdireccion.toUpperCase() : undefined,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        pretencion: requestBody.pretencion ? requestBody.pretencion : undefined,
        pislr: requestBody.pislr ? requestBody.pislr : undefined,
        centeimpuesto: requestBody.centeimpuesto,
        nlimite: requestBody.nlimite,
        xobservacion: requestBody.xobservacion ? requestBody.xobservacion.toUpperCase() : undefined,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion,
    }
    let verifyProviderIdentification = await db.verifyProviderIdentificationToUpdateQuery(providerData).then((res) => res);
    if(verifyProviderIdentification.error){ return { status: false, code: 500, message: verifyProviderIdentification.error }; }
    if(verifyProviderIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    let updateProvider = await db.updateProviderQuery(providerData).then((res) => res);
    if(updateProvider.error){ return { status: false, code: 500, message: updateProvider.error }; }
    if(updateProvider.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Provider not found.' }; }
    if(requestBody.banks){
        if(requestBody.banks.delete && requestBody.banks.delete.length > 0){
            let deleteBanksByProviderUpdate = await db.deleteBanksByProviderUpdateQuery(requestBody.banks.delete, providerData).then((res) => res);
            if(deleteBanksByProviderUpdate.error){ return { status: false, code: 500, message: deleteBanksByProviderUpdate.error }; }
            if(deleteBanksByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteBanksByProviderUpdate' }; }
        }
        if(requestBody.banks.update && requestBody.banks.update.length > 0){
            let updateBanksByProviderUpdate = await db.updateBanksByProviderUpdateQuery(requestBody.banks.update, providerData).then((res) => res);
            if(updateBanksByProviderUpdate.error){ return { status: false, code: 500, message: updateBanksByProviderUpdate.error }; }
            if(updateBanksByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Bank not found.' }; }
        }
        if(requestBody.banks.create && requestBody.banks.create.length > 0){
            let bankList = [];
            for(let i = 0; i < requestBody.banks.create.length; i++){
                bankList.push({
                    cbanco: requestBody.banks.create[i].cbanco,
                    ctipocuentabancaria: requestBody.banks.create[i].ctipocuentabancaria,
                    xnumerocuenta: requestBody.banks.create[i].xnumerocuenta,
                    bprincipal: requestBody.banks.create[i].bprincipal
                })
            }
            let createBanksByProviderUpdate = await db.createBanksByProviderUpdateQuery(bankList, providerData).then((res) => res);
            // if(createBanksByProviderUpdate.error){ return { status: false, code: 500, message: createBanksByProviderUpdate.error }; }
        }
    }
    if(requestBody.states){
        if(requestBody.states.delete && requestBody.states.delete.length > 0){
            let deleteStatesByProviderUpdate = await db.deleteStatesByProviderUpdateQuery(requestBody.states.delete, providerData).then((res) => res);
            if(deleteStatesByProviderUpdate.error){ return { status: false, code: 500, message: deleteStatesByProviderUpdate.error }; }
            if(deleteStatesByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteStatesByProviderUpdate' }; }
        } 
        if(requestBody.states.update && requestBody.states.update.length > 0){
            let updateStatesByProviderUpdate = await db.updateStatesByProviderUpdateQuery(requestBody.states.update, providerData).then((res) => res);
            if(updateStatesByProviderUpdate.error){ console.log(updateStatesByProviderUpdate.error);return { status: false, code: 500, message: updateStatesByProviderUpdate.error }; }
            if(updateStatesByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'State not found.' }; }
        }
        if(requestBody.states.create && requestBody.states.create.length > 0){
            let createStatesByProviderUpdate = await db.createStatesByProviderUpdateQuery(requestBody.states.create, providerData).then((res) => res);
            if(createStatesByProviderUpdate.error){ return { status: false, code: 500, message: createStatesByProviderUpdate.error }; }
            if(createStatesByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createStatesByProviderUpdate' }; }
        }
    }
    if(requestBody.brands){
        if(requestBody.brands.delete && requestBody.brands.delete.length > 0){
            let deleteBrandsByProviderUpdate = await db.deleteBrandsByProviderUpdateQuery(requestBody.brands.delete, providerData).then((res) => res);
            if(deleteBrandsByProviderUpdate.error){ return { status: false, code: 500, message: deleteBrandsByProviderUpdate.error }; }
            if(deleteBrandsByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteBrandsByProviderUpdate' }; }
        }
        if(requestBody.brands.update && requestBody.brands.update.length > 0){
            let updateBrandsByProviderUpdate = await db.updateBrandsByProviderUpdateQuery(requestBody.brands.update, providerData).then((res) => res);
            if(updateBrandsByProviderUpdate.error){ return { status: false, code: 500, message: updateBrandsByProviderUpdate.error }; }
            if(updateBrandsByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Brand not found.' }; }
        }
        if(requestBody.brands.create && requestBody.brands.create.length > 0){
            let createBrandsByProviderUpdate = await db.createBrandsByProviderUpdateQuery(requestBody.brands.create, providerData).then((res) => res);
            if(createBrandsByProviderUpdate.error){ return { status: false, code: 500, message: createBrandsByProviderUpdate.error }; }
            if(createBrandsByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBrandsByProviderUpdate' }; }
        } 
    }
    if(requestBody.services){
        if(requestBody.services.delete && requestBody.services.delete.length > 0){
            let deleteServicesByProviderUpdate = await db.deleteServicesByProviderUpdateQuery(requestBody.services.delete, providerData).then((res) => res);
            if(deleteServicesByProviderUpdate.error){ return { status: false, code: 500, message: deleteServicesByProviderUpdate.error }; }
            if(deleteServicesByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteServicesByProviderUpdate' }; }
        } 
        //No tiene sentido
        //if(requestBody.services.update && requestBody.services.update.length > 0){
        //    let updateServicesByProviderUpdate = await db.updateServicesByProviderUpdateQuery(requestBody.services.update, providerData).then((res) => res);
        //    if(updateServicesByProviderUpdate.error){ return { status: false, code: 500, message: updateServicesByProviderUpdate.error }; }
        //    if(updateServicesByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Service not found.' }; }
        //}
        if(requestBody.services.create && requestBody.services.create.length > 0){
            let createServicesByProviderUpdate = await db.createServicesByProviderUpdateQuery(requestBody.services.create, providerData).then((res) => res);
            if(createServicesByProviderUpdate.error){ console.log(createServicesByProviderUpdate.error);return { status: false, code: 500, message: createServicesByProviderUpdate.error }; }
            if(createServicesByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServicesByProviderUpdate' }; }
        }
    }
    if(requestBody.contacts){
        if(requestBody.contacts.delete && requestBody.contacts.delete.length > 0){
            let deleteContactsByProviderUpdate = await db.deleteContactsByProviderUpdateQuery(requestBody.contacts.delete, providerData).then((res) => res);
            if(deleteContactsByProviderUpdate.error){ return { status: false, code: 500, message: deleteContactsByProviderUpdate.error }; }
            if(deleteContactsByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteContactsByProviderUpdate' }; }
        }
        if(requestBody.contacts.update && requestBody.contacts.update.length > 0){
            for(let i = 0; i < requestBody.contacts.update.length; i++){
                requestBody.contacts.update[i].xnombre = requestBody.contacts.update[i].xnombre.toUpperCase();
                requestBody.contacts.update[i].xapellido = requestBody.contacts.update[i].xapellido.toUpperCase();
                requestBody.contacts.update[i].xdocidentidad = requestBody.contacts.update[i].xdocidentidad;
                requestBody.contacts.update[i].xtelefonocelular = requestBody.contacts.update[i].xtelefonocelular;
                requestBody.contacts.update[i].xemail = requestBody.contacts.update[i].xemail.toUpperCase();
                requestBody.contacts.update[i].xcargo ? requestBody.contacts.update[i].xcargo = requestBody.contacts.update[i].xcargo.toUpperCase() : false;
                requestBody.contacts.update[i].xtelefonocasa ? requestBody.contacts.update[i].xtelefonocasa = requestBody.contacts.update[i].xtelefonocasa : false;
                requestBody.contacts.update[i].xtelefonooficina ? requestBody.contacts.update[i].xtelefonooficina = requestBody.contacts.update[i].xtelefonooficina : false;
                requestBody.contacts.update[i].xfax ? requestBody.contacts.update[i].xfax = requestBody.contacts.update[i].xfax : false;
            }
            let updateContactsByProviderUpdate = await db.updateContactsByProviderUpdateQuery(requestBody.contacts.update, providerData).then((res) => res);
            if(updateContactsByProviderUpdate.error){ return { status: false, code: 500, message: updateContactsByProviderUpdate.error }; }
            if(updateContactsByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Contact not found.' }; }
        }
        if(requestBody.contacts.create && requestBody.contacts.create.length > 0){
            for(let i = 0; i < requestBody.contacts.create.length; i++){
                requestBody.contacts.create[i].xnombre = requestBody.contacts.create[i].xnombre.toUpperCase();
                requestBody.contacts.create[i].xapellido = requestBody.contacts.create[i].xapellido.toUpperCase();
                requestBody.contacts.create[i].xdocidentidad = requestBody.contacts.create[i].xdocidentidad;
                requestBody.contacts.create[i].xtelefonocelular = requestBody.contacts.create[i].xtelefonocelular;
                requestBody.contacts.create[i].xemail = requestBody.contacts.create[i].xemail.toUpperCase();
                requestBody.contacts.create[i].xcargo ? requestBody.contacts.create[i].xcargo = requestBody.contacts.create[i].xcargo.toUpperCase() : false;
                requestBody.contacts.create[i].xtelefonocasa ? requestBody.contacts.create[i].xtelefonocasa = requestBody.contacts.create[i].xtelefonocasa : false;
                requestBody.contacts.create[i].xtelefonooficina ? requestBody.contacts.create[i].xtelefonooficina = requestBody.contacts.create[i].xtelefonooficina : false;
                requestBody.contacts.create[i].xfax ? requestBody.contacts.create[i].xfax = requestBody.contacts.create[i].xfax : false;
            }
            let createContactsByProviderUpdate = await db.createContactsByProviderUpdateQuery(requestBody.contacts.create, providerData).then((res) => res);
            if(createContactsByProviderUpdate.error){ return { status: false, code: 500, message: createContactsByProviderUpdate.error }; }
            if(createContactsByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createContactsByProviderUpdate' }; }
        }
    }
    let documentList = [];
    if(requestBody.documentos){
        if(requestBody.documentos.create){
            for(let i = 0; i < requestBody.documentos.create.length; i++){
                documentList.push({
                    xobservacion: requestBody.documentos.create[i].xobservacion,
                    xruta: requestBody.documentos.create[i].xrutaarchivo
                })
            }
            let createDocumentByProviderUpdate = await db.createDocumentsByProviderUpdateQuery(documentList, providerData).then((res) => res);
            if(createDocumentByProviderUpdate.error){ return { status: false, code: 500, message: createDocumentByProviderUpdate.error }; }
            if(createDocumentByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDocumentByProviderUpdate' }; }
        }
        if(requestBody.documentos.update){
            for(let i = 0; i < requestBody.documentos.update.length; i++){
                documentList.push({
                    id: requestBody.documentos.update[i].id,
                    xobservacion: requestBody.documentos.update[i].xobservacion,
                    xruta: requestBody.documentos.update[i].xrutaarchivo
                })
            }
            let updateDocumentByProviderUpdate = await db.updateDocumentsByProviderUpdateQuery(documentList, providerData).then((res) => res);
            if(updateDocumentByProviderUpdate.error){ return { status: false, code: 500, message: updateDocumentByProviderUpdate.error }; }
            if(updateDocumentByProviderUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'updateDocumentByProviderUpdate' }; }
        }
    }
    return { status: true, cproveedor: providerData.cproveedor };
}

module.exports = router;