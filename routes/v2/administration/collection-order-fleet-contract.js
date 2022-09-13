const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'collection-order-fleet-contract', req.body, 'searchAdministrationProductionCollectionOrderFleetContractSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationSearchCollectionOrderFleetContract(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCollectionOrderFleetContract' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchCollectionOrderFleetContract = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        ifacturacion: requestBody.ifacturacion ? requestBody.ifacturacion : undefined
    }
    let searchCollectionOrderFleetContract = await db.searchCollectionOrderFleetContractQuery(searchData).then((res) => res);
    if(searchCollectionOrderFleetContract.error){ return { status: false, code: 500, message: searchCollectionOrderFleetContract.error }; }
    if(searchCollectionOrderFleetContract.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Collection Order Fleet Contract not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchCollectionOrderFleetContract.result.recordset.length; i++){
        jsonList.push({
            csolicitudcobrocontratoflota: searchCollectionOrderFleetContract.result.recordset[i].CSOLICITUDCOBROCONTRATOFLOTA,
            xcliente: helper.decrypt(searchCollectionOrderFleetContract.result.recordset[i].XCLIENTE),
            xestatusgeneral: searchCollectionOrderFleetContract.result.recordset[i].XESTATUSGENERAL,
            ifacturacion: searchCollectionOrderFleetContract.result.recordset[i].IFACTURACION,
            bactivo: searchCollectionOrderFleetContract.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'collection-order-fleet-contract', req.body, 'detailAdministrationProductionCollectionOrderFleetContractSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationDetailCollectionOrderFleetContract(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCollectionOrderFleetContract' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailCollectionOrderFleetContract = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let collectionOrderFleetContractData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        csolicitudcobrocontratoflota: requestBody.csolicitudcobrocontratoflota
    };
    let getCollectionOrderFleetContractData = await db.getCollectionOrderFleetContractDataQuery(collectionOrderFleetContractData).then((res) => res);
    if(getCollectionOrderFleetContractData.error){ return { status: false, code: 500, message: getCollectionOrderFleetContractData.error }; }
    if(getCollectionOrderFleetContractData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Collection Order Fleet Contract not found.' }; }
    let suscriptions = [];
    let getCollectionOrderFleetContractSuscriptionsData = await db.getCollectionOrderFleetContractSuscriptionsDataQuery(collectionOrderFleetContractData.csolicitudcobrocontratoflota).then((res) => res);
    if(getCollectionOrderFleetContractSuscriptionsData.error){ return { status: false, code: 500, message: getCollectionOrderFleetContractSuscriptionsData.error }; }
    if(getCollectionOrderFleetContractSuscriptionsData.result.rowsAffected > 0){
        for(let i = 0; i < getCollectionOrderFleetContractSuscriptionsData.result.recordset.length; i++){
            let suscription = {
                ccontratoflota: getCollectionOrderFleetContractSuscriptionsData.result.recordset[i].CCONTRATOFLOTA,
                xplaca: helper.decrypt(getCollectionOrderFleetContractSuscriptionsData.result.recordset[i].XPLACA),
                xmarca: getCollectionOrderFleetContractSuscriptionsData.result.recordset[i].XMARCA,
                xmodelo: getCollectionOrderFleetContractSuscriptionsData.result.recordset[i].XMODELO,
                xversion: getCollectionOrderFleetContractSuscriptionsData.result.recordset[i].XVERSION
            }
            suscriptions.push(suscription);
        }
    }
    let payments = [];
    let getCollectionOrderFleetContractPaymentsData = await db.getCollectionOrderFleetContractPaymentsDataQuery(collectionOrderFleetContractData.csolicitudcobrocontratoflota).then((res) => res);
    if(getCollectionOrderFleetContractPaymentsData.error){ return { status: false, code: 500, message: getCollectionOrderFleetContractPaymentsData.error }; }
    if(getCollectionOrderFleetContractPaymentsData.result.rowsAffected > 0){
        for(let i = 0; i < getCollectionOrderFleetContractPaymentsData.result.recordset.length; i++){
            let payment = {
                cpago: getCollectionOrderFleetContractPaymentsData.result.recordset[i].CPAGO,
                mpago: getCollectionOrderFleetContractPaymentsData.result.recordset[i].MPAGO,
                bpagado: getCollectionOrderFleetContractPaymentsData.result.recordset[i].BPAGADO
            }
            payments.push(payment);
        }
    }
    return {
        status: true,
        csolicitudcobrocontratoflota: getCollectionOrderFleetContractData.result.recordset[0].CSOLICITUDCOBROCONTRATOFLOTA,
        ccliente: getCollectionOrderFleetContractData.result.recordset[0].CCLIENTE,
        cestatusgeneral: getCollectionOrderFleetContractData.result.recordset[0].CESTATUSGENERAL,
        ifacturacion: getCollectionOrderFleetContractData.result.recordset[0].IFACTURACION,
        bactivo: getCollectionOrderFleetContractData.result.recordset[0].BACTIVO,
        suscriptions: suscriptions,
        payments: payments
    }
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'collection-order-fleet-contract', req.body, 'updateAdministrationProductionCollectionOrderFleetContractSchema');
    if(validateSchema.error){ 
        res.status(401).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdateCollectionOrderFleetContract(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateCollectionOrderFleetContract' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdateCollectionOrderFleetContract = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let collectionOrderFleetContractData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        csolicitudcobrocontratoflota: requestBody.csolicitudcobrocontratoflota,
        cestatusgeneral: requestBody.cestatusgeneral,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let updateCollectionOrderFleetContract = await db.updateCollectionOrderFleetContractQuery(collectionOrderFleetContractData).then((res) => res);
    if(updateCollectionOrderFleetContract.error){ return { status: false, code: 500, message: updateCollectionOrderFleetContract.error }; }
    if(updateCollectionOrderFleetContract.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Collection Order Fleet Contract not found.' }; }
    if(requestBody.payments){
        if(requestBody.payments.delete && requestBody.payments.delete.length){
            let deletePaymentsByCollectionOrderFleetContractUpdate = await db.deletePaymentsByCollectionOrderFleetContractUpdateQuery(requestBody.payments.delete, collectionOrderFleetContractData).then((res) => res);
            if(deletePaymentsByCollectionOrderFleetContractUpdate.error){ return { status: false, code: 500, message: deletePaymentsByCollectionOrderFleetContractUpdate.error }; }
            if(deletePaymentsByCollectionOrderFleetContractUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePaymentsByCollectionOrderFleetContractUpdate' }; }
        }
        if(requestBody.payments.update && requestBody.payments.update.length > 0){
            let updatePaymentsByCollectionOrderFleetContractUpdate = await db.updatePaymentsByCollectionOrderFleetContractUpdateQuery(requestBody.payments.update, collectionOrderFleetContractData).then((res) => res);
            if(updatePaymentsByCollectionOrderFleetContractUpdate.error){ return { status: false, code: 500, message: updatePaymentsByCollectionOrderFleetContractUpdate.error }; }
            if(updatePaymentsByCollectionOrderFleetContractUpdate.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Payment not found.' }; }
        }
        if(requestBody.payments.create && requestBody.payments.create.length > 0){
            let createPaymentsByCollectionOrderFleetContractUpdate = await db.createPaymentsByCollectionOrderFleetContractUpdateQuery(requestBody.payments.create, collectionOrderFleetContractData).then((res) => res);
            if(createPaymentsByCollectionOrderFleetContractUpdate.error){ return { status: false, code: 500, message: createPaymentsByCollectionOrderFleetContractUpdate.error }; }
            if(createPaymentsByCollectionOrderFleetContractUpdate.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPaymentsByCollectionOrderFleetContractUpdate' }; }
        }
    }
    return { status: true, csolicitudcobrocontratoflota: collectionOrderFleetContractData.csolicitudcobrocontratoflota };
}

module.exports = router;