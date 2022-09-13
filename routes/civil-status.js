const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCivilStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCivilStatus' } });
        });
    }
});

const operationSearchCivilStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xestadocivil: requestBody.xestadocivil ? requestBody.xestadocivil.toUpperCase() : undefined
    };
    let searchCivilStatus = await bd.searchCivilStatusQuery(searchData).then((res) => res);
    if(searchCivilStatus.error){ return  { status: false, code: 500, message: searchCivilStatus.error }; }
    if(searchCivilStatus.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCivilStatus.result.recordset.length; i++){
            jsonList.push({
                cestadocivil: searchCivilStatus.result.recordset[i].CESTADOCIVIL,
                xestadocivil: searchCivilStatus.result.recordset[i].XESTADOCIVIL,
                bactivo: searchCivilStatus.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Civil Status not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateCivilStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCivilStatus' } });
        });
    }
});

const operationCreateCivilStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xestadocivil', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let civilStatusData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xestadocivil: requestBody.xestadocivil.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyCivilStatusName = await bd.verifyCivilStatusNameToCreateQuery(civilStatusData).then((res) => res);
    if(verifyCivilStatusName.error){ return { status: false, code: 500, message: verifyCivilStatusName.error }; }
    if(verifyCivilStatusName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'civil-status-name-already-exist' }; }
    else{
        let createCivilStatus = await bd.createCivilStatusQuery(civilStatusData).then((res) => res);
        if(createCivilStatus.error){ return { status: false, code: 500, message: createCivilStatus.error }; }
        if(createCivilStatus.result.rowsAffected > 0){ return { status: true, cestadocivil: createCivilStatus.result.recordset[0].CESTADOCIVIL }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCivilStatus' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCivilStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCivilStatus' } });
        });
    }
});

const operationDetailCivilStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cestadocivil'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let civilStatusData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cestadocivil: requestBody.cestadocivil
    };
    let getCivilStatusData = await bd.getCivilStatusDataQuery(civilStatusData).then((res) => res);
    if(getCivilStatusData.error){ return { status: false, code: 500, message: getCivilStatusData.error }; }
    if(getCivilStatusData.result.rowsAffected > 0){
        return {
            status: true,
            cestadocivil: getCivilStatusData.result.recordset[0].CESTADOCIVIL,
            xestadocivil: getCivilStatusData.result.recordset[0].XESTADOCIVIL,
            bactivo: getCivilStatusData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Civil Status not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateCivilStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCivilStatus' } });
        });
    }
});

const operationUpdateCivilStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cestadocivil', 'xestadocivil', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let civilStatusData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cestadocivil: requestBody.cestadocivil,
        xestadocivil: requestBody.xestadocivil.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyCivilStatusName = await bd.verifyCivilStatusNameToUpdateQuery(civilStatusData).then((res) => res);
    if(verifyCivilStatusName.error){ return { status: false, code: 500, message: verifyCivilStatusName.error }; }
    if(verifyCivilStatusName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'civil-status-name-already-exist'}; }
    else{
        let updateCivilStatus = await bd.updateCivilStatusQuery(civilStatusData).then((res) => res);
        if(updateCivilStatus.error){ return { status: false, code: 500, message: updateCivilStatus.error }; }
        if(updateCivilStatus.result.rowsAffected > 0){ return { status: true, cestadocivil: civilStatusData.cestadocivil }; }
        else{ return { status: false, code: 404, message: 'Civil Status not found.' }; }
    }
}

module.exports = router;