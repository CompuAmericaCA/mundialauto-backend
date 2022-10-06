const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchQuoteRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchQuoteRequest' } });
        });
    }
});

const operationSearchQuoteRequest = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cproveedor: requestBody.cproveedor,
        fcreacion: requestBody.fcreacion ? requestBody.fcreacion : undefined
    };
    let searchQuoteRequest = await bd.searchQuoteRequestQuery(searchData).then((res) => res);
    if(searchQuoteRequest.error){ return  { status: false, code: 500, message: searchQuoteRequest.error }; }
    if(searchQuoteRequest.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchQuoteRequest.result.recordset.length; i++){
            jsonList.push({
                ccotizacion: searchQuoteRequest.result.recordset[i].CCOTIZACION,
                fcreacion: searchQuoteRequest.result.recordset[i].FCREACION,
                xobservacion: searchQuoteRequest.result.recordset[i].XOBSERVACION,
                bcerrada: searchQuoteRequest.result.recordset[i].BCERRADA
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Quote Request not found.' }; }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailQuoteRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailQuoteRequest' } });
        });
    }
});

const operationDetailQuoteRequest = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['ccotizacion', 'cproveedor'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteRequestData = {
        cproveedor: requestBody.cproveedor,
        ccotizacion: requestBody.ccotizacion
    };
    let getQuoteRequestData = await bd.getQuoteRequestDataQuery(quoteRequestData).then((res) => res);
    if(getQuoteRequestData.error){ return { status: false, code: 500, message: getQuoteRequestData.error }; }
    if(getQuoteRequestData.result.rowsAffected > 0){
        let replacements = [];
        let getQuoteRequestReplacementsData = await bd.getReplacementsProviderDataQuery(quoteRequestData.ccotizacion).then((res) => res);
        if(getQuoteRequestReplacementsData.error){ return { status: false, code: 500, message: getQuoteRequestReplacementsData.error }; }
        if(getQuoteRequestReplacementsData.result.rowsAffected > 0){
            for(let i = 0; i < getQuoteRequestReplacementsData.result.recordset.length; i++){
                let replacement = {
                    crepuestocotizacion: getQuoteRequestReplacementsData.result.recordset[i].CREPUESTOCOTIZACION,
                    crepuesto: getQuoteRequestReplacementsData.result.recordset[i].CREPUESTO,
                    xrepuesto: getQuoteRequestReplacementsData.result.recordset[i].XREPUESTO,
                    ctiporepuesto: getQuoteRequestReplacementsData.result.recordset[i].CTIPOREPUESTO,
                    ncantidad: getQuoteRequestReplacementsData.result.recordset[i].NCANTIDAD,
                    cniveldano: getQuoteRequestReplacementsData.result.recordset[i].CNIVELDANO,
                    bdisponible: getQuoteRequestReplacementsData.result.recordset[i].BDISPONIBLE ? getQuoteRequestReplacementsData.result.recordset[i].BDISPONIBLE : undefined,
                    munitariorepuesto: getQuoteRequestReplacementsData.result.recordset[i].MUNITARIOREPUESTO ? getQuoteRequestReplacementsData.result.recordset[i].MUNITARIOREPUESTO : undefined,
                    bdescuento: getQuoteRequestReplacementsData.result.recordset[i].BDESCUENTO ? getQuoteRequestReplacementsData.result.recordset[i].BDESCUENTO : undefined,
                    mtotalrepuesto: getQuoteRequestReplacementsData.result.recordset[i].MTOTALREPUESTO ? getQuoteRequestReplacementsData.result.recordset[i].MTOTALREPUESTO : undefined,
                    cmoneda: getQuoteRequestReplacementsData.result.recordset[i].CMONEDA,
                    xmoneda: getQuoteRequestReplacementsData.result.recordset[i].xmoneda
                }
                replacements.push(replacement);
            }
        }
        return {
            status: true,
            ccotizacion: quoteRequestData.ccotizacion,
            xobservacion: getQuoteRequestData.result.recordset[0].XOBSERVACION,
            mtotalcotizacion: getQuoteRequestData.result.recordset[0].MTOTALCOTIZACION,
            bcerrada: getQuoteRequestData.result.recordset[0].BCERRADA,
            baceptacion: getQuoteRequestData.result.recordset[0].BACEPTACION,
            cmoneda: getQuoteRequestData.result.recordset[0].CMONEDA,
            xmoneda: getQuoteRequestData.result.recordset[0].xmoneda,
            replacements: replacements
        }
    }else{ return { status: false, code: 404, message: 'Quote Request not found.' }; }
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
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateNotification' } });
        });
    }
});

const operationUpdateNotification = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccotizacion', 'cproveedor', 'bcerrada', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteRequestData = {
        cproveedor: requestBody.cproveedor,
        ccotizacion: requestBody.ccotizacion,
        mtotalcotizacion: requestBody.mtotalcotizacion ? requestBody.mtotalcotizacion : undefined,
        bcerrada: requestBody.bcerrada,
        baceptacion: requestBody.baceptacion,
        cmoneda: requestBody.cmoneda,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let updateQuoteRequest = await bd.updateQuoteRequestQuery(quoteRequestData).then((res) => res);
    if(updateQuoteRequest.error){ return { status: false, code: 500, message: updateQuoteRequest.error }; }
    if(updateQuoteRequest.result.rowsAffected > 0)
        if(requestBody.replacements){
            if(requestBody.replacements.update && requestBody.replacements.update.length > 0){
                for(let i = 0; i < requestBody.replacements.update.length; i++){
                    if(!helper.validateRequestObj(requestBody.replacements.update[i], ['crepuestocotizacion', 'crepuesto', 'ctiporepuesto', 'ncantidad', 'cniveldano', 'bdisponible'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let updateReplacementsByQuoteRequestUpdate = await bd.updateReplacementsByQuoteRequestUpdateQuery(requestBody.replacements.update, quoteRequestData).then((res) => res);
                if(updateReplacementsByQuoteRequestUpdate.error){ return { status: false, code: 500, message: updateReplacementsByQuoteRequestUpdate.error }; }
                if(updateReplacementsByQuoteRequestUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Replacement not found.' }; }
            }
        return { status: true, ccotizacion: quoteRequestData.ccotizacion };
    }else{ return { status: false, code: 404, message: 'Quote Request not found.' }; }
}

router.route('/detail-list').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailListQuoteRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailListQuoteRequest' } });
        });
    }
});

const operationDetailListQuoteRequest = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cnotificacion', 'baceptacion', 'ccotizacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteRequestData = {
        cnotificacion: requestBody.cnotificacion,
        //baceptacion: requestBody.baceptacion,
        ccotizacion: requestBody.ccotizacion
    };
    let getQuoteRequestData = await bd.getQuoteListRequestDataQuery(quoteRequestData).then((res) => res);
    if(getQuoteRequestData.error){ return { status: false, code: 500, message: getQuoteRequestData.error }; }
    if(getQuoteRequestData.result.rowsAffected > 0){
        let replacements = [];
        let getQuoteRequestReplacementsData = await bd.getReplacementsProviderDataQuery(quoteRequestData.ccotizacion).then((res) => res);
        if(getQuoteRequestReplacementsData.error){ return { status: false, code: 500, message: getQuoteRequestReplacementsData.error }; }
        if(getQuoteRequestReplacementsData.result.rowsAffected > 0){
            for(let i = 0; i < getQuoteRequestReplacementsData.result.recordset.length; i++){
                let replacement = {
                    crepuestocotizacion: getQuoteRequestReplacementsData.result.recordset[i].CREPUESTOCOTIZACION,
                    crepuesto: getQuoteRequestReplacementsData.result.recordset[i].CREPUESTO,
                    xrepuesto: getQuoteRequestReplacementsData.result.recordset[i].XREPUESTO,
                    ctiporepuesto: getQuoteRequestReplacementsData.result.recordset[i].CTIPOREPUESTO,
                    ncantidad: getQuoteRequestReplacementsData.result.recordset[i].NCANTIDAD,
                    cniveldano: getQuoteRequestReplacementsData.result.recordset[i].CNIVELDANO,
                    bdisponible: getQuoteRequestReplacementsData.result.recordset[i].BDISPONIBLE ? getQuoteRequestReplacementsData.result.recordset[i].BDISPONIBLE : undefined,
                    munitariorepuesto: getQuoteRequestReplacementsData.result.recordset[i].MUNITARIOREPUESTO ? getQuoteRequestReplacementsData.result.recordset[i].MUNITARIOREPUESTO : undefined,
                    bdescuento: getQuoteRequestReplacementsData.result.recordset[i].BDESCUENTO ? getQuoteRequestReplacementsData.result.recordset[i].BDESCUENTO : undefined,
                    mtotalrepuesto: getQuoteRequestReplacementsData.result.recordset[i].MTOTALREPUESTO ? getQuoteRequestReplacementsData.result.recordset[i].MTOTALREPUESTO : undefined,
                    cmoneda: getQuoteRequestReplacementsData.result.recordset[i].CMONEDA,
                    xmoneda: getQuoteRequestReplacementsData.result.recordset[i].xmoneda
                }
                replacements.push(replacement);
            }
        }
        return {
            status: true,
            ccotizacion: quoteRequestData.ccotizacion,
            xobservacion: getQuoteRequestData.result.recordset[0].XOBSERVACION,
            mtotalcotizacion: getQuoteRequestData.result.recordset[0].MTOTALCOTIZACION,
            bcerrada: getQuoteRequestData.result.recordset[0].BCERRADA,
            mmontoiva: getQuoteRequestData.result.recordset[0].MMONTOIVA,
            mtotal: getQuoteRequestData.result.recordset[0].MTOTAL,
            cmoneda: getQuoteRequestData.result.recordset[0].CMONEDA,
            xmoneda: getQuoteRequestData.result.recordset[0].xmoneda,
            replacements: replacements
        }
    }else{ return { status: false, code: 404, message: 'Quote Request not found.' }; }
}

router.route('/search-quote').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchQuoteListRequest(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchQuoteListRequest' } });
        });
    }
});

const operationSearchQuoteListRequest = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cnotificacion: requestBody.cnotificacion,
    };
    let searchQuoteListRequest = await bd.searchQuoteListRequestQuery(searchData).then((res) => res);
    if(searchQuoteListRequest.error){ return  { status: false, code: 500, message: searchQuoteListRequest.error }; }
    if(searchQuoteListRequest.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchQuoteListRequest.result.recordset.length; i++){
            jsonList.push({
                ccotizacion: searchQuoteListRequest.result.recordset[i].CCOTIZACION,
                fcreacion: searchQuoteListRequest.result.recordset[i].FCREACION,
                xobservacion: searchQuoteListRequest.result.recordset[i].XOBSERVACION,
                bcerrada: searchQuoteListRequest.result.recordset[i].BCERRADA,
                baceptacion: searchQuoteListRequest.result.recordset[i].BACEPTACION
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Quote Request not found.' }; }
}

module.exports = router;