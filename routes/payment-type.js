const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchPaymentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPaymentType' } });
        });
    }
});

const operationSearchPaymentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipopago: requestBody.xtipopago ? requestBody.xtipopago.toUpperCase() : undefined
    };
    let searchPaymentType = await bd.searchPaymentTypeQuery(searchData).then((res) => res);
    if(searchPaymentType.error){ return  { status: false, code: 500, message: searchPaymentType.error }; }
    if(searchPaymentType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchPaymentType.result.recordset.length; i++){
            jsonList.push({
                ctipopago: searchPaymentType.result.recordset[i].CTIPOPAGO,
                xtipopago: searchPaymentType.result.recordset[i].XTIPOPAGO,
                bactivo: searchPaymentType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Payment Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreatePaymentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePaymentType' } });
        });
    }
});

const operationCreatePaymentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtipopago', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let paymentTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtipopago: requestBody.xtipopago.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyPaymentTypeName = await bd.verifyPaymentTypeNameToCreateQuery(paymentTypeData).then((res) => res);
    if(verifyPaymentTypeName.error){ return { status: false, code: 500, message: verifyPaymentTypeName.error }; }
    if(verifyPaymentTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'payment-type-name-already-exist' }; }
    else{
        let createPaymentType = await bd.createPaymentTypeQuery(paymentTypeData).then((res) => res);
        if(createPaymentType.error){ return { status: false, code: 500, message: createPaymentType.error }; }
        if(createPaymentType.result.rowsAffected > 0){ return { status: true, ctipopago: createPaymentType.result.recordset[0].CTIPOPAGO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPaymentType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailPaymentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPaymentType' } });
        });
    }
});

const operationDetailPaymentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctipopago'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let paymentTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipopago: requestBody.ctipopago
    };
    let getPaymentTypeData = await bd.getPaymentTypeDataQuery(paymentTypeData).then((res) => res);
    if(getPaymentTypeData.error){ return { status: false, code: 500, message: getPaymentTypeData.error }; }
    if(getPaymentTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctipopago: getPaymentTypeData.result.recordset[0].CTIPOPAGO,
            xtipopago: getPaymentTypeData.result.recordset[0].XTIPOPAGO,
            bactivo: getPaymentTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Payment Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdatePaymentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdatePaymentType' } });
        });
    }
});

const operationUpdatePaymentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctipopago', 'xtipopago', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let paymentTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctipopago: requestBody.ctipopago,
        xtipopago: requestBody.xtipopago.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyPaymentTypeName = await bd.verifyPaymentTypeNameToUpdateQuery(paymentTypeData).then((res) => res);
    if(verifyPaymentTypeName.error){ return { status: false, code: 500, message: verifyPaymentTypeName.error }; }
    if(verifyPaymentTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'payment-type-name-already-exist'}; }
    else{
        let updatePaymentType = await bd.updatePaymentTypeQuery(paymentTypeData).then((res) => res);
        if(updatePaymentType.error){ return { status: false, code: 500, message: updatePaymentType.error }; }
        if(updatePaymentType.result.rowsAffected > 0){ return { status: true, ctipopago: paymentTypeData.ctipopago }; }
        else{ return { status: false, code: 404, message: 'Payment Type not found.' }; }
    }
}

module.exports = router;