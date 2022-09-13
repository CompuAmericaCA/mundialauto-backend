const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchProficient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchProficient' } });
        });
    }
});

const operationSearchProficient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xperito: requestBody.xperito ? helper.encrypt(requestBody.xperito.toUpperCase()) : undefined,
        xrazonsocial: requestBody.xrazonsocial ? helper.encrypt(requestBody.xrazonsocial.toUpperCase()) : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined
    };
    let searchProficient = await bd.searchProficientQuery(searchData).then((res) => res);
    if(searchProficient.error){ return  { status: false, code: 500, message: searchProficient.error }; }
    if(searchProficient.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchProficient.result.recordset.length; i++){
            jsonList.push({
                cperito: searchProficient.result.recordset[i].CPERITO,
                xperito: helper.decrypt(searchProficient.result.recordset[i].XPERITO),
                xrazonsocial: helper.decrypt(searchProficient.result.recordset[i].XRAZONSOCIAL),
                xdocidentidad: helper.decrypt(searchProficient.result.recordset[i].XDOCIDENTIDAD),
                bactivo: searchProficient.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Proficient not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateProficient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateProficient' } });
        });
    }
});

const operationCreateProficient = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xperito', 'ctipodocidentidad', 'xdocidentidad', 'xrazonsocial', 'cestado', 'cciudad', 'xdireccion', 'xdireccioncorreo', 'xtelefono', 'centeimpuesto', 'ldiascredito', 'bafiliado', 'xobservacion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let proficientData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        xperito: helper.encrypt(requestBody.xperito.toUpperCase()),
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xrazonsocial: helper.encrypt(requestBody.xrazonsocial.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xemail: requestBody.xemail ? helper.encrypt(requestBody.xemail.toUpperCase()) : undefined,
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        xdireccioncorreo: helper.encrypt(requestBody.xdireccioncorreo.toUpperCase()),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax.toUpperCase()) : undefined,
        pretencion: requestBody.pretencion ? requestBody.pretencion : undefined,
        centeimpuesto: helper.encrypt(requestBody.centeimpuesto),
        ldiascredito: requestBody.ldiascredito,
        bafiliado: requestBody.bafiliado,
        xpaginaweb: requestBody.xpaginaweb ? helper.encrypt(requestBody.xpaginaweb.toUpperCase()) : undefined,
        xobservacion: helper.encrypt(requestBody.xobservacion.toUpperCase()),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyProficientIdentification = await bd.verifyProficientIdentificationToCreateQuery(proficientData).then((res) => res);
    if(verifyProficientIdentification.error){ return { status: false, code: 500, message: verifyProficientIdentification.error }; }
    if(verifyProficientIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    else{
        let createProficient = await bd.createProficientQuery(proficientData).then((res) => res);
        if(createProficient.error){ return { status: false, code: 500, message: createProficient.error }; }
        if(createProficient.result.rowsAffected > 0){ return { status: true, cperito: createProficient.result.recordset[0].CPERITO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createProficient' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailProficient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailProficient' } });
        });
    }
});

const operationDetailProficient = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cperito'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let proficientData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cperito: requestBody.cperito
    };
    let getProficientData = await bd.getProficientDataQuery(proficientData).then((res) => res);
    if(getProficientData.error){ return { status: false, code: 500, message: getProficientData.error }; }
    if(getProficientData.result.rowsAffected > 0){
        return {
            status: true,
            cperito: getProficientData.result.recordset[0].CPERITO,
            xperito: helper.decrypt(getProficientData.result.recordset[0].XPERITO),
            ctipodocidentidad: getProficientData.result.recordset[0].CTIPODOCIDENTIDAD,
            xdocidentidad: helper.decrypt(getProficientData.result.recordset[0].XDOCIDENTIDAD),
            xrazonsocial: helper.decrypt(getProficientData.result.recordset[0].XRAZONSOCIAL),
            cestado: getProficientData.result.recordset[0].CESTADO,
            cciudad: getProficientData.result.recordset[0].CCIUDAD,
            xdireccion: helper.decrypt(getProficientData.result.recordset[0].XDIRECCION),
            xdireccioncorreo: helper.decrypt(getProficientData.result.recordset[0].XDIRECCIONCORREO),
            xtelefono: helper.decrypt(getProficientData.result.recordset[0].XTELEFONO),
            xfax: getProficientData.result.recordset[0].XFAX ? helper.decrypt(getProficientData.result.recordset[0].XFAX) : undefined,
            pretencion: getProficientData.result.recordset[0].PRETENCION ? getProficientData.result.recordset[0].PRETENCION : undefined,
            centeimpuesto: helper.decrypt(getProficientData.result.recordset[0].CENTEIMPUESTO),
            ldiascredito: getProficientData.result.recordset[0].LDIASCREDITO,
            xemail: getProficientData.result.recordset[0].XEMAIL ? helper.decrypt(getProficientData.result.recordset[0].XEMAIL) : undefined,
            bafiliado: getProficientData.result.recordset[0].BAFILIADO,
            xpaginaweb: getProficientData.result.recordset[0].XPAGINAWEB ? helper.decrypt(getProficientData.result.recordset[0].XPAGINAWEB) : undefined,
            xobservacion: helper.decrypt(getProficientData.result.recordset[0].XOBSERVACION),
            bactivo: getProficientData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Proficient not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateProficient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateProficient' } });
        });
    }
});

const operationUpdateProficient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cperito', 'xperito', 'ctipodocidentidad', 'xdocidentidad', 'xrazonsocial', 'cestado', 'cciudad', 'xdireccion', 'xdireccioncorreo', 'xtelefono', 'centeimpuesto', 'ldiascredito', 'bafiliado', 'xobservacion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let proficientData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cperito: requestBody.cperito,
        xperito: helper.encrypt(requestBody.xperito.toUpperCase()),
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xrazonsocial: helper.encrypt(requestBody.xrazonsocial.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xemail: requestBody.xemail ? helper.encrypt(requestBody.xemail.toUpperCase()) : undefined,
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        xdireccioncorreo: helper.encrypt(requestBody.xdireccioncorreo.toUpperCase()),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xfax: requestBody.xfax ? helper.encrypt(requestBody.xfax.toUpperCase()) : undefined,
        pretencion: requestBody.pretencion ? requestBody.pretencion : undefined,
        centeimpuesto: helper.encrypt(requestBody.centeimpuesto),
        ldiascredito: requestBody.ldiascredito,
        bafiliado: requestBody.bafiliado,
        xpaginaweb: requestBody.xpaginaweb ? helper.encrypt(requestBody.xpaginaweb.toUpperCase()) : undefined,
        xobservacion: helper.encrypt(requestBody.xobservacion.toUpperCase()),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyProficientIdentification = await bd.verifyProficientIdentificationToUpdateQuery(proficientData).then((res) => res);
    if(verifyProficientIdentification.error){ return { status: false, code: 500, message: verifyProficientIdentification.error }; }
    if(verifyProficientIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
    else{
        let updateProficient = await bd.updateProficientQuery(proficientData).then((res) => res);
        if(updateProficient.error){ return { status: false, code: 500, message: updateProficient.error }; }
        if(updateProficient.result.rowsAffected > 0){ return { status: true, cperito: proficientData.cperito }; }
        else{ return { status: false, code: 404, message: 'Proficient not found.' }; }
    }
}

module.exports = router;