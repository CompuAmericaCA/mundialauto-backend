const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchColor(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchColor' } });
        });
    }
});

const operationSearchColor = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        xcolor: requestBody.xcolor ? requestBody.xcolor.toUpperCase() : undefined
    };
    let searchColor = await bd.searchColorQuery(searchData).then((res) => res);
    if(searchColor.error){ return  { status: false, code: 500, message: searchColor.error }; }
    if(searchColor.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchColor.result.recordset.length; i++){
            jsonList.push({
                ccolor: searchColor.result.recordset[i].CCOLOR,
                xcolor: searchColor.result.recordset[i].XCOLOR,
                bactivo: searchColor.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Color not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateColor(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateColor' } });
        });
    }
});

const operationCreateColor = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xcolor', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let colorData = {
        cpais: requestBody.cpais,
        xcolor: requestBody.xcolor.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyColorName = await bd.verifyColorNameToCreateQuery(colorData).then((res) => res);
    if(verifyColorName.error){ return { status: false, code: 500, message: verifyColorName.error }; }
    if(verifyColorName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'color-name-already-exist' }; }
    else{
        let createColor = await bd.createColorQuery(colorData).then((res) => res);
        if(createColor.error){ return { status: false, code: 500, message: createColor.error }; }
        if(createColor.result.rowsAffected > 0){ return { status: true, ccolor: createColor.result.recordset[0].CCOLOR }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createColor' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailColor(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailColor' } });
        });
    }
});

const operationDetailColor = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccolor'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let colorData = {
        cpais: requestBody.cpais,
        ccolor: requestBody.ccolor
    };
    let getColorData = await bd.getColorDataQuery(colorData).then((res) => res);
    if(getColorData.error){ return { status: false, code: 500, message: getColorData.error }; }
    if(getColorData.result.rowsAffected > 0){
        return {
            status: true,
            ccolor: getColorData.result.recordset[0].CCOLOR,
            xcolor: getColorData.result.recordset[0].XCOLOR,
            bactivo: getColorData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Color not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateColor(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateColor' } });
        });
    }
});

const operationUpdateColor = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccolor', 'xcolor', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let colorData = {
        cpais: requestBody.cpais,
        ccolor: requestBody.ccolor,
        xcolor: requestBody.xcolor.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyColorName = await bd.verifyColorNameToUpdateQuery(colorData).then((res) => res);
    if(verifyColorName.error){ return { status: false, code: 500, message: verifyColorName.error }; }
    if(verifyColorName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'color-name-already-exist'}; }
    else{
        let updateColor = await bd.updateColorQuery(colorData).then((res) => res);
        if(updateColor.error){ return { status: false, code: 500, message: updateColor.error }; }
        if(updateColor.result.rowsAffected > 0){ return { status: true, ccolor: colorData.ccolor }; }
        else{ return { status: false, code: 404, message: 'Color not found.' }; }
    }
}


module.exports = router;