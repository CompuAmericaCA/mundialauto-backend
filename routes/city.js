const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCity' } });
        });
    }
});

const operationSearchCity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        cestado: requestBody.cestado ? requestBody.cestado : undefined,
        xciudad: requestBody.xciudad ? helper.encrypt(requestBody.xciudad.toUpperCase()) : undefined
    }
    let searchCity = await bd.searchCityQuery(searchData).then((res) => res);
    if(searchCity.error){ return { status: false, code: 500, message: searchCity.error }; }
    if(searchCity.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCity.result.recordset.length; i++){
            jsonList.push({
                cciudad: searchCity.result.recordset[i].CCIUDAD,
                xciudad: searchCity.result.recordset[i].XCIUDAD,
                cestado: searchCity.result.recordset[i].CESTADO,
                xestado: searchCity.result.recordset[i].XESTADO,
                bactivo: searchCity.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'City not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCity' } });
        });
    }
});

const operationCreateCity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xciudad', 'cestado', 'bactivo', 'cpais', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cityData = {
        xciudad: requestBody.xciudad.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        cestado: requestBody.cestado,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCityName = await bd.verifyCityNameToCreateQuery(cityData).then((res) => res);
    if(verifyCityName.error){ return { status: false, code: 500, message: verifyCityName.error }; }
    if(verifyCityName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'city-name-already-exist' }; }
    else{
        let createCity = await bd.createCityQuery(cityData).then((res) => res);
        if(createCity.error){ return { status: false, code: 500, message: createCity.error }; }
        if(createCity.result.rowsAffected > 0){ return { status: true, cciudad: createCity.result.recordset[0].CCIUDAD }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCity' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCity' } })
        });
    }
});

const operationDetailCity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cciudad'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cityData = {
        cpais: requestBody.cpais,
        cciudad: requestBody.cciudad
    };
    let getCityData = await bd.getCityDataQuery(cityData).then((res) => res);
    if(getCityData.error){ return { status: false, code: 500, message: getCityData.error }; }
    if(getCityData.result.rowsAffected > 0){
        return { 
            status: true,
            cciudad: getCityData.result.recordset[0].CCIUDAD,
            xciudad: getCityData.result.recordset[0].XCIUDAD,
            cestado: getCityData.result.recordset[0].CESTADO,
            bactivo: getCityData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'City not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCity' } })
        });
    }
});

const operationUpdateCity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cciudad', 'xciudad', 'cestado', 'bactivo', 'cpais', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cityData = {
        cciudad: requestBody.cciudad,
        xciudad: requestBody.xciudad.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        cestado: requestBody.cestado,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let verifyCityName = await bd.verifyCityNameToUpdateQuery(cityData).then((res) => res);
    if(verifyCityName.error){ return { status: false, code: 500, message: verifyCityName.error }; }
    if(verifyCityName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'city-name-already-exist'}; }
    else{
        let updateCity = await bd.updateCityQuery(cityData).then((res) => res);
        if(updateCity.error){ return { status: false, code: 500, message: updateCity.error }; }
        if(updateCity.result.rowsAffected > 0){ return { status: true, cciudad: cityData.cciudad }; }
        else{ return { status: false, code: 404, message: 'City not found.' }; }
    }
}

module.exports = router;