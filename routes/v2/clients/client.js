const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'client', req.body, 'searchClientsProductionClientSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchClient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClient' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchClient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xcliente: requestBody.xcliente ? helper.encrypt(requestBody.xcliente.toUpperCase()) : undefined,
        xcontrato: requestBody.xcontrato ? helper.encrypt(requestBody.xcontrato.toUpperCase()) : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined
    }
    let searchClient = await db.searchClientQuery(searchData).then((res) => res);
    if(searchClient.error){ return  { status: false, code: 500, message: searchClient.error }; }
    if(searchClient.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Client not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchClient.result.recordset.length; i++){
        jsonList.push({
            ccliente: searchClient.result.recordset[i].CCLIENTE,
            xcliente: searchClient.result.recordset[i].XCLIENTE,
            xcontrato: searchClient.result.recordset[i].XCONTRATO,
            xdocidentidad: searchClient.result.recordset[i].XDOCIDENTIDAD,
            bactivo: searchClient.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'client', req.body, 'createClientsProductionClientSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreateClient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateClient' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreateClient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let banks = [];
    if(requestBody.banks){
        banks = requestBody.banks;
        for(let i = 0; i < banks.length; i++){
            banks[i].xnumerocuenta = helper.encrypt(banks[i].xnumerocuenta);
            banks[i].xcontrato = helper.encrypt(banks[i].xcontrato);
        }
    }
    let contacts = [];
    if(requestBody.contacts){
        contacts = requestBody.contacts;
        for(let i = 0; i < contacts.length; i++){
            contacts[i].xnombre = helper.encrypt(contacts[i].xnombre.toUpperCase());
            contacts[i].xapellido = helper.encrypt(contacts[i].xapellido.toUpperCase());
            contacts[i].xdocidentidad = helper.encrypt(contacts[i].xdocidentidad);
            contacts[i].xtelefonocelular = helper.encrypt(contacts[i].xtelefonocelular);
            contacts[i].xemail = helper.encrypt(contacts[i].xemail.toUpperCase());
            contacts[i].xcargo ? contacts[i].xcargo = helper.encrypt(contacts[i].xcargo.toUpperCase()) : false;
            contacts[i].xfax ? contacts[i].xfax = helper.encrypt(contacts[i].xfax.toUpperCase()) : false;
            contacts[i].xtelefonooficina ? contacts[i].xtelefonooficina = helper.encrypt(contacts[i].xtelefonooficina) : false;
            contacts[i].xtelefonocasa ? contacts[i].xtelefonocasa = helper.encrypt(contacts[i].xtelefonocasa) : false;
        }
    }
    let associates = [];
    if(requestBody.associates){
        associates = requestBody.associates;
    }
    let bonds = [];
    if(requestBody.bonds){
        bonds = requestBody.bonds;
    }
    let brokers = [];
    if(requestBody.brokers){
        brokers = requestBody.brokers;
    }
    let depreciations = [];
    if(requestBody.depreciations){
        depreciations = requestBody.depreciations;
    }
    let relationships = [];
    if(requestBody.relationships){
        relationships = requestBody.relationships;
        for(let i = 0; i < relationships.length; i++){
            relationships[i].xobservacion = helper.encrypt(relationships[i].xobservacion.toUpperCase());
        }
    }
    let penalties = [];
    if(requestBody.penalties){
        penalties = requestBody.penalties;
    }
    let providers = [];
    if(requestBody.providers){
        providers = requestBody.providers;
        for(let i = 0; i < providers.length; i++){
            providers[i].xobservacion = helper.encrypt(providers[i].xobservacion.toUpperCase());
        }
    }
    let models = [];
    if(requestBody.models){
        models = requestBody.models;
        for(let i = 0; i < models.length; i++){
            models[i].xobservacion = helper.encrypt(models[i].xobservacion.toUpperCase());
        }
    }
    let workers = [];
    if(requestBody.workers){
        workers = requestBody.workers;
        for(let i = 0; i < workers.length; i++){
            workers[i].xnombre = helper.encrypt(workers[i].xnombre.toUpperCase());
            workers[i].xapellido = helper.encrypt(workers[i].xapellido.toUpperCase());
            workers[i].xdocidentidad = helper.encrypt(workers[i].xdocidentidad);
            workers[i].xtelefonocelular = helper.encrypt(workers[i].xtelefonocelular);
            workers[i].xemail = helper.encrypt(workers[i].xemail.toUpperCase());
            workers[i].xdireccion = helper.encrypt(workers[i].xdireccion.toUpperCase());
            workers[i].xprofesion ? workers[i].xprofesion = helper.encrypt(workers[i].xprofesion.toUpperCase()) : false;
            workers[i].xocupacion ? workers[i].xocupacion = helper.encrypt(workers[i].xocupacion.toUpperCase()) : false;
            workers[i].xfax ? workers[i].xfax = helper.encrypt(workers[i].xfax.toUpperCase()) : false;
            workers[i].xtelefonocasa ? workers[i].xtelefonocasa = helper.encrypt(workers[i].xtelefonocasa) : false;
        }
    }
    let documents = [];
    if(requestBody.documents){
        documents = requestBody.documents;
    }
    let groupers = [];
    if(requestBody.groupers){
        groupers = requestBody.groupers;
        for(let i = 0; i < groupers.length; i++){
            groupers[i].xcontratoalternativo = helper.encrypt(groupers[i].xcontratoalternativo.toUpperCase());
            groupers[i].xnombre = helper.encrypt(groupers[i].xnombre.toUpperCase());
            groupers[i].xrazonsocial = helper.encrypt(groupers[i].xrazonsocial.toUpperCase());
            groupers[i].xdireccionfiscal = helper.encrypt(groupers[i].xdireccionfiscal.toUpperCase());
            groupers[i].xdocidentidad = helper.encrypt(groupers[i].xdocidentidad);
            groupers[i].xtelefono = helper.encrypt(groupers[i].xtelefono.toUpperCase());
            groupers[i].xfax ? groupers[i].xfax = helper.encrypt(groupers[i].xfax.toUpperCase()) : false;
            groupers[i].xemail = helper.encrypt(groupers[i].xemail.toUpperCase());
            if(groupers[i].banks)
            for(let j = 0; j < groupers[i].banks.length; j++){
                groupers[i].banks[j].xnumerocuenta = helper.encrypt(groupers[i].banks[j].xnumerocuenta);
                groupers[i].banks[j].xcontrato = helper.encrypt(groupers[i].banks[j].xcontrato);
            }
        }
    }
    let plans = [];
    if(requestBody.plans){
        plans = requestBody.plans;
    }
    let clientData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        banks: banks ? banks : undefined,
        contacts: contacts ? contacts : undefined,
        associates: associates ? associates : undefined,
        bonds: bonds ? bonds : undefined,
        brokers: brokers ? brokers : undefined,
        depreciations: depreciations ? depreciations : undefined,
        relationships: relationships ? relationships : undefined,
        penalties: penalties ? penalties : undefined,
        providers: providers ? providers : undefined,
        models: models ? models : undefined,
        workers: workers ? workers : undefined,
        documents: documents ? documents : undefined,
        groupers: groupers ? groupers : undefined,
        plans: plans ? plans : undefined,
        xcliente: requestBody.xcliente.toUpperCase(),
        xcontrato: requestBody.xcontrato,
        xrepresentante: requestBody.xrepresentante.toUpperCase(),
        cempresa: requestBody.cempresa ? requestBody.cempresa : undefined,
        cactividadempresa: requestBody.cactividadempresa,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: requestBody.xdocidentidad,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccionfiscal: requestBody.xdireccionfiscal.toUpperCase(),
        xemail: requestBody.xemail.toUpperCase(),
        fanomaximo: requestBody.fanomaximo ? requestBody.fanomaximo : undefined,
        finicio: requestBody.finicio,
        xtelefono: requestBody.xtelefono ? requestBody.xtelefono : undefined,
        bcolectivo: requestBody.bcolectivo,
        bfacturar: requestBody.bfacturar,
        bfinanciar: requestBody.bfinanciar,
        bcontribuyente: requestBody.bcontribuyente,
        bimpuesto: requestBody.bimpuesto,
        bnotificacionsms: requestBody.bnotificacionsms,
        xpaginaweb: requestBody.xpaginaweb ? requestBody.xpaginaweb.toUpperCase() : undefined,
        ctipopago: requestBody.ctipopago ? requestBody.ctipopago : undefined,
        xrutaimagen: requestBody.xrutaimagen ? requestBody.xrutaimagen : undefined,
        ifacturacion: requestBody.ifacturacion ? requestBody.ifacturacion : undefined,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyClientIdentification = await db.verifyClientIdentificationToCreateQuery(clientData).then((res) => res);
    if(verifyClientIdentification.error){ return { status: false, code: 500, message: verifyClientIdentification.error }; }
    if(verifyClientIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    let createClient = await db.createClientQuery(clientData).then((res) => res);
    if(createClient.error){ return { status: false, code: 500, message: createClient.error }; }
    if(createClient.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClient' }; }
    return { status: true, ccliente: createClient.result.recordset[0].CCLIENTE };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'client', req.body, 'detailClientsProductionClientSchema');
    if(validateSchema.error){ 
        res.status(401).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailClient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClient' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailClient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clientData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente
    };
    let getClientData = await db.getClientDataQuery(clientData).then((res) => res);
    if(getClientData.error){ return { status: false, code: 500, message: getClientData.error }; }
    if(getClientData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Client not found.' }; }
    /*let banks = [];
    let getClientBanksData = await db.getClientBanksDataQuery(clientData.ccliente).then((res) => res);
    if(getClientBanksData.error){ return { status: false, code: 500, message: getClientBanksData.error }; }
    if(getClientBanksData.result.rowsAffected > 0){
        for(let i = 0; i < getClientBanksData.result.recordset.length; i++){
            let bank = {
                cbanco: getClientBanksData.result.recordset[i].CBANCO,
                xbanco: getClientBanksData.result.recordset[i].XBANCO,
                ctipocuentabancaria: getClientBanksData.result.recordset[i].CTIPOCUENTABANCARIA,
                xtipocuentabancaria: getClientBanksData.result.recordset[i].XTIPOCUENTABANCARIA,
                xnumerocuenta: helper.decrypt(getClientBanksData.result.recordset[i].XNUMEROCUENTA),
                xcontrato: helper.decrypt(getClientBanksData.result.recordset[i].XCONTRATO),
                bprincipal: getClientBanksData.result.recordset[i].BPRINCIPAL,
            }
            banks.push(bank);
        }
    }*/
    /*let associates = [];
    let getClientAssociatesData = await db.getClientAssociatesDataQuery(clientData.ccliente).then((res) => res);
    if(getClientAssociatesData.error){ return { status: false, code: 500, message: getClientAssociatesData.error }; }
    if(getClientAssociatesData.result.rowsAffected > 0){
        for(let i = 0; i < getClientAssociatesData.result.recordset.length; i++){
            let associate = {
                casociado: getClientAssociatesData.result.recordset[i].CASOCIADO,
                xasociado: helper.decrypt(getClientAssociatesData.result.recordset[i].XASOCIADO)
            }
            associates.push(associate);
        }
    }
    let bonds = [];
    let getClientBondsData = await db.getClientBondsDataQuery(clientData.ccliente).then((res) => res);
    if(getClientBondsData.error){ return { status: false, code: 500, message: getClientBondsData.error }; }
    if(getClientBondsData.result.rowsAffected > 0){
        for(let i = 0; i < getClientBondsData.result.recordset.length; i++){
            let bond = {
                cbono: getClientBondsData.result.recordset[i].CBONO,
                pbono: getClientBondsData.result.recordset[i].PBONO,
                mbono: getClientBondsData.result.recordset[i].MBONO,
                fefectiva: getClientBondsData.result.recordset[i].FEFECTIVA,
            }
            bonds.push(bond);
        }
    }
    let contacts = [];
    let getClietContactsData = await db.getClientContactsDataQuery(clientData.ccliente).then((res) => res);
    if(getClietContactsData.error){ return { status: false, code: 500, message: getClietContactsData.error }; }
    if(getClietContactsData.result.rowsAffected > 0){
        for(let i = 0; i < getClietContactsData.result.recordset.length; i++){
            let contact = {
                ccontacto: getClietContactsData.result.recordset[i].CCONTACTO,
                xnombre: helper.decrypt(getClietContactsData.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(getClietContactsData.result.recordset[i].XAPELLIDO),
                ctipodocidentidad: getClietContactsData.result.recordset[i].CTIPODOCIDENTIDAD,
                xdocidentidad: helper.decrypt(getClietContactsData.result.recordset[i].XDOCIDENTIDAD),
                xtelefonocelular: helper.decrypt(getClietContactsData.result.recordset[i].XTELEFONOCELULAR),
                xemail: helper.decrypt(getClietContactsData.result.recordset[i].XEMAIL),
                xcargo: getClietContactsData.result.recordset[i].XCARGO ? helper.decrypt(getClietContactsData.result.recordset[i].XCARGO) : undefined,
                xtelefonocasa: getClietContactsData.result.recordset[i].XTELEFONOCASA ? helper.decrypt(getClietContactsData.result.recordset[i].XTELEFONOCASA) : undefined,
                xtelefonooficina: getClietContactsData.result.recordset[i].XTELEFONOOFICINA ? helper.decrypt(getClietContactsData.result.recordset[i].XTELEFONOOFICINA) : undefined,
                xfax: getClietContactsData.result.recordset[i].XFAX ? helper.decrypt(getClietContactsData.result.recordset[i].XFAX) : undefined,
                bnotificacion: getClietContactsData.result.recordset[i].BNOTIFICACION
            }
            contacts.push(contact);
        }
    }
    let brokers = [];
    let getClientBrokersData = await db.getClientBrokersDataQuery(clientData.ccliente).then((res) => res);
    if(getClientBrokersData.error){ return { status: false, code: 500, message: getClientBrokersData.error }; }
    if(getClientBrokersData.result.rowsAffected > 0){
        for(let i = 0; i < getClientBrokersData.result.recordset.length; i++){
            let broker = {
                ccorredor: getClientBrokersData.result.recordset[i].CCORREDOR,
                xcorredor: `${helper.decrypt(getClientBrokersData.result.recordset[i].XNOMBRE)} ${helper.decrypt(getClientBrokersData.result.recordset[i].XAPELLIDO)}`,
                pcorredor: getClientBrokersData.result.recordset[i].PCORREDOR,
                mcorredor: getClientBrokersData.result.recordset[i].MCORREDOR,
                fefectiva: getClientBrokersData.result.recordset[i].FEFECTIVA
            }
            brokers.push(broker);
        }
    }
    let depreciations = [];
    let getClientDepreciationsData = await db.getClientDepreciationsDataQuery(clientData.ccliente).then((res) => res);
    if(getClientDepreciationsData.error){ return { status: false, code: 500, message: getClientDepreciationsData.error }; }
    if(getClientDepreciationsData.result.rowsAffected > 0){
        for(let i = 0; i < getClientDepreciationsData.result.recordset.length; i++){
            let depreciation = {
                cdepreciacion: getClientDepreciationsData.result.recordset[i].CDEPRECIACION,
                xdepreciacion: getClientDepreciationsData.result.recordset[i].XDEPRECIACION,
                pdepreciacion: getClientDepreciationsData.result.recordset[i].PDEPRECIACION,
                mdepreciacion: getClientDepreciationsData.result.recordset[i].MDEPRECIACION,
                fefectiva: getClientDepreciationsData.result.recordset[i].FEFECTIVA
            }
            depreciations.push(depreciation);
        }
    }
    let relationships = [];
    let getClientRelationshipsData = await db.getClientRelationshipsDataQuery(clientData.ccliente).then((res) => res);
    if(getClientRelationshipsData.error){ return { status: false, code: 500, message: getClientRelationshipsData.error }; }
    if(getClientRelationshipsData.result.rowsAffected > 0){
        for(let i = 0; i < getClientRelationshipsData.result.recordset.length; i++){
            let relationship = {
                cparentesco: getClientRelationshipsData.result.recordset[i].CPARENTESCO,
                xparentesco: getClientRelationshipsData.result.recordset[i].XPARENTESCO,
                xobservacion: helper.decrypt(getClientRelationshipsData.result.recordset[i].XOBSERVACION),
                fefectiva: getClientRelationshipsData.result.recordset[i].FEFECTIVA
            }
            relationships.push(relationship);
        }
    }
    let penalties = [];
    let getClientPenaltiesData = await db.getClientPenaltiesDataQuery(clientData.ccliente).then((res) => res);
    if(getClientPenaltiesData.error){ return { status: false, code: 500, message: getClientPenaltiesData.error }; }
    if(getClientPenaltiesData.result.rowsAffected > 0){
        for(let i = 0; i < getClientPenaltiesData.result.recordset.length; i++){
            let penalty = {
                cpenalizacion: getClientPenaltiesData.result.recordset[i].CPENALIZACION,
                xpenalizacion: getClientPenaltiesData.result.recordset[i].XPENALIZACION,
                ppenalizacion: getClientPenaltiesData.result.recordset[i].PPENALIZACION,
                mpenalizacion: getClientPenaltiesData.result.recordset[i].MPENALIZACION,
                fefectiva: getClientPenaltiesData.result.recordset[i].FEFECTIVA
            }
            penalties.push(penalty);
        }
    }
    let providers = [];
    let getClientProvidersData = await db.getClientProvidersDataQuery(clientData.ccliente).then((res) => res);
    if(getClientProvidersData.error){ return { status: false, code: 500, message: getClientProvidersData.error }; }
    if(getClientProvidersData.result.rowsAffected > 0){
        for(let i = 0; i < getClientProvidersData.result.recordset.length; i++){
            let provider = {
                cproveedor: getClientProvidersData.result.recordset[i].CPROVEEDOR,
                xproveedor: helper.decrypt(getClientProvidersData.result.recordset[i].XPROVEEDOR),
                xobservacion: helper.decrypt(getClientProvidersData.result.recordset[i].XOBSERVACION),
                fefectiva: getClientProvidersData.result.recordset[i].FEFECTIVA
            }
            providers.push(provider);
        }
    }
    let models = [];
    let getClientModelsData = await db.getClientModelsDataQuery(clientData.ccliente).then((res) => res);
    if(getClientModelsData.error){ return { status: false, code: 500, message: getClientModelsData.error }; }
    if(getClientModelsData.result.rowsAffected > 0){
        for(let i = 0; i < getClientModelsData.result.recordset.length; i++){
            let model = {
                cmodelo: getClientModelsData.result.recordset[i].CMODELO,
                xmodelo: getClientModelsData.result.recordset[i].XMODELO,
                cmarca: getClientModelsData.result.recordset[i].CMARCA,
                xmarca: getClientModelsData.result.recordset[i].XMARCA,
                xobservacion: helper.decrypt(getClientModelsData.result.recordset[i].XOBSERVACION)
            }
            models.push(model);
        }
    }
    let workers = [];
    let getClientWorkersData = await db.getClientWorkersDataQuery(clientData.ccliente).then((res) => res);
    if(getClientWorkersData.error){ return { status: false, code: 500, message: getClientWorkersData.error }; }
    if(getClientWorkersData.result.rowsAffected > 0){
        for(let i = 0; i < getClientWorkersData.result.recordset.length; i++){
            let worker = {
                ctrabajador: getClientWorkersData.result.recordset[i].CTRABAJADOR,
                xnombre: helper.decrypt(getClientWorkersData.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(getClientWorkersData.result.recordset[i].XAPELLIDO),
                ctipodocidentidad: getClientWorkersData.result.recordset[i].CTIPODOCIDENTIDAD,
                xdocidentidad: helper.decrypt(getClientWorkersData.result.recordset[i].XDOCIDENTIDAD),
                xtelefonocelular: helper.decrypt(getClientWorkersData.result.recordset[i].XTELEFONOCELULAR),
                xemail: helper.decrypt(getClientWorkersData.result.recordset[i].XEMAIL),
                xprofesion: getClientWorkersData.result.recordset[i].XPROFESION ? helper.decrypt(getClientWorkersData.result.recordset[i].XPROFESION) : undefined,
                xtelefonocasa: getClientWorkersData.result.recordset[i].XTELEFONOCASA ? helper.decrypt(getClientWorkersData.result.recordset[i].XTELEFONOCASA) : undefined,
                xocupacion: getClientWorkersData.result.recordset[i].XOCUPACION ? helper.decrypt(getClientWorkersData.result.recordset[i].XOCUPACION) : undefined,
                xfax: getClientWorkersData.result.recordset[i].XFAX ? helper.decrypt(getClientWorkersData.result.recordset[i].XFAX) : undefined,
                cparentesco: getClientWorkersData.result.recordset[i].CPARENTESCO,
                cestadocivil: getClientWorkersData.result.recordset[i].CESTADOCIVIL,
                cestado: getClientWorkersData.result.recordset[i].CESTADO,
                cciudad: getClientWorkersData.result.recordset[i].CCIUDAD,
                xdireccion: helper.decrypt(getClientWorkersData.result.recordset[i].XDIRECCION),
                fnacimiento: getClientWorkersData.result.recordset[i].FNACIMIENTO
            }
            workers.push(worker);
        }
    }
    let documents = [];
    let getClientDocumentsData = await db.getClientDocumentsDataQuery(clientData.ccliente).then((res) => res);
    if(getClientDocumentsData.error){ return { status: false, code: 500, message: getClientDocumentsData.error }; }
    if(getClientDocumentsData.result.rowsAffected > 0){
        for(let i = 0; i < getClientDocumentsData.result.recordset.length; i++){
            let document = {
                cdocumento: getClientDocumentsData.result.recordset[i].CDOCUMENTO,
                xdocumento: getClientDocumentsData.result.recordset[i].XDOCUMENTO,
                xrutaarchivo: getClientDocumentsData.result.recordset[i].XRUTAARCHIVO
            }
            documents.push(document);
        }
    }
    let groupers = [];
    let getClientGroupersData = await db.getClientGroupersDataQuery(clientData.ccliente).then((res) => res);
    if(getClientGroupersData.error){ return { status: false, code: 500, message: getClientGroupersData.error }; }
    if(getClientGroupersData.result.rowsAffected > 0){
        for(let i = 0; i < getClientGroupersData.result.recordset.length; i++){
            let banks = [];
            let getGrouperBanksData = await db.getGrouperBanksDataQuery(getClientGroupersData.result.recordset[i].CAGRUPADOR).then((res) => res);
            if(getGrouperBanksData.error){ return { status: false, code: 500, message: getGrouperBanksData.error }; }
            if(getGrouperBanksData.result.rowsAffected > 0){
                for(let i = 0; i < getGrouperBanksData.result.recordset.length; i++){
                    let bank = {
                        cbanco: getGrouperBanksData.result.recordset[i].CBANCO,
                        xbanco: getGrouperBanksData.result.recordset[i].XBANCO,
                        ctipocuentabancaria: getGrouperBanksData.result.recordset[i].CTIPOCUENTABANCARIA,
                        xtipocuentabancaria: getGrouperBanksData.result.recordset[i].XTIPOCUENTABANCARIA,
                        xnumerocuenta: helper.decrypt(getGrouperBanksData.result.recordset[i].XNUMEROCUENTA),
                        xcontrato: helper.decrypt(getGrouperBanksData.result.recordset[i].XCONTRATO),
                        bprincipal: getGrouperBanksData.result.recordset[i].BPRINCIPAL,
                    }
                    banks.push(bank);
                }
            }
            let grouper = {
                cagrupador: getClientGroupersData.result.recordset[i].CAGRUPADOR,
                xcontratoalternativo: helper.decrypt(getClientGroupersData.result.recordset[i].XCONTRATOALTERNATIVO),
                xnombre: helper.decrypt(getClientGroupersData.result.recordset[i].XNOMBRE),
                xrazonsocial: helper.decrypt(getClientGroupersData.result.recordset[i].XRAZONSOCIAL),
                cestado: getClientGroupersData.result.recordset[i].CESTADO,
                cciudad: getClientGroupersData.result.recordset[i].CCIUDAD,
                xdireccionfiscal: helper.decrypt(getClientGroupersData.result.recordset[i].XDIRECCIONFISCAL),
                ctipodocidentidad: getClientGroupersData.result.recordset[i].CTIPODOCIDENTIDAD,
                xdocidentidad: helper.decrypt(getClientGroupersData.result.recordset[i].XDOCIDENTIDAD),
                bfacturar: getClientGroupersData.result.recordset[i].BFACTURAR,
                bcontribuyente: getClientGroupersData.result.recordset[i].BCONTRIBUYENTE,
                bimpuesto: getClientGroupersData.result.recordset[i].BIMPUESTO,
                xtelefono: helper.decrypt(getClientGroupersData.result.recordset[i].XTELEFONO),
                xfax: getClientGroupersData.result.recordset[i].XFAX ? helper.decrypt(getClientGroupersData.result.recordset[i].XFAX) : undefined,
                xemail: helper.decrypt(getClientGroupersData.result.recordset[i].XEMAIL),
                xrutaimagen: getClientGroupersData.result.recordset[0].XRUTAIMAGEN ? getClientGroupersData.result.recordset[0].XRUTAIMAGEN : undefined,
                bactivo: getClientGroupersData.result.recordset[i].BACTIVO,
                banks: banks
            }
            groupers.push(grouper);
        }
    }
    let plans = [];
    let getClientPlansData = await db.getClientPlansDataQuery(clientData.ccliente).then((res) => res);
    if(getClientPlansData.error){ return { status: false, code: 500, message: getClientPlansData.error }; }
    if(getClientPlansData.result.rowsAffected > 0){
        for(let i = 0; i < getClientPlansData.result.recordset.length; i++){
            let plan = {
                cplancliente: getClientPlansData.result.recordset[i].CPLANCLIENTE,
                cplan: getClientPlansData.result.recordset[i].CPLAN,
                xplan: getClientPlansData.result.recordset[i].XPLAN,
                casociado: getClientPlansData.result.recordset[i].CASOCIADO,
                xasociado: helper.decrypt(getClientPlansData.result.recordset[i].XASOCIADO),
                ctipoplan: getClientPlansData.result.recordset[i].CTIPOPLAN,
                xtipoplan: getClientPlansData.result.recordset[i].XTIPOPLAN,
                fdesde: getClientPlansData.result.recordset[i].FDESDE,
                fhasta: getClientPlansData.result.recordset[i].FHASTA
            }
            plans.push(plan);
        }
    }*/
    return {
        status: true,
        ccliente: getClientData.result.recordset[0].CCLIENTE,
        xcliente: getClientData.result.recordset[0].XCLIENTE,
        xcontrato: getClientData.result.recordset[0].XCONTRATO,
        xrepresentante: getClientData.result.recordset[0].XREPRESENTANTE,
        cempresa: getClientData.result.recordset[0].CEMPRESA,
        cactividadempresa: getClientData.result.recordset[0].CACTIVIDADEMPRESA,
        ctipodocidentidad: getClientData.result.recordset[0].CTIPODOCIDENTIDAD,
        xdocidentidad: getClientData.result.recordset[0].XDOCIDENTIDAD,
        cestado: getClientData.result.recordset[0].CESTADO,
        cciudad: getClientData.result.recordset[0].CCIUDAD,
        xdireccionfiscal: getClientData.result.recordset[0].XDIRECCIONFISCAL,
        xemail: getClientData.result.recordset[0].XEMAIL,
        fanomaximo: getClientData.result.recordset[0].FANOMAXIMO,
        finicio: getClientData.result.recordset[0].FINICIO,
        xtelefono: getClientData.result.recordset[0].XTELEFONO ? getClientData.result.recordset[0].XTELEFONO : undefined,
        bcolectivo: getClientData.result.recordset[0].BCOLECTIVO,
        bfacturar: getClientData.result.recordset[0].BFACTURAR,
        bfinanciar: getClientData.result.recordset[0].BFINANCIAR,
        bcontribuyente: getClientData.result.recordset[0].BCONTRIBUYENTE,
        bimpuesto: getClientData.result.recordset[0].BIMPUESTO,
        bnotificacionsms: getClientData.result.recordset[0].BNOTIFICACIONSMS,
        xpaginaweb: getClientData.result.recordset[0].XPAGINAWEB ? getClientData.result.recordset[0].XPAGINAWEB : undefined,
        ctipopago: getClientData.result.recordset[0].CTIPOPAGO,
        xrutaimagen: getClientData.result.recordset[0].XRUTAIMAGEN ? getClientData.result.recordset[0].XRUTAIMAGEN : undefined,
        ifacturacion: getClientData.result.recordset[0].IFACTURACION,
        bactivo: getClientData.result.recordset[0].BACTIVO
        /*banks: banks,
        associates: associates,
        bonds: bonds,
        contacts: contacts,
        brokers: brokers,
        depreciations: depreciations,
        relationships: relationships,
        penalties: penalties,
        providers: providers,
        models: models,
        workers: workers,
        documents: documents,
        groupers: groupers,
        plans: plans*/
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'client', req.body, 'updateClientsProductionClientSchema');
    if(validateSchema.error){ 
        res.status(401).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateClient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateClient' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateClient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clientData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente,
        xcliente: requestBody.xcliente.toUpperCase(),
        xcontrato: requestBody.xcontrato ? requestBody.xcontrato: undefined,
        xrepresentante: requestBody.xrepresentante.toUpperCase(),
        cempresa: requestBody.cempresa,
        cactividadempresa: requestBody.cactividadempresa,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: requestBody.xdocidentidad,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccionfiscal: requestBody.xdireccionfiscal ? requestBody.xdireccionfiscal.toUpperCase(): undefined,
        xemail: requestBody.xemail.toUpperCase(),
        fanomaximo: requestBody.fanomaximo ? requestBody.fanomaximo: undefined,
        finicio: requestBody.finicio,
        xtelefono: requestBody.xtelefono ? requestBody.xtelefono: undefined,
        bcolectivo: requestBody.bcolectivo,
        bfacturar: requestBody.bfacturar,
        bfinanciar: requestBody.bfinanciar,
        bcontribuyente: requestBody.bcontribuyente,
        bimpuesto: requestBody.bimpuesto,
        bnotificacionsms: requestBody.bnotificacionsms,
        xpaginaweb: requestBody.xpaginaweb ? requestBody.xpaginaweb.toUpperCase() : undefined,
        ctipopago: requestBody.ctipopago,
        xrutaimagen: requestBody.xrutaimagen ? requestBody.xrutaimagen : undefined,
        ifacturacion: requestBody.ifacturacion,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyClientIdentification = await db.verifyClientIdentificationToUpdateQuery(clientData).then((res) => res);
    if(verifyClientIdentification.error){ return { status: false, code: 500, message: verifyClientIdentification.error }; }
    if(verifyClientIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    let updateClient = await db.updateClientQuery(clientData).then((res) => res);
    if(updateClient.error){ return { status: false, code: 500, message: updateClient.error }; }
    if(updateClient.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Client not found.' }; }
    if(requestBody.banks){
        if(requestBody.banks.delete && requestBody.banks.delete.length){
            let deleteBanksByClientUpdate = await db.deleteBanksByClientUpdateQuery(requestBody.banks.delete, clientData).then((res) => res);
            if(deleteBanksByClientUpdate.error){ return { status: false, code: 500, message: deleteBanksByClientUpdate.error }; }
            if(deleteBanksByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteBanksByClientUpdate' }; }
        }
        if(requestBody.banks.update && requestBody.banks.update.length > 0){
            for(let i = 0; i < requestBody.banks.update.length; i++){
                requestBody.banks.update[i].xnumerocuenta = helper.encrypt(requestBody.banks.update[i].xnumerocuenta);
                requestBody.banks.update[i].xcontrato = helper.encrypt(requestBody.banks.update[i].xcontrato);
            }
            let updateBanksByClientUpdate = await db.updateBanksByClientUpdateQuery(requestBody.banks.update, clientData).then((res) => res);
            if(updateBanksByClientUpdate.error){ return { status: false, code: 500, message: updateBanksByClientUpdate.error }; }
            if(updateBanksByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Bank not found.' }; }
        }
        if(requestBody.banks.create && requestBody.banks.create.length > 0){
            for(let i = 0; i < requestBody.banks.create.length; i++){
                requestBody.banks.create[i].xnumerocuenta = helper.encrypt(requestBody.banks.create[i].xnumerocuenta);
                requestBody.banks.create[i].xcontrato = helper.encrypt(requestBody.banks.create[i].xcontrato);
            }
            let createBanksByClientUpdate = await db.createBanksByClientUpdateQuery(requestBody.banks.create, clientData).then((res) => res);
            if(createBanksByClientUpdate.error){ return { status: false, code: 500, message: createBanksByClientUpdate.error }; }
            if(createBanksByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBanksByClientUpdate' }; }
        }
    }
    if(requestBody.associates){
        if(requestBody.associates.delete && requestBody.associates.delete.length){
            let deleteAssociatesByClientUpdate = await db.deleteAssociatesByClientUpdateQuery(requestBody.associates.delete, clientData).then((res) => res);
            if(deleteAssociatesByClientUpdate.error){ return { status: false, code: 500, message: deleteAssociatesByClientUpdate.error }; }
            if(deleteAssociatesByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteAssociatesByClientUpdate' }; }
        }
        if(requestBody.associates.update && requestBody.associates.update.length > 0){
            let updateAssociatesByClientUpdate = await db.updateAssociatesByClientUpdateQuery(requestBody.associates.update, clientData).then((res) => res);
            if(updateAssociatesByClientUpdate.error){ return { status: false, code: 500, message: updateAssociatesByClientUpdate.error }; }
            if(updateAssociatesByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Associate not found.' }; }
        }
        if(requestBody.associates.create && requestBody.associates.create.length > 0){
            let createAssociatesByClientUpdate = await db.createAssociatesByClientUpdateQuery(requestBody.associates.create, clientData).then((res) => res);
            if(createAssociatesByClientUpdate.error){ return { status: false, code: 500, message: createAssociatesByClientUpdate.error }; }
            if(createAssociatesByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createAssociatesByClientUpdate' }; }
        }
    }
    if(requestBody.bonds){
        if(requestBody.bonds.delete && requestBody.bonds.delete.length){
            let deleteBondsByClientUpdate = await db.deleteBondsByClientUpdateQuery(requestBody.bonds.delete, clientData).then((res) => res);
            if(deleteBondsByClientUpdate.error){ return { status: false, code: 500, message: deleteBondsByClientUpdate.error }; }
            if(deleteBondsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteBondsByClientUpdate' }; }
        }
        if(requestBody.bonds.update && requestBody.bonds.update.length > 0){
            let updateBondsByClientUpdate = await db.updateBondsByClientUpdateQuery(requestBody.bonds.update, clientData).then((res) => res);
            if(updateBondsByClientUpdate.error){ return { status: false, code: 500, message: updateBondsByClientUpdate.error }; }
            if(updateBondsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Bond not found.' }; }
        }
        if(requestBody.bonds.create && requestBody.bonds.create.length > 0){
            let createBondsByClientUpdate = await db.createBondsByClientUpdateQuery(requestBody.bonds.create, clientData).then((res) => res);
            if(createBondsByClientUpdate.error){ return { status: false, code: 500, message: createBondsByClientUpdate.error }; }
            if(createBondsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBondsByClientUpdate' }; }
        }
    }
    if(requestBody.contacts){
        if(requestBody.contacts.delete && requestBody.contacts.delete.length){
            let deleteContactsByClientUpdate = await db.deleteContactsByClientUpdateQuery(requestBody.contacts.delete, clientData).then((res) => res);
            if(deleteContactsByClientUpdate.error){ return { status: false, code: 500, message: deleteContactsByClientUpdate.error }; }
            if(deleteContactsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteContactsByClientUpdate' }; }
        }
        if(requestBody.contacts.update && requestBody.contacts.update.length > 0){
            for(let i = 0; i < requestBody.contacts.update.length; i++){
                requestBody.contacts.update[i].xnombre = helper.encrypt(requestBody.contacts.update[i].xnombre.toUpperCase());
                requestBody.contacts.update[i].xapellido = helper.encrypt(requestBody.contacts.update[i].xapellido.toUpperCase());
                requestBody.contacts.update[i].xdocidentidad = helper.encrypt(requestBody.contacts.update[i].xdocidentidad);
                requestBody.contacts.update[i].xtelefonocelular = helper.encrypt(requestBody.contacts.update[i].xtelefonocelular);
                requestBody.contacts.update[i].xemail = helper.encrypt(requestBody.contacts.update[i].xemail.toUpperCase());
                requestBody.contacts.update[i].xcargo ? requestBody.contacts.update[i].xcargo = helper.encrypt(requestBody.contacts.update[i].xcargo.toUpperCase()) : false;
                requestBody.contacts.update[i].xtelefonocasa ? requestBody.contacts.update[i].xtelefonocasa = helper.encrypt(requestBody.contacts.update[i].xtelefonocasa) : false;
                requestBody.contacts.update[i].xtelefonooficina ? requestBody.contacts.update[i].xtelefonooficina = helper.encrypt(requestBody.contacts.update[i].xtelefonooficina) : false;
                requestBody.contacts.update[i].xfax ? requestBody.contacts.update[i].xfax = helper.encrypt(requestBody.contacts.update[i].xfax) : false;
            }
            let updateContactsByClientUpdate = await db.updateContactsByClientUpdateQuery(requestBody.contacts.update, clientData).then((res) => res);
            if(updateContactsByClientUpdate.error){ return { status: false, code: 500, message: updateContactsByClientUpdate.error }; }
            if(updateContactsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Contact not found.' }; }
        }
        if(requestBody.contacts.create && requestBody.contacts.create.length > 0){
            for(let i = 0; i < requestBody.contacts.create.length; i++){
                requestBody.contacts.create[i].xnombre = helper.encrypt(requestBody.contacts.create[i].xnombre.toUpperCase());
                requestBody.contacts.create[i].xapellido = helper.encrypt(requestBody.contacts.create[i].xapellido.toUpperCase());
                requestBody.contacts.create[i].xdocidentidad = helper.encrypt(requestBody.contacts.create[i].xdocidentidad);
                requestBody.contacts.create[i].xtelefonocelular = helper.encrypt(requestBody.contacts.create[i].xtelefonocelular);
                requestBody.contacts.create[i].xemail = helper.encrypt(requestBody.contacts.create[i].xemail.toUpperCase());
                requestBody.contacts.create[i].xcargo ? requestBody.contacts.create[i].xcargo = helper.encrypt(requestBody.contacts.create[i].xcargo.toUpperCase()) : false;
                requestBody.contacts.create[i].xtelefonocasa ? requestBody.contacts.create[i].xtelefonocasa = helper.encrypt(requestBody.contacts.create[i].xtelefonocasa) : false;
                requestBody.contacts.create[i].xtelefonooficina ? requestBody.contacts.create[i].xtelefonooficina = helper.encrypt(requestBody.contacts.create[i].xtelefonooficina) : false;
                requestBody.contacts.create[i].xfax ? requestBody.contacts.create[i].xfax = helper.encrypt(requestBody.contacts.create[i].xfax) : false;
            }
            let createContactsByClientUpdate = await db.createContactsByClientUpdateQuery(requestBody.contacts.create, clientData).then((res) => res);
            if(createContactsByClientUpdate.error){ return { status: false, code: 500, message: createContactsByClientUpdate.error }; }
            if(createContactsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createContactsByClientUpdate' }; }
        }
    }
    if(requestBody.brokers){
        if(requestBody.brokers.delete && requestBody.brokers.delete.length){
            let deleteBrokersByClientUpdate = await db.deleteBrokersByClientUpdateQuery(requestBody.brokers.delete, clientData).then((res) => res);
            if(deleteBrokersByClientUpdate.error){ return { status: false, code: 500, message: deleteBrokersByClientUpdate.error }; }
            if(deleteBrokersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteBrokersByClientUpdate' }; }
        }
        if(requestBody.brokers.update && requestBody.brokers.update.length > 0){
            let updateBrokersByClientUpdate = await db.updateBrokersByClientUpdateQuery(requestBody.brokers.update, clientData).then((res) => res);
            if(updateBrokersByClientUpdate.error){ return { status: false, code: 500, message: updateBrokersByClientUpdate.error }; }
            if(updateBrokersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Broker not found.' }; }
        }
        if(requestBody.brokers.create && requestBody.brokers.create.length > 0){
            let createBrokersByClientUpdate = await db.createBrokersByClientUpdateQuery(requestBody.brokers.create, clientData).then((res) => res);
            if(createBrokersByClientUpdate.error){ return { status: false, code: 500, message: createBrokersByClientUpdate.error }; }
            if(createBrokersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBrokersByClientUpdate' }; }
        }
    }
    if(requestBody.depreciations){
        if(requestBody.depreciations.delete && requestBody.depreciations.delete.length){
            let deleteDepreciationsByClientUpdate = await db.deleteDepreciationsByClientUpdateQuery(requestBody.depreciations.delete, clientData).then((res) => res);
            if(deleteDepreciationsByClientUpdate.error){ return { status: false, code: 500, message: deleteDepreciationsByClientUpdate.error }; }
            if(deleteDepreciationsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteDepreciationsByClientUpdate' }; }
        }
        if(requestBody.depreciations.update && requestBody.depreciations.update.length > 0){
            let updateDepreciationsByClientUpdate = await db.updateDepreciationsByClientUpdateQuery(requestBody.depreciations.update, clientData).then((res) => res);
            if(updateDepreciationsByClientUpdate.error){ return { status: false, code: 500, message: updateDepreciationsByClientUpdate.error }; }
            if(updateDepreciationsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Depreciation not found.' }; }
        }
        if(requestBody.depreciations.create && requestBody.depreciations.create.length > 0){
            let createDepreciationsByClientUpdate = await db.createDepreciationsByClientUpdateQuery(requestBody.depreciations.create, clientData).then((res) => res);
            if(createDepreciationsByClientUpdate.error){ return { status: false, code: 500, message: createDepreciationsByClientUpdate.error }; }
            if(createDepreciationsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDepreciationsByClientUpdate' }; }
        }
    }
    if(requestBody.relationships){
        if(requestBody.relationships.delete && requestBody.relationships.delete.length){
            let deleteRelationshipsByClientUpdate = await db.deleteRelationshipsByClientUpdateQuery(requestBody.relationships.delete, clientData).then((res) => res);
            if(deleteRelationshipsByClientUpdate.error){ return { status: false, code: 500, message: deleteRelationshipsByClientUpdate.error }; }
            if(deleteRelationshipsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteRelationshipsByClientUpdate' }; }
        }
        if(requestBody.relationships.update && requestBody.relationships.update.length > 0){
            for(let i = 0; i < requestBody.relationships.update.length; i++){
                requestBody.relationships.update[i].xobservacion = helper.encrypt(requestBody.relationships.update[i].xobservacion.toUpperCase());
            }
            let updateRelationshipsByClientUpdate = await db.updateRelationshipsByClientUpdateQuery(requestBody.relationships.update, clientData).then((res) => res);
            if(updateRelationshipsByClientUpdate.error){ return { status: false, code: 500, message: updateRelationshipsByClientUpdate.error }; }
            if(updateRelationshipsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Relationship not found.' }; }
        }
        if(requestBody.relationships.create && requestBody.relationships.create.length > 0){
            for(let i = 0; i < requestBody.relationships.create.length; i++){
                requestBody.relationships.create[i].xobservacion = helper.encrypt(requestBody.relationships.create[i].xobservacion.toUpperCase());
            }
            let createRelationshipsByClientUpdate = await db.createRelationshipsByClientUpdateQuery(requestBody.relationships.create, clientData).then((res) => res);
            if(createRelationshipsByClientUpdate.error){ return { status: false, code: 500, message: createRelationshipsByClientUpdate.error }; }
            if(createRelationshipsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createRelationshipsByClientUpdate' }; }
        }
    }
    if(requestBody.penalties){
        if(requestBody.penalties.delete && requestBody.penalties.delete.length){
            let deletePenaltiesByClientUpdate = await db.deletePenaltiesByClientUpdateQuery(requestBody.penalties.delete, clientData).then((res) => res);
            if(deletePenaltiesByClientUpdate.error){ return { status: false, code: 500, message: deletePenaltiesByClientUpdate.error }; }
            if(deletePenaltiesByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePenaltiesByClientUpdate' }; }
        }
        if(requestBody.penalties.update && requestBody.penalties.update.length > 0){
            let updatePenaltiesByClientUpdate = await db.updatePenaltiesByClientUpdateQuery(requestBody.penalties.update, clientData).then((res) => res);
            if(updatePenaltiesByClientUpdate.error){ return { status: false, code: 500, message: updatePenaltiesByClientUpdate.error }; }
            if(updatePenaltiesByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Penalty not found.' }; }
        }
        if(requestBody.penalties.create && requestBody.penalties.create.length > 0){
            let createPenaltiesByClientUpdate = await db.createPenaltiesByClientUpdateQuery(requestBody.penalties.create, clientData).then((res) => res);
            if(createPenaltiesByClientUpdate.error){ return { status: false, code: 500, message: createPenaltiesByClientUpdate.error }; }
            if(createPenaltiesByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPenaltiesByClientUpdate' }; }
        }
    }
    if(requestBody.providers){
        if(requestBody.providers.delete && requestBody.providers.delete.length){
            let deleteProvidersByClientUpdate = await db.deleteProvidersByClientUpdateQuery(requestBody.providers.delete, clientData).then((res) => res);
            if(deleteProvidersByClientUpdate.error){ return { status: false, code: 500, message: deleteProvidersByClientUpdate.error }; }
            if(deleteProvidersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteProvidersByClientUpdate' }; }
        }
        if(requestBody.providers.update && requestBody.providers.update.length > 0){
            for(let i = 0; i < requestBody.providers.update.length; i++){
                requestBody.providers.update[i].xobservacion = helper.encrypt(requestBody.providers.update[i].xobservacion.toUpperCase());
            }
            let updateProvidersByClientUpdate = await db.updateProvidersByClientUpdateQuery(requestBody.providers.update, clientData).then((res) => res);
            if(updateProvidersByClientUpdate.error){ return { status: false, code: 500, message: updateProvidersByClientUpdate.error }; }
            if(updateProvidersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Provider not found.' }; }
        }
        if(requestBody.providers.create && requestBody.providers.create.length > 0){
            for(let i = 0; i < requestBody.providers.create.length; i++){
                requestBody.providers.create[i].xobservacion = helper.encrypt(requestBody.providers.create[i].xobservacion.toUpperCase());
            }
            let createProvidersByClientUpdate = await db.createProvidersByClientUpdateQuery(requestBody.providers.create, clientData).then((res) => res);
            if(createProvidersByClientUpdate.error){ return { status: false, code: 500, message: createProvidersByClientUpdate.error }; }
            if(createProvidersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createProvidersByClientUpdate' }; }
        }
    }
    if(requestBody.models){
        if(requestBody.models.delete && requestBody.models.delete.length){
            let deleteModelsByClientUpdate = await db.deleteModelsByClientUpdateQuery(requestBody.models.delete, clientData).then((res) => res);
            if(deleteModelsByClientUpdate.error){ return { status: false, code: 500, message: deleteModelsByClientUpdate.error }; }
            if(deleteModelsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteModelsByClientUpdate' }; }
        }
        if(requestBody.models.update && requestBody.models.update.length > 0){
            for(let i = 0; i < requestBody.models.update.length; i++){
                requestBody.models.update[i].xobservacion = helper.encrypt(requestBody.models.update[i].xobservacion.toUpperCase());
            }
            let updateModelsByClientUpdate = await db.updateModelsByClientUpdateQuery(requestBody.models.update, clientData).then((res) => res);
            if(updateModelsByClientUpdate.error){ return { status: false, code: 500, message: updateModelsByClientUpdate.error }; }
            if(updateModelsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Model not found.' }; }
        }
        if(requestBody.models.create && requestBody.models.create.length > 0){
            for(let i = 0; i < requestBody.models.create.length; i++){
                requestBody.models.create[i].xobservacion = helper.encrypt(requestBody.models.create[i].xobservacion.toUpperCase());
            }
            let createModelsByClientUpdate = await db.createModelsByClientUpdateQuery(requestBody.models.create, clientData).then((res) => res);
            if(createModelsByClientUpdate.error){ return { status: false, code: 500, message: createModelsByClientUpdate.error }; }
            if(createModelsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createModelsByClientUpdate' }; }
        }
    }
    if(requestBody.workers){
        if(requestBody.workers.delete && requestBody.workers.delete.length){
            let deleteWorkersByClientUpdate = await db.deleteWorkersByClientUpdateQuery(requestBody.workers.delete, clientData).then((res) => res);
            if(deleteWorkersByClientUpdate.error){ return { status: false, code: 500, message: deleteWorkersByClientUpdate.error }; }
            if(deleteWorkersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteWorkersByClientUpdate' }; }
        }
        if(requestBody.workers.update && requestBody.workers.update.length > 0){
            for(let i = 0; i < requestBody.workers.update.length; i++){
                requestBody.workers.update[i].xnombre = helper.encrypt(requestBody.workers.update[i].xnombre.toUpperCase());
                requestBody.workers.update[i].xapellido = helper.encrypt(requestBody.workers.update[i].xapellido.toUpperCase());
                requestBody.workers.update[i].xdocidentidad = helper.encrypt(requestBody.workers.update[i].xdocidentidad);
                requestBody.workers.update[i].xtelefonocelular = helper.encrypt(requestBody.workers.update[i].xtelefonocelular);
                requestBody.workers.update[i].xemail = helper.encrypt(requestBody.workers.update[i].xemail.toUpperCase());
                requestBody.workers.update[i].xdireccion = helper.encrypt(requestBody.workers.update[i].xdireccion.toUpperCase());
                requestBody.workers.update[i].xprofesion ? requestBody.workers.update[i].xprofesion = helper.encrypt(requestBody.workers.update[i].xprofesion.toUpperCase()) : false;
                requestBody.workers.update[i].xocupacion ? requestBody.workers.update[i].xocupacion = helper.encrypt(requestBody.workers.update[i].xocupacion.toUpperCase()) : false;
                requestBody.workers.update[i].xfax ? requestBody.workers.update[i].xfax = helper.encrypt(requestBody.workers.update[i].xfax.toUpperCase()) : false;
                requestBody.workers.update[i].xtelefonocasa ? requestBody.workers.update[i].xtelefonocasa = helper.encrypt(requestBody.workers.update[i].xtelefonocasa) : false;
            }
            let updateWorkersByClientUpdate = await db.updateWorkersByClientUpdateQuery(requestBody.workers.update, clientData).then((res) => res);
            if(updateWorkersByClientUpdate.error){ return { status: false, code: 500, message: updateWorkersByClientUpdate.error }; }
            if(updateWorkersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Worker not found.' }; }
        }
        if(requestBody.workers.create && requestBody.workers.create.length > 0){
            for(let i = 0; i < requestBody.workers.create.length; i++){
                requestBody.workers.create[i].xnombre = helper.encrypt(requestBody.workers.create[i].xnombre.toUpperCase());
                requestBody.workers.create[i].xapellido = helper.encrypt(requestBody.workers.create[i].xapellido.toUpperCase());
                requestBody.workers.create[i].xdocidentidad = helper.encrypt(requestBody.workers.create[i].xdocidentidad);
                requestBody.workers.create[i].xtelefonocelular = helper.encrypt(requestBody.workers.create[i].xtelefonocelular);
                requestBody.workers.create[i].xemail = helper.encrypt(requestBody.workers.create[i].xemail.toUpperCase());
                requestBody.workers.create[i].xdireccion = helper.encrypt(requestBody.workers.create[i].xdireccion.toUpperCase());
                requestBody.workers.create[i].xprofesion ? requestBody.workers.create[i].xprofesion = helper.encrypt(requestBody.workers.create[i].xprofesion.toUpperCase()) : false;
                requestBody.workers.create[i].xocupacion ? requestBody.workers.create[i].xocupacion = helper.encrypt(requestBody.workers.create[i].xocupacion.toUpperCase()) : false;
                requestBody.workers.create[i].xfax ? requestBody.workers.create[i].xfax = helper.encrypt(requestBody.workers.create[i].xfax.toUpperCase()) : false;
                requestBody.workers.create[i].xtelefonocasa ? requestBody.workers.create[i].xtelefonocasa = helper.encrypt(requestBody.workers.create[i].xtelefonocasa) : false;
            }
            let createWorkersByClientUpdate = await db.createWorkersByClientUpdateQuery(requestBody.workers.create, clientData).then((res) => res);
            if(createWorkersByClientUpdate.error){ return { status: false, code: 500, message: createWorkersByClientUpdate.error }; }
            if(createWorkersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createWorkersByClientUpdate' }; }
        }
    }
    if(requestBody.documents){
        if(requestBody.documents.delete && requestBody.documents.delete.length){
            let deleteDocumentsByClientUpdate = await db.deleteDocumentsByClientUpdateQuery(requestBody.documents.delete, clientData).then((res) => res);
            if(deleteDocumentsByClientUpdate.error){ return { status: false, code: 500, message: deleteDocumentsByClientUpdate.error }; }
            if(deleteDocumentsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteDocumentsByClientUpdate' }; }
        }
        if(requestBody.documents.update && requestBody.documents.update.length > 0){
            let updateDocumentsByClientUpdate = await db.updateDocumentsByClientUpdateQuery(requestBody.documents.update, clientData).then((res) => res);
            if(updateDocumentsByClientUpdate.error){ return { status: false, code: 500, message: updateDocumentsByClientUpdate.error }; }
            if(updateDocumentsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Document not found.' }; }
        }
        if(requestBody.documents.create && requestBody.documents.create.length > 0){
            let createDocumentsByClientUpdate = await db.createDocumentsByClientUpdateQuery(requestBody.documents.create, clientData).then((res) => res);
            if(createDocumentsByClientUpdate.error){ return { status: false, code: 500, message: createDocumentsByClientUpdate.error }; }
            if(createDocumentsByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createDocumentsByClientUpdate' }; }
        }
    }
    if(requestBody.groupers){
        if(requestBody.groupers.delete && requestBody.groupers.delete.length){
            let deleteGroupersByClientUpdate = await db.deleteGroupersByClientUpdateQuery(requestBody.groupers.delete, clientData).then((res) => res);
            if(deleteGroupersByClientUpdate.error){ return { status: false, code: 500, message: deleteGroupersByClientUpdate.error }; }
            if(deleteGroupersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteGroupersByClientUpdate' }; }
        }
        if(requestBody.groupers.update && requestBody.groupers.update.length > 0){
            for(let i = 0; i < requestBody.groupers.update.length; i++){
                requestBody.groupers.update[i].xcontratoalternativo = helper.encrypt(requestBody.groupers.update[i].xcontratoalternativo.toUpperCase());
                requestBody.groupers.update[i].xnombre = helper.encrypt(requestBody.groupers.update[i].xnombre.toUpperCase());
                requestBody.groupers.update[i].xrazonsocial = helper.encrypt(requestBody.groupers.update[i].xrazonsocial.toUpperCase());
                requestBody.groupers.update[i].xdireccionfiscal = helper.encrypt(requestBody.groupers.update[i].xdireccionfiscal.toUpperCase());
                requestBody.groupers.update[i].xdocidentidad = helper.encrypt(requestBody.groupers.update[i].xdocidentidad);
                requestBody.groupers.update[i].xtelefono = helper.encrypt(requestBody.groupers.update[i].xtelefono.toUpperCase());
                requestBody.groupers.update[i].xfax ? requestBody.groupers.update[i].xfax = helper.encrypt(requestBody.groupers.update[i].xfax.toUpperCase()) : false;
                requestBody.groupers.update[i].xemail = helper.encrypt(requestBody.groupers.update[i].xemail.toUpperCase());
                if(requestBody.groupers.update[i].banks){
                    if(requestBody.groupers.update[i].banks.update && requestBody.groupers.update[i].banks.update.length > 0){
                        for(let j = 0; j < requestBody.groupers.update[i].banks.update.length; j++){
                            requestBody.groupers.update[i].banks.update[j].xnumerocuenta = helper.encrypt(requestBody.groupers.update[i].banks.update[j].xnumerocuenta);
                            requestBody.groupers.update[i].banks.update[j].xcontrato = helper.encrypt(requestBody.groupers.update[i].banks.update[j].xcontrato);
                        }
                    }
                    if(requestBody.groupers.update[i].banks.create && requestBody.groupers.update[i].banks.create.length > 0){
                        for(let j = 0; j < requestBody.groupers.update[i].banks.create.length; j++){
                            requestBody.groupers.update[i].banks.create[j].xnumerocuenta = helper.encrypt(requestBody.groupers.update[i].banks.create[j].xnumerocuenta);
                            requestBody.groupers.update[i].banks.create[j].xcontrato = helper.encrypt(requestBody.groupers.update[i].banks.create[j].xcontrato);
                        }
                    }
                }
            }
            let updateGroupersByClientUpdate = await db.updateGroupersByClientUpdateQuery(requestBody.groupers.update, clientData).then((res) => res);
            if(updateGroupersByClientUpdate.error){ return { status: false, code: 500, message: updateGroupersByClientUpdate.error }; }
            if(updateGroupersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Grouper not found.' }; }
        }
        if(requestBody.groupers.create && requestBody.groupers.create.length > 0){
            for(let i = 0; i < requestBody.groupers.create.length; i++){
                requestBody.groupers.create[i].xcontratoalternativo = helper.encrypt(requestBody.groupers.create[i].xcontratoalternativo.toUpperCase());
                requestBody.groupers.create[i].xnombre = helper.encrypt(requestBody.groupers.create[i].xnombre.toUpperCase());
                requestBody.groupers.create[i].xrazonsocial = helper.encrypt(requestBody.groupers.create[i].xrazonsocial.toUpperCase());
                requestBody.groupers.create[i].xdireccionfiscal = helper.encrypt(requestBody.groupers.create[i].xdireccionfiscal.toUpperCase());
                requestBody.groupers.create[i].xdocidentidad = helper.encrypt(requestBody.groupers.create[i].xdocidentidad);
                requestBody.groupers.create[i].xtelefono = helper.encrypt(requestBody.groupers.create[i].xtelefono.toUpperCase());
                requestBody.groupers.create[i].xfax ? requestBody.groupers.create[i].xfax = helper.encrypt(requestBody.groupers.create[i].xfax.toUpperCase()) : false;
                requestBody.groupers.create[i].xemail = helper.encrypt(requestBody.groupers.create[i].xemail.toUpperCase());
                if(requestBody.groupers.create[i].banks && requestBody.groupers.create[i].banks.length > 0){
                    for(let j = 0; j < requestBody.groupers.create[i].banks.length; j++){
                        requestBody.groupers.create[i].banks[j].xnumerocuenta = helper.encrypt(requestBody.groupers.create[i].banks[j].xnumerocuenta);
                        requestBody.groupers.create[i].banks[j].xcontrato = helper.encrypt(requestBody.groupers.create[i].banks[j].xcontrato);
                    }
                }
            }
            let createGroupersByClientUpdate = await db.createGroupersByClientUpdateQuery(requestBody.groupers.create, clientData).then((res) => res);
            if(createGroupersByClientUpdate.error){ return { status: false, code: 500, message: createGroupersByClientUpdate.error }; }
            if(createGroupersByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createGroupersByClientUpdate' }; }
        }
    }
    if(requestBody.plans){
        if(requestBody.plans.delete && requestBody.plans.delete.length){
            let deletePlansByClientUpdate = await db.deletePlansByClientUpdateQuery(requestBody.plans.delete, clientData).then((res) => res);
            if(deletePlansByClientUpdate.error){ return { status: false, code: 500, message: deletePlansByClientUpdate.error }; }
            if(deletePlansByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePlansByClientUpdate' }; }
        }
        if(requestBody.plans.update && requestBody.plans.update.length > 0){
            let updatePlansByClientUpdate = await db.updatePlansByClientUpdateQuery(requestBody.plans.update, clientData).then((res) => res);
            if(updatePlansByClientUpdate.error){ return { status: false, code: 500, message: updatePlansByClientUpdate.error }; }
            if(updatePlansByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Plan not found.' }; }
        }
        if(requestBody.plans.create && requestBody.plans.create.length > 0){
            let createPlansByClientUpdate = await db.createPlansByClientUpdateQuery(requestBody.plans.create, clientData).then((res) => res);
            if(createPlansByClientUpdate.error){ return { status: false, code: 500, message: createPlansByClientUpdate.error }; }
            if(createPlansByClientUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPlansByClientUpdate' }; }
        }
    }
    return { status: true, ccliente: clientData.ccliente };
}

module.exports = router;