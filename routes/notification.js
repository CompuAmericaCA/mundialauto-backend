const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchNotification(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchNotification' } });
        });
    }
});

const operationSearchNotification = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cnotificacion: requestBody.cnotificacion ? requestBody.cnotificacion : undefined,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        casociado: requestBody.casociado ? requestBody.casociado : undefined,
        fcreacion: requestBody.fcreacion ? requestBody.fcreacion : undefined,
        fevento: requestBody.fevento ? requestBody.fevento : undefined,
        xplaca: requestBody.xplaca ? requestBody.xplaca : undefined,
        ccompania: requestBody.ccompania
    };
    let searchNotification = await bd.searchNotificationQuery(searchData).then((res) => res);
    if(searchNotification.error){ return  { status: false, code: 500, message: searchNotification.error }; }
    if(searchNotification.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchNotification.result.recordset.length; i++){
            let vehiculo = searchNotification.result.recordset[i].XMARCA + ' ' + searchNotification.result.recordset[i].XMODELO + ' ' + searchNotification.result.recordset[i].XVERSION
            jsonList.push({
                cnotificacion: searchNotification.result.recordset[i].CNOTIFICACION,
                fcreacion: searchNotification.result.recordset[i].FCREACION,
                fevento: searchNotification.result.recordset[i].FEVENTO,
                ccliente: searchNotification.result.recordset[i].CCLIENTE,
                xcliente: searchNotification.result.recordset[i].XCLIENTE,
                casociado: searchNotification.result.recordset[i].CASOCIADO,
                xasociado: searchNotification.result.recordset[i].XASOCIADO,
                xvehiculo: vehiculo,
                xcausasiniestro: searchNotification.result.recordset[i].XCAUSASINIESTRO,
                xplaca: searchNotification.result.recordset[i].XPLACA,
                bactivo: searchNotification.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}
//
router.route('/search/contract/vehicle').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchContractVehicle(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchContractVehicle' } });
        });
    }
});

const operationSearchContractVehicle = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        xplaca: requestBody.xplaca ? requestBody.xplaca : undefined,
        ccompania: requestBody.ccompania
    };
    let searchFleetContractManagement = await bd.searchFleetContractManagementQuery(searchData).then((res) => res);
    if(searchFleetContractManagement.error){ return  { status: false, code: 500, message: searchFleetContractManagement.error }; }
    if(searchFleetContractManagement.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchFleetContractManagement.result.recordset.length; i++){
            let propietario = searchFleetContractManagement.result.recordset[i].XNOMBRE + ' ' + searchFleetContractManagement.result.recordset[i].XAPELLIDO
            let telefonopropietario;
            if(searchFleetContractManagement.result.recordset[0].XTELEFONOCELULAR){
                telefonopropietario = searchFleetContractManagement.result.recordset[0].XTELEFONOCELULAR;
            }else{
                telefonopropietario = searchFleetContractManagement.result.recordset[0].XTELEFONOCASA
            }
            jsonList.push({
                ccontratoflota: searchFleetContractManagement.result.recordset[i].CCONTRATOFLOTA,
                ccliente: searchFleetContractManagement.result.recordset[i].CCLIENTE,
                xcliente: searchFleetContractManagement.result.recordset[i].XCLIENTE,
                cestatusgeneral: searchFleetContractManagement.result.recordset[i].CESTATUSGENERAL,
                xestatusgeneral: searchFleetContractManagement.result.recordset[i].XESTATUSGENERAL,
                cmarca: searchFleetContractManagement.result.recordset[i].CMARCA,
                xmarca: searchFleetContractManagement.result.recordset[i].XMARCA,
                cmodelo: searchFleetContractManagement.result.recordset[i].CMODELO,
                xmodelo: searchFleetContractManagement.result.recordset[i].XMODELO,
                xversion: searchFleetContractManagement.result.recordset[i].XVERSION,
                xplaca: searchFleetContractManagement.result.recordset[i].XPLACA,
                fano: searchFleetContractManagement.result.recordset[i].FANO,
                xcolor: searchFleetContractManagement.result.recordset[i].XCOLOR,
                xtipo: searchFleetContractManagement.result.recordset[i].XTIPO,
                xserialcarroceria: searchFleetContractManagement.result.recordset[i].XSERIALCARROCERIA,
                fdesde_pol: searchFleetContractManagement.result.recordset[i].FDESDE_POL,
                fhasta_pol: searchFleetContractManagement.result.recordset[i].FHASTA_POL,
                xserialmotor: searchFleetContractManagement.result.recordset[i].XSERIALMOTOR,
                xnombrepropietario: searchFleetContractManagement.result.recordset[i].XNOMBRE,
                xapellidopropietario: searchFleetContractManagement.result.recordset[i].XAPELLIDO,
                xdocidentidadpropietario: searchFleetContractManagement.result.recordset[i].XDOCIDENTIDAD,
                xdireccionpropietario: searchFleetContractManagement.result.recordset[i].XDIRECCION,
                xtelefonocelularpropietario: telefonopropietario,
                xemailpropietario: searchFleetContractManagement.result.recordset[i].XEMAIL,
                xpropietario: propietario,
                bactivo: searchFleetContractManagement.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Contract Vehicle not found.' }; }
}

router.route('/search/replacement').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchReplacement' } });
        });
    }
});

const operationSearchReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctiporepuesto: requestBody.ctiporepuesto ? requestBody.ctiporepuesto : undefined,
        xrepuesto: requestBody.xrepuesto ? requestBody.xrepuesto.toUpperCase() : undefined,
        bizquierda: requestBody.bizquierda ? requestBody.bizquierda : undefined,
        bderecha: requestBody.bderecha ? requestBody.bderecha : undefined,
        bsuperior: requestBody.bsuperior ? requestBody.bsuperior : undefined,
        binferior: requestBody.binferior ? requestBody.binferior : undefined,
        bdelantero: requestBody.bdelantero ? requestBody.bdelantero : undefined,
        btrasero: requestBody.btrasero ? requestBody.btrasero : undefined
    };
    let searchReplacement = await bd.searchReplacementQuery(searchData).then((res) => res);
    if(searchReplacement.error){ return  { status: false, code: 500, message: searchReplacement.error }; }
    if(searchReplacement.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchReplacement.result.recordset.length; i++){
            jsonList.push({
                crepuesto: searchReplacement.result.recordset[i].CREPUESTO,
                xrepuesto: searchReplacement.result.recordset[i].XREPUESTO,
                ctiporepuesto: searchReplacement.result.recordset[i].CTIPOREPUESTO,
                xtiporepuesto: searchReplacement.result.recordset[i].XTIPOREPUESTO,
                bactivo: searchReplacement.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Replacement not found.' }; }
}

router.route('/search/existent-replacement').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchExistentReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchExistentReplacement' } });
        });
    }
});

const operationSearchExistentReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cnotificacion: requestBody.cnotificacion
    };
    let getNotificationData = await bd.getNotificationDataQuery(searchData).then((res) => res);
    if(getNotificationData.error){ return { status: false, code: 500, message: getNotificationData.error }; }
    if(getNotificationData.result.rowsAffected > 0){
        let replacements = [];
        let getNotificationReplacementsData = await bd.getNotificationReplacementsDataQuery(searchData.cnotificacion).then((res) => res);
        if(getNotificationReplacementsData.error){ return { status: false, code: 500, message: getNotificationReplacementsData.error }; }
        if(getNotificationReplacementsData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationReplacementsData.result.recordset.length; i++){
                let replacement = {
                    crepuesto: getNotificationReplacementsData.result.recordset[i].CREPUESTO,
                    xrepuesto: getNotificationReplacementsData.result.recordset[i].XREPUESTO,
                    ctiporepuesto: getNotificationReplacementsData.result.recordset[i].CTIPOREPUESTO,
                    xtiporepuesto: getNotificationReplacementsData.result.recordset[i].XTIPOREPUESTO,
                    ncantidad: getNotificationReplacementsData.result.recordset[i].NCANTIDAD,
                    cniveldano: getNotificationReplacementsData.result.recordset[i].CNIVELDANO,
                    xniveldano: getNotificationReplacementsData.result.recordset[i].XNIVELDANO
                }
                replacements.push(replacement);
            }
        }
        let thirdpartyReplacements = [];
        let getNotificationThirdpartyVehiclesData = await bd.getNotificationThirdpartyVehiclesDataQuery(searchData.cnotificacion).then((res) => res);
        if(getNotificationThirdpartyVehiclesData.error){ return { status: false, code: 500, message: getNotificationThirdpartyVehiclesData.error }; }
        if(getNotificationThirdpartyVehiclesData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationThirdpartyVehiclesData.result.recordset.length; i++){
                let getReplacementsThirdpartyVehicleData = await bd.getReplacementsThirdpartyVehicleDataQuery(getNotificationThirdpartyVehiclesData.result.recordset[i].CVEHICULOTERCERONOTIFICACION).then((res) => res);
                if(getReplacementsThirdpartyVehicleData.error){ return { status: false, code: 500, message: getReplacementsThirdpartyVehicleData.error }; }
                if(getReplacementsThirdpartyVehicleData.result.rowsAffected > 0){
                    for(let i = 0; i < getReplacementsThirdpartyVehicleData.result.recordset.length; i++){
                        let replacement = {
                            crepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].CREPUESTO,
                            xrepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].XREPUESTO,
                            ctiporepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].CTIPOREPUESTO,
                            xtiporepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].XTIPOREPUESTO,
                            ncantidad: getReplacementsThirdpartyVehicleData.result.recordset[i].NCANTIDAD,
                            cniveldano: getReplacementsThirdpartyVehicleData.result.recordset[i].CNIVELDANO,
                            xniveldano: getReplacementsThirdpartyVehicleData.result.recordset[i].XNIVELDANO
                        }
                        thirdpartyReplacements.push(replacement);
                    }
                }
            }
        }
        return {
            status: true,
            cnotificacion: searchData.cnotificacion,
            thirdpartyReplacements: thirdpartyReplacements,
            replacements: replacements
        }
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/search/provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchProvider' } });
        });
    }
});

const operationSearchProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cproveedor'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cproveedor: requestBody.cproveedor
    }
    let getServicesByNotificationTypeData = await bd.getServicesByNotificationTypeDataQuery().then((res) => res);
    if(getServicesByNotificationTypeData.error){ return  { status: false, code: 500, message: getServicesByNotificationTypeData.error }; }
    if(getServicesByNotificationTypeData.result.rowsAffected > 0){
        let getProvidersByServicesData = await bd.getProvidersByServicesDataQuery().then((res) => res);
        if(getProvidersByServicesData.error){ return  { status: false, code: 500, message: getProvidersByServicesData.error }; }
        if(getProvidersByServicesData.result.rowsAffected > 0){
            let jsonList = [];
            for(let i = 0; i < getProvidersByServicesData.result.recordset.length; i++){
                jsonList.push({
                    cproveedor: getProvidersByServicesData.result.recordset[i].CPROVEEDOR,
                    xdocidentidad: getProvidersByServicesData.result.recordset[i].XDOCIDENTIDAD,
                    xnombre: getProvidersByServicesData.result.recordset[i].XNOMBRE,
                    xtelefonoproveedor: getProvidersByServicesData.result.recordset[i].XTELEFONO,
                });
            }
            console.log(jsonList)
            return { status: true, list: jsonList };
        }else{ return { status: false, code: 404, message: 'Provider not found.' }; }
    }else{ return { status: false, code: 404, message: 'Notification Type Services not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateNotification(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateNotification' } });
        });
    }
});

const operationCreateNotification = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccontratoflota', 'ctiponotificacion', 'ccausasiniestro', 'xnombre', 'xapellido', 'xtelefono', 'bdano', 'btransitar', 'bdanootro', 'blesionado', 'bpropietario', 'fevento', 'cestado', 'cciudad', 'xdireccion', 'xdescripcion', 'btransito', 'bcarga', 'bpasajero', 'xobservacion', 'ctiposeguimiento', 'cmotivoseguimiento', 'fseguimientonotificacion', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notes = [];
    if(requestBody.notes){
        notes = requestBody.notes;
        for(let i = 0; i < notes.length; i++){
            if(!helper.validateRequestObj(notes[i], ['xnotanotificacion', 'xrutaarchivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            notes[i].xnotanotificacion = helper.encrypt(notes[i].xnotanotificacion.toUpperCase());
        }
    }
    let replacements = [];
    if(requestBody.replacements){
        replacements = requestBody.replacements;
        for(let i = 0; i < replacements.length; i++){
            if(!helper.validateRequestObj(replacements[i], ['crepuesto', 'ctiporepuesto', 'ncantidad', 'cniveldano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
        }
    }
    let thirdparties = [];
    if(requestBody.thirdparties){
        thirdparties = requestBody.thirdparties;
        for(let i = 0; i < thirdparties.length; i++){
            if(!helper.validateRequestObj(thirdparties[i], ['ctipodocidentidad', 'xdocidentidad', 'xnombre', 'xapellido', 'xtelefonocelular', 'xemail', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            thirdparties[i].xdocidentidad = helper.encrypt(thirdparties[i].xdocidentidad);
            thirdparties[i].xnombre = helper.encrypt(thirdparties[i].xnombre.toUpperCase());
            thirdparties[i].xapellido = helper.encrypt(thirdparties[i].xapellido.toUpperCase());
            thirdparties[i].xtelefonocelular = helper.encrypt(thirdparties[i].xtelefonocelular);
            thirdparties[i].xtelefonocasa = thirdparties[i].xtelefonocasa ? helper.encrypt(thirdparties[i].xtelefonocasa) : undefined;
            thirdparties[i].xemail = helper.encrypt(thirdparties[i].xemail.toUpperCase());
            thirdparties[i].xobservacion = helper.encrypt(thirdparties[i].xobservacion.toUpperCase());
            if(thirdparties[i].tracings)
            for(let j = 0; j < thirdparties[i].tracings.length; j++){
                if(!helper.validateRequestObj(thirdparties[i].tracings[j], ['ctiposeguimiento', 'cmotivoseguimiento', 'fseguimientotercero', 'bcerrado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                thirdparties[i].tracings[j].xobservacion = thirdparties[i].tracings[j].xobservacion ? helper.encrypt(thirdparties[i].tracings[j].xobservacion.toUpperCase()) : undefined;
            }
        }
    }
    let materialDamages = [];
    if(requestBody.materialDamages){
        materialDamages = requestBody.materialDamages;
        for(let i = 0; i < materialDamages.length; i++){
            if(!helper.validateRequestObj(materialDamages[i], ['cdanomaterial', 'cniveldano', 'xobservacion', 'ctipodocidentidad', 'xdocidentidad', 'xnombre', 'xapellido', 'xtelefonocelular', 'xemail', 'cestado', 'cciudad', 'xdireccion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            materialDamages[i].xobservacion = helper.encrypt(materialDamages[i].xobservacion.toUpperCase());
            materialDamages[i].xdocidentidad = helper.encrypt(materialDamages[i].xdocidentidad);
            materialDamages[i].xnombre = helper.encrypt(materialDamages[i].xnombre.toUpperCase());
            materialDamages[i].xapellido = helper.encrypt(materialDamages[i].xapellido.toUpperCase());
            materialDamages[i].xtelefonocelular = helper.encrypt(materialDamages[i].xtelefonocelular);
            materialDamages[i].xtelefonocasa = materialDamages[i].xtelefonocasa ? helper.encrypt(materialDamages[i].xtelefonocasa) : undefined;
            materialDamages[i].xemail = helper.encrypt(materialDamages[i].xemail.toUpperCase());
            materialDamages[i].xdireccion = helper.encrypt(materialDamages[i].xdireccion.toUpperCase());
        }
    }
    let thirdpartyVehicles = [];
    if(requestBody.thirdpartyVehicles){
        thirdpartyVehicles = requestBody.thirdpartyVehicles;
        for(let i = 0; i < thirdpartyVehicles.length; i++){
            if(!helper.validateRequestObj(thirdpartyVehicles[i], ['ctipodocidentidadconductor', 'xdocidentidadconductor', 'xnombreconductor', 'xapellidoconductor', 'xtelefonocelularconductor', 'xemailconductor', 'xobservacionconductor', 'xplaca', 'cmarca', 'cmodelo', 'cversion', 'fano', 'ccolor', 'xobservacionvehiculo', 'ctipodocidentidadpropietario', 'xdocidentidadpropietario', 'xnombrepropietario', 'xapellidopropietario', 'cestado', 'cciudad', 'xdireccion', 'xtelefonocelularpropietario', 'xemailpropietario', 'xobservacionpropietario'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            thirdpartyVehicles[i].xdocidentidadconductor = helper.encrypt(thirdpartyVehicles[i].xdocidentidadconductor);
            thirdpartyVehicles[i].xnombreconductor = helper.encrypt(thirdpartyVehicles[i].xnombreconductor.toUpperCase());
            thirdpartyVehicles[i].xapellidoconductor = helper.encrypt(thirdpartyVehicles[i].xapellidoconductor.toUpperCase());
            thirdpartyVehicles[i].xtelefonocelularconductor = helper.encrypt(thirdpartyVehicles[i].xtelefonocelularconductor);
            thirdpartyVehicles[i].xtelefonocasaconductor = thirdpartyVehicles[i].xtelefonocasaconductor ? helper.encrypt(thirdpartyVehicles[i].xtelefonocasaconductor) : undefined;
            thirdpartyVehicles[i].xemailconductor = helper.encrypt(thirdpartyVehicles[i].xemailconductor.toUpperCase());
            thirdpartyVehicles[i].xobservacionconductor = helper.encrypt(thirdpartyVehicles[i].xobservacionconductor.toUpperCase());
            thirdpartyVehicles[i].xplaca = helper.encrypt(thirdpartyVehicles[i].xplaca);
            thirdpartyVehicles[i].xobservacionvehiculo = helper.encrypt(thirdpartyVehicles[i].xobservacionvehiculo.toUpperCase());
            thirdpartyVehicles[i].xdocidentidadpropietario = helper.encrypt(thirdpartyVehicles[i].xdocidentidadpropietario);
            thirdpartyVehicles[i].xnombrepropietario = helper.encrypt(thirdpartyVehicles[i].xnombrepropietario.toUpperCase());
            thirdpartyVehicles[i].xapellidopropietario = helper.encrypt(thirdpartyVehicles[i].xapellidopropietario.toUpperCase());
            thirdpartyVehicles[i].xtelefonocelularpropietario = helper.encrypt(thirdpartyVehicles[i].xtelefonocelularpropietario);
            thirdpartyVehicles[i].xtelefonocasapropietario = thirdpartyVehicles[i].xtelefonocasapropietario ? helper.encrypt(thirdpartyVehicles[i].xtelefonocasapropietario) : undefined;
            thirdpartyVehicles[i].xemailpropietario = helper.encrypt(thirdpartyVehicles[i].xemailpropietario.toUpperCase());
            thirdpartyVehicles[i].xobservacionpropietario = helper.encrypt(thirdpartyVehicles[i].xobservacionpropietario.toUpperCase());
            thirdpartyVehicles[i].xdireccion = helper.encrypt(thirdpartyVehicles[i].xdireccion.toUpperCase());
            if(thirdpartyVehicles[i].replacements)
            for(let j = 0; j < thirdpartyVehicles[i].replacements.length; j++){
                if(!helper.validateRequestObj(thirdpartyVehicles[i].replacements[j], ['crepuesto', 'ctiporepuesto', 'cniveldano', 'ncantidad'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
        }
    }
    let serviceOrder = [];
    if(requestBody.serviceOrder){
        serviceOrder = requestBody.serviceOrder;
        for(let i = 0; i < serviceOrder.length; i++){
            if(!helper.validateRequestObj(requestBody, ['cservicio','cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            cnotificacion = parseInt(requestBody.cnotificacion, 10),
            cservicio = parseInt(requestBody.cnotificacion, 10);
        }
    }
    let notificationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        thirdpartyVehicles: thirdpartyVehicles ? thirdpartyVehicles : undefined,
        notes: notes ? notes : undefined,
        serviceOrder: serviceOrder ? serviceOrder : undefined,
        replacements: replacements ? replacements : undefined,
        thirdparties: thirdparties ? thirdparties : undefined,
        materialDamages: materialDamages ? materialDamages : undefined,
        ccontratoflota: requestBody.ccontratoflota,
        ctiponotificacion: requestBody.ctiponotificacion,
        crecaudo: requestBody.crecaudo,
        ccausasiniestro: requestBody.ccausasiniestro,
        xnombre: requestBody.xnombre.toUpperCase(),
        xapellido: requestBody.xapellido.toUpperCase(),
        xtelefono: requestBody.xtelefono,
        xnombrealternativo: requestBody.xnombrealternativo ? requestBody.xnombrealternativo.toUpperCase() : undefined,
        xapellidoalternativo: requestBody.xapellidoalternativo ? requestBody.xapellidoalternativo.toUpperCase() : undefined,
        xtelefonoalternativo: requestBody.xtelefonoalternativo ? requestBody.xtelefonoalternativo : undefined,
        bdano: requestBody.bdano,
        btransitar: requestBody.btransitar,
        bdanootro: requestBody.bdanootro,
        blesionado: requestBody.blesionado,
        bpropietario: requestBody.bpropietario,
        fevento: requestBody.fevento,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccion: requestBody.xdireccion.toUpperCase(),
        xdescripcion: requestBody.xdescripcion.toUpperCase(),
        btransito: requestBody.btransito,
        bcarga: requestBody.bcarga,
        bpasajero: requestBody.bpasajero,
        npasajero: requestBody.npasajero ? requestBody.npasajero : undefined,
        xobservacion: requestBody.xobservacion.toUpperCase(),
        ctiposeguimiento: requestBody.ctiposeguimiento,
        cmotivoseguimiento: requestBody.cmotivoseguimiento,
        fseguimientonotificacion: requestBody.fseguimientonotificacion,
        xobservacionseguimiento: requestBody.xobservacionseguimiento ? requestBody.xobservacionseguimiento.toUpperCase() : undefined,
        bactivo: true,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let createNotification = await bd.createNotificationQuery(notificationData).then((res) => res);
    if(createNotification.error){return { status: false, code: 500, message: createNotification.error }; }
    if(createNotification.result.rowsAffected > 0){ return { status: true, cnotificacion: createNotification.result.recordset[0].CNOTIFICACION }; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createNotification' }; }
}

router.route('/notification-owner').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationOwner(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotificationOwner' } });
        });
    }
});

const operationValrepNotificationOwner = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cnotificacion = requestBody.cnotificacion;
    let query = await bd.notificationOwnerDetailQuery(cnotificacion).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    //for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cnotificacion: query.result.recordset[0].CNOTIFICACION, ccontratoflota: query.result.recordset[0].CCONTRATOFLOTA, xnombre: query.result.recordset[0].XNOMBRE, xapellido: query.result.recordset[0].XAPELLIDO, xnombrealternativo: query.result.recordset[0].XNOMBREALTERNATIVO, xapellidoalternativo: query.result.recordset[0].XAPELLIDOALTERNATIVO, fcreacion: query.result.recordset[0].FCREACION, xobservacion: query.result.recordset[0].XOBSERVACION, xdanos: query.result.recordset[0].XDANOS, xfecha: query.result.recordset[0].XFECHA, fajuste: query.result.recordset[0].FAJUSTE, xmarca: query.result.recordset[0].XMARCA, xdescripcion: query.result.recordset[0].XDESCRIPCION, xdanos: query.result.recordset[0].XDANOS, xfecha: query.result.recordset[0].XFECHA, xnombrepropietario: query.result.recordset[0].XNOMBREPROPIETARIO, xapellidopropietario: query.result.recordset[0].XAPELLIDOPROPIETARIO, xapellidopropietario: query.result.recordset[0].XAPELLIDOPROPIETARIO, xdocidentidad: query.result.recordset[0].XDOCIDENTIDAD, xtelefonocelular: query.result.recordset[0].XTELEFONOCELULAR, xplaca: query.result.recordset[0].XPLACA, xcolor: query.result.recordset[0].XCOLOR, xmodelo: query.result.recordset[0].XMODELO, xcliente: query.result.recordset[0].XCLIENTE, fano: query.result.recordset[0].FANO, cservicio: query.result.recordset[0].CSERVICIO, cproveedor: query.result.recordset[0].CPROVEEDOR, xdireccionproveedor: query.result.recordset[0].XDIRECCIONPROVEEDOR, xnombreproveedor: query.result.recordset[0].XNOMBREPROVEEDOR, cservicioadicional: query.result.recordset[0].CSERVICIOADICIONAL, xservicioadicional: query.result.recordset[0].XSERVICIOADICIONAL, xdocumentocliente: query.result.recordset[0].XDOCIDENTIDADCLIENTE, xdireccionfiscal: query.result.recordset[0].XDIRECCIONFISCAL, xtelefono: query.result.recordset[0].XTELEFONO, xtelefonoproveedor: query.result.recordset[0].XTELEFONOPROVEEDOR, xdocumentoproveedor: query.result.recordset[0].XDOCIDENTIDADPROVEEDOR, xservicio: query.result.recordset[0].XSERVICIO, xdesde: query.result.recordset[0].XDESDE, xhacia: query.result.recordset[0].XHACIA, mmonto: query.result.recordset[0].MMONTO, mmontototal: query.result.recordset[0].MMONTOTOTAL, pimpuesto: query.result.recordset[0].PIMPUESTO, mmontototaliva: query.result.recordset[0].MMONTOTOTALIVA,mmontototaliva: query.result.recordset[0].MMONTOTOTALIVA, cmoneda: query.result.recordset[0].CMONEDA ,xmoneda: query.result.recordset[0].xmoneda, bactivo: query.result.recordset[0].BACTIVO, fcreacion: query.result.recordset[0].FCREACION, xtiponotificacion: query.result.recordset[0].XTIPONOTIFICACION, xserialcarroceria: query.result.recordset[0].XSERIALCARROCERIA, ctiponotificacion: query.result.recordset[0].CTIPONOTIFICACION});
    //}
    return { status: true, list: jsonArray }
}

router.route('/notification-collections').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotificationCollections' } });
        });
    }
});

const operationValrepNotificationCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let ctiponotificacion = requestBody.ctiponotificacion;
    let query = await bd.notificationCollectionsDetailQuery(ctiponotificacion).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ crecaudo: query.result.recordset[i].CRECAUDO, xrecaudo: query.result.recordset[i].XRECAUDO });
    }
    return { status: true, list: jsonArray }
}

router.route('/notification-documentation').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationDocumentation(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotificationDocumentation' } });
        });
    }
});

const operationValrepNotificationDocumentation = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['ctiponotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let crecaudo = requestBody.crecaudo;
    let query = await bd.notificationDocumentationDetailQuery(crecaudo).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cdocumento: query.result.recordset[i].CDOCUMENTO, xdocumentos: query.result.recordset[i].XDOCUMENTOS, ncantidad: query.result.recordset[i].NCANTIDAD });
    }
    return { status: true, list: jsonArray }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailNotification(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailNotification' } });
        });
    }
});

const operationDetailNotification = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cnotificacion: requestBody.cnotificacion
    };
    let getNotificationData = await bd.getNotificationDataQuery(notificationData).then((res) => res);
    if(getNotificationData.error){ return { status: false, code: 500, message: getNotificationData.error }; }
    if(getNotificationData.result.rowsAffected > 0){
        let getFleetContractCompleteData = await bd.getFleetContractCompleteDataQuery(getNotificationData.result.recordset[0].CCONTRATOFLOTA, notificationData).then((res) => res);
        if(getFleetContractCompleteData.error){ return { status: false, code: 500, message: getFleetContractWorkerData.error }; }
        let telefonopropietario;
        if(getFleetContractCompleteData.result.recordset[0].XTELEFONOCELULAR){
            telefonopropietario = getFleetContractCompleteData.result.recordset[0].XTELEFONOCELULAR;
        }else{
            telefonopropietario = getFleetContractCompleteData.result.recordset[0].XTELEFONOCASA
        }
        console.log(telefonopropietario)
        if(getFleetContractCompleteData.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Data not found.' }; }
        let notes = [];
        let getNotificationNotesData = await bd.getNotificationNotesDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationNotesData.error){ return { status: false, code: 500, message: getNotificationNotesData.error }; }
        if(getNotificationNotesData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationNotesData.result.recordset.length; i++){
                let note = {
                    cnotanotificacion: getNotificationNotesData.result.recordset[i].CNOTANOTIFICACION,
                    xnotanotificacion: getNotificationNotesData.result.recordset[i].XNOTANOTIFICACION,
                    xrutaarchivo: getNotificationNotesData.result.recordset[i].XRUTAARCHIVO,
                    cfiniquito: getNotificationNotesData.result.recordset[i].CFINIQUITO,
                    xcausafiniquito: getNotificationNotesData.result.recordset[i].XCAUSAFINIQUITO,
                }
                notes.push(note);
            }
        }
        let replacements = [];
        let getNotificationReplacementsData = await bd.getNotificationReplacementsDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationReplacementsData.error){ return { status: false, code: 500, message: getNotificationReplacementsData.error }; }
        if(getNotificationReplacementsData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationReplacementsData.result.recordset.length; i++){
                let replacement = {
                    crepuesto: getNotificationReplacementsData.result.recordset[i].CREPUESTO,
                    xrepuesto: getNotificationReplacementsData.result.recordset[i].XREPUESTO,
                    ctiporepuesto: getNotificationReplacementsData.result.recordset[i].CTIPOREPUESTO,
                    ncantidad: getNotificationReplacementsData.result.recordset[i].NCANTIDAD,
                    cniveldano: getNotificationReplacementsData.result.recordset[i].CNIVELDANO
                }
                replacements.push(replacement);
            }
        }
        let materialDamages = [];
        let getNotificationMaterialDamagesData = await bd.getNotificationMaterialDamagesDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationMaterialDamagesData.error){ return { status: false, code: 500, message: getNotificationMaterialDamagesData.error }; }
        if(getNotificationMaterialDamagesData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationMaterialDamagesData.result.recordset.length; i++){
                let materialDamage = {
                    cdanomaterialnotificacion: getNotificationMaterialDamagesData.result.recordset[i].CDANOMATERIALNOTIFICACION,
                    cdanomaterial: getNotificationMaterialDamagesData.result.recordset[i].CDANOMATERIAL,
                    xdanomaterial: getNotificationMaterialDamagesData.result.recordset[i].XDANOMATERIAL,
                    cniveldano: getNotificationMaterialDamagesData.result.recordset[i].CNIVELDANO,
                    xniveldano: getNotificationMaterialDamagesData.result.recordset[i].XNIVELDANO,
                    xobservacion: getNotificationMaterialDamagesData.result.recordset[i].XOBSERVACION,
                    ctipodocidentidad: getNotificationMaterialDamagesData.result.recordset[i].CTIPODOCIDENTIDAD,
                    xdocidentidad: getNotificationMaterialDamagesData.result.recordset[i].XDOCIDENTIDAD,
                    xnombre: getNotificationMaterialDamagesData.result.recordset[i].XNOMBRE,
                    xapellido: getNotificationMaterialDamagesData.result.recordset[i].XAPELLIDO,
                    cestado: getNotificationMaterialDamagesData.result.recordset[i].CESTADO,
                    cciudad: getNotificationMaterialDamagesData.result.recordset[i].CCIUDAD,
                    xdireccion: getNotificationMaterialDamagesData.result.recordset[i].XDIRECCION,
                    xtelefonocelular: getNotificationMaterialDamagesData.result.recordset[i].XTELEFONOCELULAR,
                    xtelefonocasa: getNotificationMaterialDamagesData.result.recordset[i].XTELEFONOCASA ? getNotificationMaterialDamagesData.result.recordset[i].XTELEFONOCASA : undefined,
                    xemail: getNotificationMaterialDamagesData.result.recordset[i].XEMAIL
                }
                materialDamages.push(materialDamage);
            }
        }
        let thirdPartyTracings = [];
        let thirdparties = [];
        let getNotificationThirdpartiesData = await bd.getNotificationThirdpartiesDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationThirdpartiesData.error){ return { status: false, code: 500, message: getNotificationThirdpartiesData.error }; }
        if(getNotificationThirdpartiesData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationThirdpartiesData.result.recordset.length; i++){
                let tracings = [];
                let getTracingsThirdpartyData = await bd.getTracingsThirdpartyDataQuery(getNotificationThirdpartiesData.result.recordset[i].CTERCERONOTIFICACION).then((res) => res);
                if(getTracingsThirdpartyData.error){ return { status: false, code: 500, message: getTracingsThirdpartyData.error }; }
                if(getTracingsThirdpartyData.result.rowsAffected > 0){
                    for(let i = 0; i < getTracingsThirdpartyData.result.recordset.length; i++){
                        let tracing = {
                            cseguimientotercero: getTracingsThirdpartyData.result.recordset[i].CSEGUIMIENTOTERCERO,
                            ctiposeguimiento: getTracingsThirdpartyData.result.recordset[i].CTIPOSEGUIMIENTO,
                            xtiposeguimiento: getTracingsThirdpartyData.result.recordset[i].XTIPOSEGUIMIENTO,
                            cmotivoseguimiento: getTracingsThirdpartyData.result.recordset[i].CMOTIVOSEGUIMIENTO,
                            xmotivoseguimiento: getTracingsThirdpartyData.result.recordset[i].XMOTIVOSEGUIMIENTO,
                            fseguimientotercero: getTracingsThirdpartyData.result.recordset[i].FSEGUIMIENTOTERCERO,
                            bcerrado: getTracingsThirdpartyData.result.recordset[i].BCERRADO,
                            xobservacion: getTracingsThirdpartyData.result.recordset[i].XOBSERVACION ? getTracingsThirdpartyData.result.recordset[i].XOBSERVACION : undefined
                        }
                        tracings.push(tracing);
                    }
                }
                thirdPartyTracings = tracings;
                let thirdparty = {
                    cterceronotificacion: getNotificationThirdpartiesData.result.recordset[i].CTERCERONOTIFICACION,
                    ctipodocidentidad: getNotificationThirdpartiesData.result.recordset[i].CTIPODOCIDENTIDAD,
                    xdocidentidad: getNotificationThirdpartiesData.result.recordset[i].XDOCIDENTIDAD,
                    xnombre: getNotificationThirdpartiesData.result.recordset[i].XNOMBRE,
                    xapellido: getNotificationThirdpartiesData.result.recordset[i].XAPELLIDO,
                    xtelefonocelular: getNotificationThirdpartiesData.result.recordset[i].XTELEFONOCELULAR,
                    xtelefonocasa: getNotificationThirdpartiesData.result.recordset[i].XTELEFONOCASA ? getNotificationThirdpartiesData.result.recordset[i].XTELEFONOCASA : undefined,
                    xemail: getNotificationThirdpartiesData.result.recordset[i].XEMAIL,
                    xobservacion: getNotificationThirdpartiesData.result.recordset[i].XOBSERVACION,
                    tracings: tracings
                }
                thirdparties.push(thirdparty);
            }
        }
        let thirdpartyVehicles = [];
        let getNotificationThirdpartyVehiclesData = await bd.getNotificationThirdpartyVehiclesDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationThirdpartyVehiclesData.error){ return { status: false, code: 500, message: getNotificationThirdpartyVehiclesData.error }; }
        if(getNotificationThirdpartyVehiclesData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationThirdpartyVehiclesData.result.recordset.length; i++){
                let replacements = [];
                let getReplacementsThirdpartyVehicleData = await bd.getReplacementsThirdpartyVehicleDataQuery(getNotificationThirdpartyVehiclesData.result.recordset[i].CVEHICULOTERCERONOTIFICACION).then((res) => res);
                if(getReplacementsThirdpartyVehicleData.error){ return { status: false, code: 500, message: getReplacementsThirdpartyVehicleData.error }; }
                if(getReplacementsThirdpartyVehicleData.result.rowsAffected > 0){
                    for(let i = 0; i < getReplacementsThirdpartyVehicleData.result.recordset.length; i++){
                        let replacement = {
                            crepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].CREPUESTO,
                            xrepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].XREPUESTO,
                            ctiporepuesto: getReplacementsThirdpartyVehicleData.result.recordset[i].CTIPOREPUESTO,
                            ncantidad: getReplacementsThirdpartyVehicleData.result.recordset[i].NCANTIDAD,
                            cniveldano: getReplacementsThirdpartyVehicleData.result.recordset[i].CNIVELDANO
                        }
                        replacements.push(replacement);
                    }
                }
                let thirdpartyVehicle = {
                    cvehiculoterceronotificacion: getNotificationThirdpartyVehiclesData.result.recordset[i].CVEHICULOTERCERONOTIFICACION,
                    ctipodocidentidadconductor: getNotificationThirdpartyVehiclesData.result.recordset[i].CTIPODOCIDENTIDADCONDUCTOR,
                    xdocidentidadconductor: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XDOCIDENTIDADCONDUCTOR),
                    xnombreconductor: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XNOMBRECONDUCTOR),
                    xapellidoconductor: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XAPELLIDOCONDUCTOR),
                    xtelefonocelularconductor: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XTELEFONOCELULARCONDUCTOR),
                    xtelefonocasaconductor: getNotificationThirdpartyVehiclesData.result.recordset[i].XTELEFONOCASACONDUCTOR ? helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XTELEFONOCASACONDUCTOR) : undefined,
                    xemailconductor: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XEMAILCONDUCTOR),
                    xobservacionconductor: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XOBSERVACIONCONDUCTOR),
                    xplaca: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XPLACA),
                    cmarca: getNotificationThirdpartyVehiclesData.result.recordset[i].CMARCA,
                    xmarca: getNotificationThirdpartyVehiclesData.result.recordset[i].XMARCA,
                    cmodelo: getNotificationThirdpartyVehiclesData.result.recordset[i].CMODELO,
                    xmodelo: getNotificationThirdpartyVehiclesData.result.recordset[i].XMODELO,
                    cversion: getNotificationThirdpartyVehiclesData.result.recordset[i].CVERSION,
                    xversion: getNotificationThirdpartyVehiclesData.result.recordset[i].XVERSION,
                    fano: getNotificationThirdpartyVehiclesData.result.recordset[i].FANO,
                    ccolor: getNotificationThirdpartyVehiclesData.result.recordset[i].CCOLOR,
                    xobservacionvehiculo: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XOBSERVACIONVEHICULO),
                    ctipodocidentidadpropietario: getNotificationThirdpartyVehiclesData.result.recordset[i].CTIPODOCIDENTIDADPROPIETARIO,
                    xdocidentidadpropietario: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XDOCIDENTIDADPROPIETARIO),
                    xnombrepropietario: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XNOMBREPROPIETARIO),
                    xapellidopropietario: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XAPELLIDOPROPIETARIO),
                    cestado: getNotificationThirdpartyVehiclesData.result.recordset[i].CESTADO,
                    cciudad: getNotificationThirdpartyVehiclesData.result.recordset[i].CCIUDAD,
                    xdireccion: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XDIRECCION),
                    xtelefonocelularpropietario: telefonopropietario,
                    xtelefonocasapropietario: telefonopropietario,
                    xemailpropietario: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XEMAILPROPIETARIO),
                    xobservacionpropietario: helper.decrypt(getNotificationThirdpartyVehiclesData.result.recordset[i].XOBSERVACIONPROPIETARIO),
                    replacements: replacements
                }
                thirdpartyVehicles.push(thirdpartyVehicle);
            }
        }
        let providers = [];
        let getNotificationProvidersData = await bd.getNotificationProvidersDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationProvidersData.error){ return { status: false, code: 500, message: getNotificationProvidersData.error }; }
        if(getNotificationProvidersData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationProvidersData.result.recordset.length; i++){
                let replacements = [];
                let getReplacementsProviderData = await bd.getReplacementsProviderDataQuery(getNotificationProvidersData.result.recordset[i].CCOTIZACION).then((res) => res);
                if(getReplacementsProviderData.error){ return { status: false, code: 500, message: getReplacementsProviderData.error }; }
                if(getReplacementsProviderData.result.rowsAffected > 0){
                    for(let i = 0; i < getReplacementsProviderData.result.recordset.length; i++){
                        let replacement = {
                            crepuestocptizacion: getReplacementsProviderData.result.recordset[i].CREPUESTOCOTIZACION,
                            crepuesto: getReplacementsProviderData.result.recordset[i].CREPUESTO,
                            xrepuesto: getReplacementsProviderData.result.recordset[i].XREPUESTO,
                            ctiporepuesto: getReplacementsProviderData.result.recordset[i].CTIPOREPUESTO,
                            xtiporepuesto: getReplacementsProviderData.result.recordset[i].XTIPOREPUESTO,
                            ncantidad: getReplacementsProviderData.result.recordset[i].NCANTIDAD,
                            cniveldano: getReplacementsProviderData.result.recordset[i].CNIVELDANO,
                            xniveldano: getReplacementsProviderData.result.recordset[i].XNIVELDANO
                        }
                        replacements.push(replacement);
                    }
                }
                let provider = {
                    ccotizacion: getNotificationProvidersData.result.recordset[i].CCOTIZACION,
                    cproveedor: getNotificationProvidersData.result.recordset[i].CPROVEEDOR,
                    xnombre: getNotificationProvidersData.result.recordset[i].XNOMBRE,
                    xobservacion: getNotificationProvidersData.result.recordset[i].XOBSERVACION,
                    replacements: replacements
                }
                providers.push(provider);
            }
        }
        let quotes = [];
        let getNotificationQuotesData = await bd.getNotificationQuotesDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationQuotesData.error){ return { status: false, code: 500, message: getNotificationQuotesData.error }; }
        if(getNotificationQuotesData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationQuotesData.result.recordset.length; i++){
                let replacements = [];
                let getReplacementsQuoteData = await bd.getReplacementsProviderDataQuery(getNotificationQuotesData.result.recordset[i].CCOTIZACION).then((res) => res);
                if(getReplacementsQuoteData.error){ return { status: false, code: 500, message: getReplacementsQuoteData.error }; }
                if(getReplacementsQuoteData.result.rowsAffected > 0){
                    for(let i = 0; i < getReplacementsQuoteData.result.recordset.length; i++){
                        let replacement = {
                            crepuestocotizacion: getReplacementsQuoteData.result.recordset[i].CREPUESTOCOTIZACION,
                            crepuesto: getReplacementsQuoteData.result.recordset[i].CREPUESTO,
                            xrepuesto: getReplacementsQuoteData.result.recordset[i].XREPUESTO,
                            ctiporepuesto: getReplacementsQuoteData.result.recordset[i].CTIPOREPUESTO,
                            ncantidad: getReplacementsQuoteData.result.recordset[i].NCANTIDAD,
                            cniveldano: getReplacementsQuoteData.result.recordset[i].CNIVELDANO,
                            bdisponible: getReplacementsQuoteData.result.recordset[i].BDISPONIBLE ? getReplacementsQuoteData.result.recordset[i].BDISPONIBLE : undefined,
                            munitariorepuesto: getReplacementsQuoteData.result.recordset[i].MUNITARIOREPUESTO ? getReplacementsQuoteData.result.recordset[i].MUNITARIOREPUESTO : undefined,
                            bdescuento: getReplacementsQuoteData.result.recordset[i].BDESCUENTO ? getReplacementsQuoteData.result.recordset[i].BDESCUENTO : undefined,
                            mtotalrepuesto: getReplacementsQuoteData.result.recordset[i].MTOTALREPUESTO ? getReplacementsQuoteData.result.recordset[i].MTOTALREPUESTO : undefined
                        }
                        replacements.push(replacement);
                    }
                }
                let quote = {
                    ccotizacion: getNotificationQuotesData.result.recordset[i].CCOTIZACION,
                    cproveedor: getNotificationQuotesData.result.recordset[i].CPROVEEDOR,
                    xnombre: getNotificationQuotesData.result.recordset[i].XNOMBRE,
                    xobservacion: getNotificationQuotesData.result.recordset[i].XOBSERVACION,
                    mtotalcotizacion: getNotificationQuotesData.result.recordset[i].MTOTALCOTIZACION,
                    bcerrada: getNotificationQuotesData.result.recordset[i].BCERRADA,
                    baceptacion: getNotificationQuotesData.result.recordset[i].BACEPTACION,
                    mmontoiva: getNotificationQuotesData.result.recordset[i].MMONTOIVA,
                    mtotal: getNotificationQuotesData.result.recordset[i].MTOTAL,
                    cimpuesto: getNotificationQuotesData.result.recordset[i].CIMPUESTO,
                    pimpuesto: getNotificationQuotesData.result.recordset[i].PIMPUESTO,
                    replacements: replacements
                }
                quotes.push(quote);
            }
        }
        let tracings = [];
        let getNotificationTracingsData = await bd.getNotificationTracingsDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationTracingsData.error){ return { status: false, code: 500, message: getNotificationTracingsData.error }; }
        if(getNotificationTracingsData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationTracingsData.result.recordset.length; i++){
                let tracing = {
                    cseguimientonotificacion: getNotificationTracingsData.result.recordset[i].CSEGUIMIENTONOTIFICACION,
                    ctiposeguimiento: getNotificationTracingsData.result.recordset[i].CTIPOSEGUIMIENTO,
                    xtiposeguimiento: getNotificationTracingsData.result.recordset[i].XTIPOSEGUIMIENTO,
                    cmotivoseguimiento: getNotificationTracingsData.result.recordset[i].CMOTIVOSEGUIMIENTO,
                    xmotivoseguimiento: getNotificationTracingsData.result.recordset[i].XMOTIVOSEGUIMIENTO,
                    fseguimientonotificacion: getNotificationTracingsData.result.recordset[i].FSEGUIMIENTONOTIFICACION,
                    bcerrado: getNotificationTracingsData.result.recordset[i].BCERRADO,
                    xobservacion: getNotificationTracingsData.result.recordset[i].XOBSERVACION ? helper.decrypt(getNotificationTracingsData.result.recordset[i].XOBSERVACION) : undefined
                }
                tracings.push(tracing);
            }
        }
        let serviceOrder = [];
        let getNotificationServiceOrderData = await bd.getNotificationServiceOrderDataQuery(notificationData.cnotificacion).then((res) => res);
        if(getNotificationServiceOrderData.error){ return { status: false, code: 500, message: getNotificationServiceOrderData.error }; }
        if(getNotificationServiceOrderData.result.rowsAffected > 0){
            for(let i = 0; i < getNotificationServiceOrderData.result.recordset.length; i++){
                let serviceOrderList = {
                    cnotificacion: getNotificationServiceOrderData.result.recordset[i].CNOTIFICACION,
                    corden: getNotificationServiceOrderData.result.recordset[i].CORDEN,
                    cservicio: getNotificationServiceOrderData.result.recordset[i].CSERVICIO,
                    xservicio: getNotificationServiceOrderData.result.recordset[i].XSERVICIO,
                    xservicioadicional: getNotificationServiceOrderData.result.recordset[i].XSERVICIOADICIONAL,
                    xobservacion: getNotificationServiceOrderData.result.recordset[i].XOBSERVACION,
                    xfecha: getNotificationServiceOrderData.result.recordset[i].XFECHA,
                    xdanos: getNotificationServiceOrderData.result.recordset[i].XDANOS,
                    fajuste: getNotificationServiceOrderData.result.recordset[i].FAJUSTE,
                    cmoneda: getNotificationServiceOrderData.result.recordset[i].CMONEDA,
                    xmoneda: getNotificationServiceOrderData.result.recordset[i].xmoneda,
                    cproveedor: getNotificationServiceOrderData.result.recordset[i].CPROVEEDOR,
                    bactivo: getNotificationServiceOrderData.result.recordset[i].BACTIVO
                }
                serviceOrder.push(serviceOrderList);
            }
        }
        return {
            status: true,
            cnotificacion: notificationData.cnotificacion,
            ccontratoflota: getNotificationData.result.recordset[0].CCONTRATOFLOTA,
            ctiponotificacion: getNotificationData.result.recordset[0].CTIPONOTIFICACION,
            crecaudo: getNotificationData.result.recordset[0].CRECAUDO,
            ccausasiniestro: getNotificationData.result.recordset[0].CCAUSASINIESTRO,
            xnombre: helper.decrypt(getNotificationData.result.recordset[0].XNOMBRE),
            xapellido: helper.decrypt(getNotificationData.result.recordset[0].XAPELLIDO),
            xtelefono: helper.decrypt(getNotificationData.result.recordset[0].XTELEFONO),
            xnombrealternativo: getNotificationData.result.recordset[0].XNOMBREALTERNATIVO ? helper.decrypt(getNotificationData.result.recordset[0].XNOMBREALTERNATIVO) : undefined,
            xapellidoalternativo: getNotificationData.result.recordset[0].XAPELLIDOALTERNATIVO ? helper.decrypt(getNotificationData.result.recordset[0].XAPELLIDOALTERNATIVO) : undefined,
            xtelefonoalternativo: getNotificationData.result.recordset[0].XTELEFONOALTERNATIVO ? helper.decrypt(getNotificationData.result.recordset[0].XTELEFONOALTERNATIVO) : undefined,
            bdano: getNotificationData.result.recordset[0].BDANO,
            btransitar: getNotificationData.result.recordset[0].BTRANSITAR,
            bdanootro: getNotificationData.result.recordset[0].BDANOOTRO,
            blesionado: getNotificationData.result.recordset[0].BLESIONADO,
            bpropietario: getNotificationData.result.recordset[0].BPROPIETARIO,
            fevento: getNotificationData.result.recordset[0].FEVENTO,
            cestado: getNotificationData.result.recordset[0].CESTADO,
            cciudad: getNotificationData.result.recordset[0].CCIUDAD,
            xdireccion: helper.decrypt(getNotificationData.result.recordset[0].XDIRECCION),
            xdescripcion: helper.decrypt(getNotificationData.result.recordset[0].XDESCRIPCION),
            btransito: getNotificationData.result.recordset[0].BTRANSITO,
            bcarga: getNotificationData.result.recordset[0].BCARGA,
            bpasajero: getNotificationData.result.recordset[0].BPASAJERO,
            npasajero: getNotificationData.result.recordset[0].NPASAJERO ? getNotificationData.result.recordset[0].NPASAJERO : undefined,
            xobservacion: helper.decrypt(getNotificationData.result.recordset[0].XOBSERVACION),
            xcliente: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XCLIENTE),
            cestatusgeneral: getFleetContractCompleteData.result.recordset[0].CESTATUSGENERAL,
            xestatusgeneral: getFleetContractCompleteData.result.recordset[0].XESTATUSGENERAL,
            fdesde_pol: helper.decrypt(getFleetContractCompleteData.result.recordset[0].FDESDE_POL),
            fhasta_pol: helper.decrypt(getFleetContractCompleteData.result.recordset[0].FHASTA_POL),
            xmarca: getFleetContractCompleteData.result.recordset[0].XMARCA,
            xmodelo: getFleetContractCompleteData.result.recordset[0].XMODELO,
            xtipo: getFleetContractCompleteData.result.recordset[0].XTIPO,
            xplaca: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XPLACA),
            fano: getFleetContractCompleteData.result.recordset[0].FANO,
            xcolor: getFleetContractCompleteData.result.recordset[0].XCOLOR,
            xserialcarroceria: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XSERIALCARROCERIA),
            xserialmotor: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XSERIALMOTOR),
            xnombrepropietario: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XNOMBRE),
            xapellidopropietario: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XAPELLIDO),
            xdocidentidadpropietario: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XDOCIDENTIDAD),
            xdireccionpropietario: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XDIRECCION),
            xtelefonocelularpropietario: telefonopropietario,
            xemailpropietario: helper.decrypt(getFleetContractCompleteData.result.recordset[0].XEMAIL),
            thirdpartyVehicles: thirdpartyVehicles,
            notes: notes,
            replacements: replacements,
            thirdparties: thirdparties,
            materialDamages: materialDamages,
            providers: providers,
            quotes: quotes,
            tracings: tracings,
            thirdPartyTracings: thirdPartyTracings,
            serviceOrder: serviceOrder
        }
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateNotification(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateNotification' } });
        });
    }
});

const operationUpdateNotification = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cnotificacion', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cnotificacion: requestBody.cnotificacion,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    if(requestBody.notes){
        if(requestBody.notes.create && requestBody.notes.create.length > 0){
            for(let i = 0; i < requestBody.notes.create.length; i++){
                if(!helper.validateRequestObj(requestBody.notes.create[i], ['xnotanotificacion', 'xrutaarchivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                requestBody.notes.create[i].xnotanotificacion = helper.encrypt(requestBody.notes.create[i].xnotanotificacion.toUpperCase());
            }
            let createNotesByNotificationUpdate = await bd.createNotesByNotificationUpdateQuery(requestBody.notes.create, notificationData).then((res) => res);
            if(createNotesByNotificationUpdate.error){ return { status: false, code: 500, message: createNotesByNotificationUpdate.error }; }
            if(createNotesByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createNotesByNotificationUpdate' }; }
        } 
        if(requestBody.notes.update && requestBody.notes.update.length > 0){
            for(let i = 0; i < requestBody.notes.update.length; i++){
                if(!helper.validateRequestObj(requestBody.notes.update[i], ['cnotanotificacion', 'xnotanotificacion', 'xrutaarchivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                requestBody.notes.update[i].xnotanotificacion = helper.encrypt(requestBody.notes.update[i].xnotanotificacion.toUpperCase());
            }
            let updateNotesByNotificationUpdate = await bd.updateNotesByNotificationUpdateQuery(requestBody.notes.update, notificationData).then((res) => res);
            if(updateNotesByNotificationUpdate.error){ return { status: false, code: 500, message: updateNotesByNotificationUpdate.error }; }
            if(updateNotesByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
        if(requestBody.notes.delete && requestBody.notes.delete.length){
            for(let i = 0; i < requestBody.notes.delete.length; i++){
                if(!helper.validateRequestObj(requestBody.notes.delete[i], ['cnotanotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
            let deleteNotesByNotificationUpdate = await bd.deleteNotesByNotificationUpdateQuery(requestBody.notes.delete, notificationData).then((res) => res);
            if(deleteNotesByNotificationUpdate.error){ return { status: false, code: 500, message: deleteNotesByNotificationUpdate.error }; }
            if(deleteNotesByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteNotesByNotificationUpdate' }; }
        }
    }
    if(requestBody.replacements){
        if(requestBody.replacements.create && requestBody.replacements.create.length > 0){
            for(let i = 0; i < requestBody.replacements.create.length; i++){
                if(!helper.validateRequestObj(requestBody.replacements.create[i], ['crepuesto', 'ctiporepuesto', 'ncantidad', 'cniveldano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
            let createReplacementsByNotificationUpdate = await bd.createReplacementsByNotificationUpdateQuery(requestBody.replacements.create, notificationData).then((res) => res);
            if(createReplacementsByNotificationUpdate.error){ return { status: false, code: 500, message: createReplacementsByNotificationUpdate.error }; }
            if(createReplacementsByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createReplacementsByNotificationUpdate' }; }
        } 
        if(requestBody.replacements.update && requestBody.replacements.update.length > 0){
            for(let i = 0; i < requestBody.replacements.update.length; i++){
                if(!helper.validateRequestObj(requestBody.replacements.update[i], ['crepuesto', 'ctiporepuesto', 'ncantidad', 'cniveldano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
            let updateReplacementsByNotificationUpdate = await bd.updateReplacementsByNotificationUpdateQuery(requestBody.replacements.update, notificationData).then((res) => res);
            if(updateReplacementsByNotificationUpdate.error){ return { status: false, code: 500, message: updateReplacementsByNotificationUpdate.error }; }
            if(updateReplacementsByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Replacement not found.' }; }
        }
        if(requestBody.replacements.delete && requestBody.replacements.delete.length){
            for(let i = 0; i < requestBody.replacements.delete.length; i++){
                if(!helper.validateRequestObj(requestBody.replacements.delete[i], ['crepuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            }
            let deleteReplacementsByNotificationUpdate = await bd.deleteReplacementsByNotificationUpdateQuery(requestBody.replacements.delete, notificationData).then((res) => res);
            if(deleteReplacementsByNotificationUpdate.error){ return { status: false, code: 500, message: deleteReplacementsByNotificationUpdate.error }; }
            if(deleteReplacementsByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteReplacementsByNotificationUpdate' }; }
        }
    }
    if(requestBody.thirdparties){
        if(requestBody.thirdparties.update && requestBody.thirdparties.update.length > 0){
            for(let i = 0; i < requestBody.thirdparties.update.length; i++){
                if(requestBody.thirdparties.update[i].tracingsResult){
                    if(requestBody.thirdparties.update[i].tracingsResult.create && requestBody.thirdparties.update[i].tracingsResult.create.length > 0){
                        for(let j = 0; j < requestBody.thirdparties.update[i].tracingsResult.create.length; j++){
                            if(!helper.validateRequestObj(requestBody.thirdparties.update[i].tracingsResult.create[j], ['ctiposeguimiento', 'cmotivoseguimiento', 'fseguimientotercero', 'bcerrado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                            requestBody.thirdparties.update[i].tracingsResult.create[j].xobservacion = requestBody.thirdparties.update[i].tracingsResult.create[j].xobservacion ? helper.encrypt(requestBody.thirdparties.update[i].tracingsResult.create[j].xobservacion.toUpperCase()) : undefined;
                        }
                    }
                    if(requestBody.thirdparties.update[i].tracingsResult.update && requestBody.thirdparties.update[i].tracingsResult.update.length > 0){
                        for(let j = 0; j < requestBody.thirdparties.update[i].tracingsResult.update.length; j++){
                            if(!helper.validateRequestObj(requestBody.thirdparties.update[i].tracingsResult.update[j], ['cseguimientotercero', 'ctiposeguimiento', 'cmotivoseguimiento', 'fseguimientotercero', 'bcerrado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                            requestBody.thirdparties.update[i].tracingsResult.update[j].xobservacion = requestBody.thirdparties.update[i].tracingsResult.update[j].xobservacion ? helper.encrypt(requestBody.thirdparties.update[i].tracingsResult.update[j].xobservacion.toUpperCase()) : undefined;
                        }
                    }
                }
            }
            let updateThirdpartiesByNotificationUpdate = await bd.updateThirdpartiesByNotificationUpdateQuery(requestBody.thirdparties.update, notificationData).then((res) => res);
            if(updateThirdpartiesByNotificationUpdate.error){ return { status: false, code: 500, message: updateThirdpartiesByNotificationUpdate.error }; }
            if(updateThirdpartiesByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Thirdparty not found.' }; }
        }
    }
    if(requestBody.providers){
        if(requestBody.providers.create && requestBody.providers.create.length > 0){
            for(let i = 0; i < requestBody.providers.create.length; i++){
                //if(!helper.validateRequestObj(requestBody.providers.create[i], ['cproveedor', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                requestBody.providers.create[i].xobservacion = helper.encrypt(requestBody.providers.create[i].xobservacion.toUpperCase());
                if(requestBody.providers.create[i].replacements && requestBody.providers.create[i].replacements.length > 0){
                    for(let j = 0; j < requestBody.providers.create[i].replacements.length; j++){
                        if(!helper.validateRequestObj(requestBody.providers.create[i].replacements[j], ['crepuesto', 'ctiporepuesto', 'ncantidad', 'cniveldano'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                }
            }
            let createProvidersByNotificationUpdate = await bd.createProvidersByNotificationUpdateQuery(requestBody.providers.create, notificationData).then((res) => res);
            if(createProvidersByNotificationUpdate.error){ return { status: false, code: 500, message: createProvidersByNotificationUpdate.error }; }
            if(createProvidersByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createProvidersByNotificationUpdate' }; }
        }
    }
    if(requestBody.tracings){
        if(requestBody.tracings.update && requestBody.tracings.update.length > 0){
            for(let i = 0; i < requestBody.tracings.update.length; i++){
                if(!helper.validateRequestObj(requestBody.tracings.update[i], ['cseguimientonotificacion', 'ctiposeguimiento', 'cmotivoseguimiento', 'fseguimientonotificacion', 'bcerrado'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                requestBody.tracings.update[i].xobservacion = requestBody.tracings.update[i].xobservacion ? helper.encrypt(requestBody.tracings.update[i].xobservacion.toUpperCase()) : undefined;
            }
            let updateTracingsByNotificationUpdate = await bd.updateTracingsByNotificationUpdateQuery(requestBody.tracings.update, notificationData).then((res) => res);
            if(updateTracingsByNotificationUpdate.error){ return { status: false, code: 500, message: updateTracingsByNotificationUpdate.error }; }
            if(updateTracingsByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Tracing not found.' }; }
        }
        if(requestBody.tracings.create && requestBody.tracings.create.length > 0){
            for(let i = 0; i < requestBody.tracings.create.length; i++){
                if(!helper.validateRequestObj(requestBody.tracings.create[i], ['ctiposeguimiento', 'cmotivoseguimiento', "fseguimientonotificacion"])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                requestBody.tracings.create[i].xobservacion = requestBody.tracings.create[i].xobservacion ? helper.encrypt(requestBody.tracings.create[i].xobservacion.toUpperCase()) : undefined;
            }
            let closeTracingsByNotificationUpdate = await bd.closeTracingsByNotificationUpdateQuery(notificationData).then((res) => res);
            if(closeTracingsByNotificationUpdate.error){ return { status: false, code: 500, message: closeTracingsByNotificationUpdate.error }; }
            let createTracingsByNotificationUpdate = await bd.createTracingsByNotificationUpdateQuery(requestBody.tracings.create, notificationData).then((res) => res);
            if(createTracingsByNotificationUpdate.error){ return { status: false, code: 500, message: createTracingsByNotificationUpdate.error }; }
            if(createTracingsByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTracingsByNotificationUpdate' }; }
        }
    }
    let quotesUpdateList = [];
    if(requestBody.quotes){
      if(requestBody.quotes.update && requestBody.quotes.update.length > 0){
          for(let i = 0; i < requestBody.quotes.update.length; i++){

            let searchTax = await bd.searchTax(requestBody.quotes.update[i].cimpuesto).then((res) => res);

            quotesUpdateList.push({
              cnotificacion: requestBody.quotes.update[i].cnotificacion,
              ccotizacion: requestBody.quotes.update[i].ccotizacion,
              baceptacion: requestBody.quotes.update[i].baceptacion,
              cimpuesto: requestBody.quotes.update[i].cimpuesto,
              pimpuesto: searchTax.result.recordset[0].PIMPUESTO,
              mtotalcotizacion: requestBody.quotes.update[i].mtotalcotizacion,
              mmontoiva: requestBody.quotes.update[i].mtotalcotizacion * searchTax.result.recordset[0].PIMPUESTO / 100,
              mtotal: requestBody.quotes.update[i].mtotalcotizacion * searchTax.result.recordset[0].PIMPUESTO / 100 + requestBody.quotes.update[i].mtotalcotizacion
            })
          }
          let updateQuotesByNotificationUpdate = await bd.updateQuotesByNotificationUpdateQuery(quotesUpdateList, notificationData).then((res) => res);
          if(updateQuotesByNotificationUpdate.error){ return { status: false, code: 500, message: updateQuotesByNotificationUpdate.error }; }
          if(updateQuotesByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Quote not found.' }; }
      }
    }


    let serviceOrderCreateList = [];
    
    if(requestBody.serviceOrder){
        if(requestBody.serviceOrder.create && requestBody.serviceOrder.create.length > 0){
            for(let i = 0; i < requestBody.serviceOrder.create.length; i++){
                
                let searchTax = await bd.searchTax(requestBody.serviceOrder.create[i].cimpuesto).then((res) => res);

                serviceOrderCreateList.push({
                cservicio: requestBody.serviceOrder.create[i].cservicio,
                xobservacion: requestBody.serviceOrder.create[i].xobservacion.toUpperCase(),
                cservicioadicional: requestBody.serviceOrder.create[i].cservicioadicional,
                xdanos: requestBody.serviceOrder.create[i].xdanos,
                xfecha: requestBody.serviceOrder.create[i].xfecha.toUpperCase(),
                fajuste: requestBody.serviceOrder.create[i].fajuste,
                xdesde: requestBody.serviceOrder.create[i].xdesde,
                xhacia: requestBody.serviceOrder.create[i].xhacia,
                mmonto: requestBody.serviceOrder.create[i].mmonto,
                cimpuesto: requestBody.serviceOrder.create[i].cimpuesto,
                pimpuesto: searchTax.result.recordset[0].PIMPUESTO,
                mmontototaliva: searchTax.result.recordset[0].PIMPUESTO * requestBody.serviceOrder.create[i].mmonto / 100,
                mmontototal: searchTax.result.recordset[0].PIMPUESTO * requestBody.serviceOrder.create[i].mmonto / 100 + requestBody.serviceOrder.create[i].mmonto,
                cmoneda: requestBody.serviceOrder.create[i].cmoneda,
                cproveedor: requestBody.serviceOrder.create[i].cproveedor,
                bactivo: requestBody.serviceOrder.create[i].bactivo,
                ccotizacion: requestBody.serviceOrder.create[i].ccotizacion,
                cestatusgeneral: requestBody.serviceOrder.create[i].cestatusgeneral,
                ccausaanulacion: requestBody.serviceOrder.create[i].ccausaanulacion
                })
                console.log(serviceOrderCreateList)
            }

            let createServiceOrderByNotificationUpdate = await bd.createServiceOrderByNotificationUpdateQuery(serviceOrderCreateList, notificationData).then((res) => res);
            if(createServiceOrderByNotificationUpdate.error){ return { status: false, code: 500, message: createServiceOrderByNotificationUpdate.error }; }
            if(createServiceOrderByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServiceOrderByNotificationUpdate' }; }
        } 
        let serviceOrderUpdateList = [];
        if(requestBody.serviceOrder.update && requestBody.serviceOrder.update.length > 0){

            for(let i = 0; i < requestBody.serviceOrder.update.length; i++){
                serviceOrderUpdateList.push({
                    
                    corden: requestBody.serviceOrder.update[i].orden.corden,
                    bactivo: requestBody.serviceOrder.update[i].orden.bactivo,
                    cestatusgeneral: requestBody.serviceOrder.update[i].orden.cestatusgeneral,
                    ccausaanulacion: requestBody.serviceOrder.update[i].orden.ccausaanulacion
                })
            }
            let updateServiceOrderByNotificationUpdate = await bd.updateServiceOrderByNotificationUpdateQuery(serviceOrderUpdateList, notificationData).then((res) => res);
            if(updateServiceOrderByNotificationUpdate.error){ return { status: false, code: 500, message: updateServiceOrderByNotificationUpdate.error }; }
            if(updateServiceOrderByNotificationUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
    }
    if(requestBody.settlement){
      if(requestBody.settlement.create){

        let settlementCreate = {
              xobservacion: requestBody.settlement.create.xobservacion,
              xdanos: requestBody.settlement.create.xdanos,
              mmontofiniquito: requestBody.settlement.create.mmontofiniquito,
              cmoneda: requestBody.settlement.create.cmoneda,
              ccausafiniquito: requestBody.settlement.create.ccausafiniquito
        }
        let createSettlementByNotification = await bd.createSettlementByNotificationQuery(settlementCreate, notificationData).then((res) => res);
        let cestatusgeneral;
        if(createSettlementByNotification.error){ return { status: false, code: 500, message: createSettlementByNotification.error }; }
        if(createSettlementByNotification.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Settlement not found.' }; }
        if(createSettlementByNotification.result.rowsAffected > 0){
          cestatusgeneral = 5;
          let updateServiceOrderBySettlementUpdate = await bd.updateServiceOrderBySettlementUpdateQuery(createSettlementByNotification.result.corden, cestatusgeneral).then((res) => res);
          if(updateServiceOrderBySettlementUpdate.error){ return { status: false, code: 500, message: updateServiceOrderBySettlementUpdate.error }; }
          if(updateServiceOrderBySettlementUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
      }
    }
    return { status: true, cnotificacion: notificationData.cnotificacion };
}

router.route('/notification-detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationNotificationDetail(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationNotificationDetail' } });
        });
    }
});

const operationNotificationDetail = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cnotificacion: requestBody.cnotificacion ? requestBody.cnotificacion : undefined,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        casociado: requestBody.casociado ? requestBody.casociado : undefined,
        fcreacion: requestBody.fcreacion ? requestBody.fcreacion : undefined,
        fevento: requestBody.fevento ? requestBody.fevento : undefined
    };
    let searchNotification = await bd.searchNotificationQuery(searchData).then((res) => res);
    if(searchNotification.error){ return  { status: false, code: 500, message: searchNotification.error }; }
    if(searchNotification.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchNotification.result.recordset.length; i++){
            jsonList.push({
                cnotificacion: searchNotification.result.recordset[i].CNOTIFICACION,
                fcreacion: searchNotification.result.recordset[i].FCREACION,
                fevento: searchNotification.result.recordset[i].FEVENTO,
                ccliente: searchNotification.result.recordset[i].CCLIENTE,
                xcliente: searchNotification.result.recordset[i].XCLIENTE,
                casociado: searchNotification.result.recordset[i].CASOCIADO,
                xasociado: searchNotification.result.recordset[i].XASOCIADO,
                xplaca: searchNotification.result.recordset[i].XPLACA,
                bactivo: searchNotification.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/detail-settlement').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationDetailSettlement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailSettlement' } });
        });
    }
});

const operationDetailSettlement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cfiniquito: requestBody.cfiniquito,
        ccompania: requestBody.ccompania
    }
    let detailSettlement = await bd.detailSettlementQuery(searchData).then((res) => res);
    if(detailSettlement.error){ return { status: false, code: 500, message: detailSettlement.error }; }
    if(detailSettlement.result.rowsAffected > 0){
        let nombres = detailSettlement.result.recordset[0].XNOMBRE + ' ' + detailSettlement.result.recordset[0].XAPELLIDO;
        return {
            status: true,
            cfiniquito: detailSettlement.result.recordset[0].CFINIQUITO,
            cnotificacion: detailSettlement.result.recordset[0].CNOTIFICACION,
            corden: detailSettlement.result.recordset[0].CORDEN,
            mmontofiniquito: detailSettlement.result.recordset[0].MMONTOFINIQUITO,
            xobservacion: detailSettlement.result.recordset[0].XOBSERVACION,
            xdanos: detailSettlement.result.recordset[0].XDANOS,
            ccompania: detailSettlement.result.recordset[0].CCOMPANIA,
            mtotalcotizacion: detailSettlement.result.recordset[0].MTOTALCOTIZACION,
            ccontratoflota: detailSettlement.result.recordset[0].CCONTRATOFLOTA,
            xnombres: nombres,
            xdocidentidad: detailSettlement.result.recordset[0].XDOCIDENTIDAD,
            xtelefonocelular: detailSettlement.result.recordset[0].XTELEFONOCELULAR,
            cpropietario: detailSettlement.result.recordset[0].CPROPIETARIO,
            cvehiculopropietario: detailSettlement.result.recordset[0].CVEHICULOPROPIETARIO,
            xmarca: detailSettlement.result.recordset[0].XMARCA,
            xmodelo: detailSettlement.result.recordset[0].XMODELO,
            xplaca: detailSettlement.result.recordset[0].XPLACA,
            fano: detailSettlement.result.recordset[0].FANO,
            xserialcarroceria: detailSettlement.result.recordset[0].XSERIALCARROCERIA,
            xcolor: detailSettlement.result.recordset[0].XCOLOR,
            cmoneda: detailSettlement.result.recordset[0].CMONEDA,
            xmoneda: detailSettlement.result.recordset[0].xmoneda,
            cservicio: detailSettlement.result.recordset[0].CSERVICIO,
            cservicioadicional: detailSettlement.result.recordset[0].CSERVICIOADICIONAL,
            xdesde: detailSettlement.result.recordset[0].XDESDE,
            xhasta: detailSettlement.result.recordset[0].XHASTA,
            mmontototalgrua: detailSettlement.result.recordset[0].MMONTOTOTALGRUA,
            ccausafiniquito: detailSettlement.result.recordset[0].CCAUSAFINIQUITO,
            xcausafiniquito: detailSettlement.result.recordset[0].XCAUSAFINIQUITO,
            fcreacionnotificacion: detailSettlement.result.recordset[0].FCREACIONNOTIFICACION
        }
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/settlement/service-order').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationServiceOrderFromSettlement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationServiceOrderFromSettlement' } });
        });
    }
});

const operationServiceOrderFromSettlement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cnotificacion: requestBody.cnotificacion,
        xdanos: requestBody.xdanos
    };
    let query = await bd.serviceOrderBySettlementQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ corden: query.result.recordset[i].CORDEN, cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO, xdanos: query.result.recordset[i].XDANOS, xservicioadicional: query.result.recordset[i].XSERVICIOADICIONAL });
    }
    console.log(jsonArray)
    return { status: true, list: jsonArray }
}

module.exports = router;