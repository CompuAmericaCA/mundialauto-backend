const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchNotificationType' } });
        });
    }
});

const operationSearchNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiponotificacion: requestBody.xtiponotificacion ? requestBody.xtiponotificacion.toUpperCase() : undefined
    };
    let searchNotificationType = await bd.searchNotificationTypeQuery(searchData).then((res) => res);
    if(searchNotificationType.error){ return  { status: false, code: 500, message: searchNotificationType.error }; }
    if(searchNotificationType.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchNotificationType.result.recordset.length; i++){
            jsonList.push({
                ctiponotificacion: searchNotificationType.result.recordset[i].CTIPONOTIFICACION,
                xtiponotificacion: searchNotificationType.result.recordset[i].XTIPONOTIFICACION,
                bactivo: searchNotificationType.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Notification Type not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateNotificationType' } });
        });
    }
});

const operationCreateNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xtiponotificacion', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xtiponotificacion: requestBody.xtiponotificacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyNotificationTypeName = await bd.verifyNotificationTypeNameToCreateQuery(notificationTypeData).then((res) => res);
    if(verifyNotificationTypeName.error){ return { status: false, code: 500, message: verifyNotificationTypeName.error }; }
    if(verifyNotificationTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'notification-type-name-already-exist' }; }
    else{
        let createNotificationType = await bd.createNotificationTypeQuery(notificationTypeData).then((res) => res);
        if(createNotificationType.error){ return { status: false, code: 500, message: createNotificationType.error }; }
        if(createNotificationType.result.rowsAffected > 0){ return { status: true, ctiponotificacion: createNotificationType.result.recordset[0].CTIPONOTIFICACION }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createNotificationType' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailNotificationType' } });
        });
    }
});

const operationDetailNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctiponotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiponotificacion: requestBody.ctiponotificacion
    };
    let getNotificationTypeData = await bd.getNotificationTypeDataQuery(notificationTypeData).then((res) => res);
    if(getNotificationTypeData.error){ return { status: false, code: 500, message: getNotificationTypeData.error }; }
    if(getNotificationTypeData.result.rowsAffected > 0){
        return {
            status: true,
            ctiponotificacion: getNotificationTypeData.result.recordset[0].CTIPONOTIFICACION,
            xtiponotificacion: getNotificationTypeData.result.recordset[0].XTIPONOTIFICACION,
            bactivo: getNotificationTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Notification Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateNotificationType' } });
        });
    }
});

const operationUpdateNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiponotificacion', 'xtiponotificacion', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationTypeData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        ctiponotificacion: requestBody.ctiponotificacion,
        xtiponotificacion: requestBody.xtiponotificacion.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyNotificationTypeName = await bd.verifyNotificationTypeNameToUpdateQuery(notificationTypeData).then((res) => res);
    if(verifyNotificationTypeName.error){ return { status: false, code: 500, message: verifyNotificationTypeName.error }; }
    if(verifyNotificationTypeName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'notification-type-name-already-exist'}; }
    else{
        let updateNotificationType = await bd.updateNotificationTypeQuery(notificationTypeData).then((res) => res);
        if(updateNotificationType.error){ return { status: false, code: 500, message: updateNotificationType.error }; }
        if(updateNotificationType.result.rowsAffected > 0){ return { status: true, ctiponotificacion: notificationTypeData.ctiponotificacion }; }
        else{ return { status: false, code: 404, message: 'Notification Type not found.' }; }
    }
}

router.route('/configuration/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationConfigurationDetailNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConfigurationDetailNotificationType' } });
        });
    }
});

const operationConfigurationDetailNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctiponotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiponotificacion: requestBody.ctiponotificacion
    };
    let getNotificationTypeData = await bd.getNotificationTypeDataQuery(notificationTypeData).then((res) => res);
    if(getNotificationTypeData.error){ return { status: false, code: 500, message: getNotificationTypeData.error }; }
    if(getNotificationTypeData.result.rowsAffected > 0){
        let services = [];
        let getServicesByNotificationTypeData = await bd.getServicesByNotificationTypeDataQuery(notificationTypeData.ctiponotificacion).then((res) => res);
        if(getServicesByNotificationTypeData.error){ return { status: false, code: 500, message: getServicesByNotificationTypeData.error }; }
        if(getServicesByNotificationTypeData.result.rowsAffected > 0){
            for(let i = 0; i < getServicesByNotificationTypeData.result.recordset.length; i++){
                let service = {
                    cservicio: getServicesByNotificationTypeData.result.recordset[i].CSERVICIO,
                    xservicio: getServicesByNotificationTypeData.result.recordset[i].XSERVICIO,
                    ctiposervicio: getServicesByNotificationTypeData.result.recordset[i].CTIPOSERVICIO,
                    xtiposervicio: getServicesByNotificationTypeData.result.recordset[i].XTIPOSERVICIO
                }
                services.push(service);
            }
        }
        return {
            status: true,
            ctiponotificacion: getNotificationTypeData.result.recordset[0].CTIPONOTIFICACION,
            xtiponotificacion: getNotificationTypeData.result.recordset[0].XTIPONOTIFICACION,
            services: services,
            bactivo: getNotificationTypeData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Notification Type not found.' }; }
}

router.route('/configuration/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationConfigurationUpdateNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConfigurationUpdateNotificationType' } });
        });
    }
});

const operationConfigurationUpdateNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','ctiponotificacion', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let notificationTypeData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiponotificacion: requestBody.ctiponotificacion,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyNotificationTypeExist = await bd.getNotificationTypeDataQuery(notificationTypeData).then((res) => res);
    if(verifyNotificationTypeExist.error){ return { status: false, code: 500, message: verifyNotificationTypeExist.error }; }
    if(verifyNotificationTypeExist.result.rowsAffected > 0)
    {
        if(requestBody.services){
            if(requestBody.services.create && requestBody.services.create.length > 0){
                for(let i = 0; i < requestBody.services.create.length; i++){
                    if(!helper.validateRequestObj(requestBody.services.create[i], ['cservicio', 'ctiposervicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let createServicesByNotificationTypeUpdate = await bd.createServicesByNotificationTypeUpdateQuery(requestBody.services.create, notificationTypeData).then((res) => res);
                if(createServicesByNotificationTypeUpdate.error){ return { status: false, code: 500, message: createServicesByNotificationTypeUpdate.error }; }
                if(createServicesByNotificationTypeUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServicesByNotificationTypeUpdate' }; }
            } 
            if(requestBody.services.update && requestBody.services.update.length > 0){
                for(let i = 0; i < requestBody.services.update.length; i++){
                    if(!helper.validateRequestObj(requestBody.services.update[i], ['cservicio', 'ctiposervicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let updateServicesByNotificationTypeUpdate = await bd.updateServicesByNotificationTypeUpdateQuery(requestBody.services.update, notificationTypeData).then((res) => res);
                if(updateServicesByNotificationTypeUpdate.error){ return { status: false, code: 500, message: updateCancellationCauseByProcessUpdate.error }; }
                if(updateServicesByNotificationTypeUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Service not found.' }; }
            }
            if(requestBody.services.delete && requestBody.services.delete.length){
                for(let i = 0; i < requestBody.services.delete.length; i++){
                    if(!helper.validateRequestObj(requestBody.services.delete[i], ['cservicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let deleteServicesByNotificationTypeUpdate = await bd.deleteServicesByNotificationTypeUpdateQuery(requestBody.services.delete, notificationTypeData).then((res) => res);
                if(deleteServicesByNotificationTypeUpdate.error){ return { status: false, code: 500, message: deleteServicesByNotificationTypeUpdate.error }; }
                if(deleteServicesByNotificationTypeUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteServicesByNotificationTypeUpdate' }; }
            }
        }
        return { status: true, ctiponotificacion: notificationTypeData.ctiponotificacion };
    }else{ return { status: false, code: 404, message: 'Notification Type not found.' }; }
}

module.exports = router;