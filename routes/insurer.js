const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchInsurer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchInsurer' } });
        });
    }
});

const operationSearchInsurer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xaseguradora: requestBody.xaseguradora ? helper.encrypt(requestBody.xaseguradora.toUpperCase()) : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined
    };
    let searchInsurer = await bd.searchInsurerQuery(searchData).then((res) => res);
    if(searchInsurer.error){ return  { status: false, code: 500, message: searchInsurer.error }; }
    if(searchInsurer.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchInsurer.result.recordset.length; i++){
            jsonList.push({
                caseguradora: searchInsurer.result.recordset[i].CASEGURADORA,
                xaseguradora: helper.decrypt(searchInsurer.result.recordset[i].XASEGURADORA),
                xdocidentidad: helper.decrypt(searchInsurer.result.recordset[i].XDOCIDENTIDAD),
                bactivo: searchInsurer.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Insurer not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateInsurer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateInsurer' } });
        });
    }
});

const operationCreateInsurer = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xaseguradora', 'xrepresentante', 'ctipodocidentidad', 'xdocidentidad', 'cestado', 'cciudad', 'xdireccionfiscal', 'xemail', 'bnotificacionsms', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let contacts = [];
    if(requestBody.contacts){
        contacts = requestBody.contacts;
        for(let i = 0; i < contacts.length; i++){
            if(!helper.validateRequestObj(contacts[i], ['xnombre', 'xapellido', 'ctipodocidentidad', 'xdocidentidad', 'xtelefonocelular', 'xemail', 'bnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
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
    let insurerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xaseguradora: helper.encrypt(requestBody.xaseguradora.toUpperCase()),
        xrepresentante: helper.encrypt(requestBody.xrepresentante.toUpperCase()),
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccionfiscal: helper.encrypt(requestBody.xdireccionfiscal.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xtelefono: requestBody.xtelefono ? helper.encrypt(requestBody.xtelefono) : undefined,
        bnotificacionsms: requestBody.bnotificacionsms,
        xpaginaweb: requestBody.xpaginaweb ? helper.encrypt(requestBody.xpaginaweb.toUpperCase()) : undefined,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyInsurerIdentification = await bd.verifyInsurerIdentificationToCreateQuery(insurerData).then((res) => res);
    if(verifyInsurerIdentification.error){ return { status: false, code: 500, message: verifyInsurerIdentification.error }; }
    if(verifyInsurerIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    else{
        let createInsurer = await bd.createInsurerQuery(insurerData).then((res) => res);
        if(createInsurer.error){ return { status: false, code: 500, message: createInsurer.error }; }
        if(createInsurer.result.rowsAffected > 0){ return { status: true, caseguradora: createInsurer.result.recordset[0].CASEGURADORA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createInsurer' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailInsurer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailInsurer' } });
        });
    }
});

const operationDetailInsurer = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'caseguradora'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let insurerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        caseguradora: requestBody.caseguradora
    };
    let getInsurerData = await bd.getInsurerDataQuery(insurerData).then((res) => res);
    if(getInsurerData.error){ return { status: false, code: 500, message: getInsurerData.error }; }
    if(getInsurerData.result.rowsAffected > 0){
        let contacts = [];
        let getInsurerContactsData = await bd.getInsurerContactsDataQuery(insurerData.caseguradora).then((res) => res);
        if(getInsurerContactsData.error){ return { status: false, code: 500, message: getInsurerContactsData.error }; }
        if(getInsurerContactsData.result.rowsAffected > 0){
            for(let i = 0; i < getInsurerContactsData.result.recordset.length; i++){
                let contact = {
                    ccontacto: getInsurerContactsData.result.recordset[i].CCONTACTO,
                    xnombre: helper.decrypt(getInsurerContactsData.result.recordset[i].XNOMBRE),
                    xapellido: helper.decrypt(getInsurerContactsData.result.recordset[i].XAPELLIDO),
                    ctipodocidentidad: getInsurerContactsData.result.recordset[i].CTIPODOCIDENTIDAD,
                    xdocidentidad: helper.decrypt(getInsurerContactsData.result.recordset[i].XDOCIDENTIDAD),
                    xtelefonocelular: helper.decrypt(getInsurerContactsData.result.recordset[i].XTELEFONOCELULAR),
                    xemail: helper.decrypt(getInsurerContactsData.result.recordset[i].XEMAIL),
                    xcargo: getInsurerContactsData.result.recordset[i].XCARGO ? helper.decrypt(getInsurerContactsData.result.recordset[i].XCARGO) : undefined,
                    xtelefonocasa: getInsurerContactsData.result.recordset[i].XTELEFONOCASA ? helper.decrypt(getInsurerContactsData.result.recordset[i].XTELEFONOCASA) : undefined,
                    xtelefonooficina: getInsurerContactsData.result.recordset[i].XTELEFONOOFICINA ? helper.decrypt(getInsurerContactsData.result.recordset[i].XTELEFONOOFICINA) : undefined,
                    xfax: getInsurerContactsData.result.recordset[i].XFAX ? helper.decrypt(getInsurerContactsData.result.recordset[i].XFAX) : undefined,
                    bnotificacion: getInsurerContactsData.result.recordset[i].BNOTIFICACION
                }
                contacts.push(contact);
            }
        }
        return {
            status: true,
            caseguradora: getInsurerData.result.recordset[0].CASEGURADORA,
            xaseguradora: helper.decrypt(getInsurerData.result.recordset[0].XASEGURADORA),
            xrepresentante: helper.decrypt(getInsurerData.result.recordset[0].XREPRESENTANTE),
            ctipodocidentidad: getInsurerData.result.recordset[0].CTIPODOCIDENTIDAD,
            xdocidentidad: helper.decrypt(getInsurerData.result.recordset[0].XDOCIDENTIDAD),
            cestado: getInsurerData.result.recordset[0].CESTADO,
            cciudad: getInsurerData.result.recordset[0].CCIUDAD,
            xdireccionfiscal: helper.decrypt(getInsurerData.result.recordset[0].XDIRECCIONFISCAL),
            xemail: helper.decrypt(getInsurerData.result.recordset[0].XEMAIL),
            xtelefono: getInsurerData.result.recordset[0].XTELEFONO ? helper.decrypt(getInsurerData.result.recordset[0].XTELEFONO) : undefined,
            bnotificacionsms: getInsurerData.result.recordset[0].BNOTIFICACIONSMS,
            xpaginaweb: getInsurerData.result.recordset[0].XPAGINAWEB ? helper.decrypt(getInsurerData.result.recordset[0].XPAGINAWEB) : undefined,
            bactivo: getInsurerData.result.recordset[0].BACTIVO,
            contacts: contacts
        }
    }else{ return { status: false, code: 404, message: 'Insurer not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateInsurer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateInsurer' } });
        });
    }
});

const operationUpdateInsurer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'caseguradora', 'xaseguradora', 'xrepresentante', 'ctipodocidentidad', 'xdocidentidad', 'cestado', 'cciudad', 'xdireccionfiscal', 'xemail', 'bnotificacionsms', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let insurerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        caseguradora: requestBody.caseguradora,
        xaseguradora: helper.encrypt(requestBody.xaseguradora.toUpperCase()),
        xrepresentante: helper.encrypt(requestBody.xrepresentante.toUpperCase()),
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xdireccionfiscal: helper.encrypt(requestBody.xdireccionfiscal.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xtelefono: requestBody.xtelefono ? helper.encrypt(requestBody.xtelefono) : undefined,
        bnotificacionsms: requestBody.bnotificacionsms,
        xpaginaweb: requestBody.xpaginaweb ? helper.encrypt(requestBody.xpaginaweb.toUpperCase()) : undefined,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyInsurerIdentification = await bd.verifyInsurerIdentificationToUpdateQuery(insurerData).then((res) => res);
    if(verifyInsurerIdentification.error){ return { status: false, code: 500, message: verifyInsurerIdentification.error }; }
    if(verifyInsurerIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    else{
        let updateInsurer = await bd.updateInsurerQuery(insurerData).then((res) => res);
        if(updateInsurer.error){ return { status: false, code: 500, message: updateInsurer.error }; }
        if(updateInsurer.result.rowsAffected > 0){
            if(requestBody.contacts){
                if(requestBody.contacts.create && requestBody.contacts.create.length > 0){
                    for(let i = 0; i < requestBody.contacts.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.contacts.create[i], ['xnombre', 'xapellido', 'ctipodocidentidad', 'xdocidentidad', 'xtelefonocelular', 'xemail', 'bnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
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
                    let createContactsByInsurerUpdate = await bd.createContactsByInsurerUpdateQuery(requestBody.contacts.create, insurerData).then((res) => res);
                    if(createContactsByInsurerUpdate.error){ return { status: false, code: 500, message: createContactsByInsurerUpdate.error }; }
                    if(createContactsByInsurerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createContactsByInsurerUpdate' }; }
                } 
                if(requestBody.contacts.update && requestBody.contacts.update.length > 0){
                    for(let i = 0; i < requestBody.contacts.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.contacts.update[i], ['ccontacto', 'xnombre', 'xapellido', 'ctipodocidentidad', 'xdocidentidad', 'xtelefonocelular', 'xemail', 'bnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
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
                    let updateContactsByInsurerUpdate = await bd.updateContactsByInsurerUpdateQuery(requestBody.contacts.update, insurerData).then((res) => res);
                    if(updateContactsByInsurerUpdate.error){ return { status: false, code: 500, message: updateContactsByInsurerUpdate.error }; }
                    if(updateContactsByInsurerUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Contact not found.' }; }
                }
                if(requestBody.contacts.delete && requestBody.contacts.delete.length){
                    for(let i = 0; i < requestBody.contacts.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.contacts.delete[i], ['ccontacto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteContactsByInsurerUpdate = await bd.deleteContactsByInsurerUpdateQuery(requestBody.contacts.delete, insurerData).then((res) => res);
                    if(deleteContactsByInsurerUpdate.error){ return { status: false, code: 500, message: deleteContactsByInsurerUpdate.error }; }
                    if(deleteContactsByInsurerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteContactsByInsurerUpdate' }; }
                }
            }
            return { status: true, caseguradora: insurerData.caseguradora };
        }
        else{ return { status: false, code: 404, message: 'Insurer not found.' }; }
    }
}

module.exports = router;