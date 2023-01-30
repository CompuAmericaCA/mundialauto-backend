const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBrand(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBrand' } });
        });
    }
});

const operationSearchBrand = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        cversion: requestBody.cversion ? requestBody.cversion : undefined
    };
    let searchBrand = await bd.searchBrandQuery(searchData).then((res) => res);
    if(searchBrand.error){ return  { status: false, code: 500, message: searchBrand.error }; }
    if(searchBrand.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBrand.result.recordset.length; i++){
            jsonList.push({
                cmarca: searchBrand.result.recordset[i].CMARCA,
                xmarca: searchBrand.result.recordset[i].XMARCA,
                cmodelo: searchBrand.result.recordset[i].CMODELO,
                xmodelo: searchBrand.result.recordset[i].XMODELO,
                cversion: searchBrand.result.recordset[i].CVERSION,
                xversion: searchBrand.result.recordset[i].XVERSION,
                cano: searchBrand.result.recordset[i].CANO
            });  
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Brand not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateBrand(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateBrand' } });
        });
    }
});

const operationCreateBrand = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'xmarca', 'bactivo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let brandData = {
        cpais: requestBody.cpais,
        xmarca: requestBody.xmarca.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    console.log(brandData)
    let verifyBrandName = await bd.verifyBrandNameToCreateQuery(brandData).then((res) => res);
    if(verifyBrandName.error){ return { status: false, code: 500, message: verifyBrandName.error }; }
    if(verifyBrandName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'brand-name-already-exist' }; }
    else{
        let createBrand = await bd.createBrandQuery(brandData).then((res) => res);
        if(createBrand.error){ return { status: false, code: 500, message: createBrand.error }; }
        if(createBrand.result.rowsAffected > 0){ return { status: true, cmarca: createBrand.result.recordset[0].CMARCA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBrand' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailBrand(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailBrand' } });
        });
    }
});

const operationDetailBrand = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','cmarca'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let brandData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca
    };
    let getBrandData = await bd.getBrandDataQuery(brandData).then((res) => res);
    if(getBrandData.error){ return { status: false, code: 500, message: getBrandData.error }; }
    if(getBrandData.result.rowsAffected > 0){
        return {
            status: true,
            cmarca: getBrandData.result.recordset[0].CMARCA,
            xmarca: getBrandData.result.recordset[0].XMARCA,
            casociado: getBrandData.result.recordset[0].CASOCIADO,
            bactivo: getBrandData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Brand not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateBrand(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateBrand' } });
        });
    }
});

const operationUpdateBrand = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cmarca', 'xmarca', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let brandData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca,
        xmarca: requestBody.xmarca.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };

    let verifyBrandName = await bd.verifyBrandNameToUpdateQuery(brandData).then((res) => res);
    if(verifyBrandName.error){ return { status: false, code: 500, message: verifyBrandName.error }; }
    if(verifyBrandName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'brand-name-already-exist'}; }
    else{
        let updateBrand = await bd.updateBrandQuery(brandData).then((res) => res);
        if(updateBrand.error){ return { status: false, code: 500, message: updateBrand.error }; }
        if(updateBrand.result.rowsAffected > 0){ return { status: true, cmarca: brandData.cmarca }; }
        else{ return { status: false, code: 404, message: 'Brand not found.' }; }
    }
}

module.exports = router;