const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTax' } });
        });
    }
});

const operationSearchTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ximpuesto: requestBody.ximpuesto ? requestBody.ximpuesto.toUpperCase() : undefined,
        xobservacion: requestBody.xobservacion ? requestBody.xobservacion.toUpperCase() : undefined
    };
    let searchTax = await bd.searchTaxQuery(searchData).then((res) => res);
    if(searchTax.error){ return  { status: false, code: 500, message: searchTax.error }; }
    if(searchTax.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchTax.result.recordset.length; i++){
            jsonList.push({
                cimpuesto: searchTax.result.recordset[i].CIMPUESTO,
                ximpuesto: searchTax.result.recordset[i].XIMPUESTO,
                xobservacion: searchTax.result.recordset[i].XOBSERVACION,
                bactivo: searchTax.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Tax not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateTax' } });
        });
    }
});

const operationCreateTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ximpuesto', 'xobservacion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let taxData = {
        cpais: requestBody.cpais,
        ximpuesto: requestBody.ximpuesto.toUpperCase(),
        xobservacion: requestBody.xobservacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyTaxName = await bd.verifyTaxNameToCreateQuery(taxData).then((res) => res);
    if(verifyTaxName.error){ return { status: false, code: 500, message: verifyTaxName.error }; }
    if(verifyTaxName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'tax-name-already-exist' }; }
    else{
        let createTax = await bd.createTaxQuery(taxData).then((res) => res);
        if(createTax.error){ return { status: false, code: 500, message: createTax.error }; }
        if(createTax.result.rowsAffected > 0){ return { status: true, cimpuesto: createTax.result.recordset[0].CIMPUESTO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTax' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailTax' } });
        });
    }
});

const operationDetailTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cimpuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let taxData = {
        cpais: requestBody.cpais,
        cimpuesto: requestBody.cimpuesto
    };
    let getTaxData = await bd.getTaxDataQuery(taxData).then((res) => res);
    if(getTaxData.error){ return { status: false, code: 500, message: getTaxData.error }; }
    if(getTaxData.result.rowsAffected > 0){
        return {
            status: true,
            cimpuesto: getTaxData.result.recordset[0].CIMPUESTO,
            ximpuesto: getTaxData.result.recordset[0].XIMPUESTO,
            xobservacion: getTaxData.result.recordset[0].XOBSERVACION,
            bactivo: getTaxData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Tax not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateTax' } });
        });
    }
});

const operationUpdateTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cimpuesto', 'ximpuesto', 'xobservacion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let taxData = {
        cpais: requestBody.cpais,
        cimpuesto: requestBody.cimpuesto,
        ximpuesto: requestBody.ximpuesto.toUpperCase(),
        xobservacion: requestBody.xobservacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyTaxName = await bd.verifyTaxNameToUpdateQuery(taxData).then((res) => res);
    if(verifyTaxName.error){ return { status: false, code: 500, message: verifyTaxName.error }; }
    if(verifyTaxName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'tax-name-already-exist'}; }
    else{
        let updateTax = await bd.updateTaxQuery(taxData).then((res) => res);
        if(updateTax.error){ return { status: false, code: 500, message: updateTax.error }; }
        if(updateTax.result.rowsAffected > 0){ return { status: true, cimpuesto: taxData.cimpuesto }; }
        else{ return { status: false, code: 404, message: 'Tax not found.' }; }
    }
}

router.route('/configuration/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationConfigurationDetailTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConfigurationDetailTax' } });
        });
    }
});

const operationConfigurationDetailTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cimpuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let taxData = {
        cpais: requestBody.cpais,
        cimpuesto: requestBody.cimpuesto
    };
    let getTaxData = await bd.getTaxDataQuery(taxData).then((res) => res);
    if(getTaxData.error){ return { status: false, code: 500, message: getTaxData.error }; }
    if(getTaxData.result.rowsAffected > 0){
        getTaxConfigurationData = await bd.getTaxConfigurationDataQuery(taxData).then((res) => res);
        if(getTaxConfigurationData.error){ return { status: false, code: 500, message: getTaxConfigurationData.error }; }
        if(getTaxConfigurationData.result.rowsAffected > 0){
            return {
                status: true,
                cimpuesto: getTaxData.result.recordset[0].CIMPUESTO,
                ximpuesto: getTaxData.result.recordset[0].XIMPUESTO,
                xobservacion: getTaxData.result.recordset[0].XOBSERVACION,
                pimpuesto: getTaxConfigurationData.result.recordset[0].PIMPUESTO,
                ctipopago: getTaxConfigurationData.result.recordset[0].CTIPOPAGO,
                fdesde: getTaxConfigurationData.result.recordset[0].FDESDE,
                fhasta: getTaxConfigurationData.result.recordset[0].FHASTA,
                mdesde: getTaxConfigurationData.result.recordset[0].MDESDE,
                mhasta: getTaxConfigurationData.result.recordset[0].MHASTA,
                bactivo: getTaxData.result.recordset[0].BACTIVO
            }
        }else{
            return {
                status: true,
                cimpuesto: getTaxData.result.recordset[0].CIMPUESTO,
                ximpuesto: getTaxData.result.recordset[0].XIMPUESTO,
                xobservacion: getTaxData.result.recordset[0].XOBSERVACION,
                bactivo: getTaxData.result.recordset[0].BACTIVO
            }
        }
    }else{ return { status: false, code: 404, message: 'Tax not found.' }; }
}

router.route('/configuration/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationConfigurationUpdateTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConfigurationUpdateTax' } });
        });
    }
});

const operationConfigurationUpdateTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cimpuesto', 'pimpuesto', 'ctipopago', 'fdesde', 'fhasta', 'mdesde', 'mhasta', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let taxData = {
        cpais: requestBody.cpais,
        cimpuesto: requestBody.cimpuesto,
        pimpuesto: requestBody.pimpuesto,
        ctipopago: requestBody.ctipopago,
        fdesde: requestBody.fdesde,
        fhasta: requestBody.fhasta,
        mhasta: requestBody.mhasta,
        mdesde: requestBody.mdesde,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let updateConfigurationTax = await bd.updateConfigurationTaxQuery(taxData).then((res) => res);
    if(updateConfigurationTax.error){ return { status: false, code: 500, message: updateConfigurationTax.error }; }
    if(updateConfigurationTax.result.rowsAffected > 0){ return { status: true, cimpuesto: taxData.cimpuesto }; }
    else{ return { status: false, code: 404, message: 'Tax not found.' }; }
}

module.exports = router;
