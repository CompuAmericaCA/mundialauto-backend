const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchProcess(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchProcess' } });
        });
    }
});

const operationSearchProcess = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xproceso: requestBody.xproceso ? requestBody.xproceso.toUpperCase() : undefined
    };
    let searchProcess = await bd.searchProcessQuery(searchData).then((res) => res);
    if(searchProcess.error){ return  { status: false, code: 500, message: searchProcess.error }; }
    if(searchProcess.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchProcess.result.recordset.length; i++){
            jsonList.push({
                cproceso: searchProcess.result.recordset[i].CPROCESO,
                xproceso: searchProcess.result.recordset[i].XPROCESO,
                bactivo: searchProcess.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Process not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateProcess(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateProcess' } });
        });
    }
});

const operationCreateProcess = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'xproceso', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let processData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        xproceso: requestBody.xproceso.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyProcessName = await bd.verifyProcessNameToCreateQuery(processData).then((res) => res);
    if(verifyProcessName.error){ return { status: false, code: 500, message: verifyProcessName.error }; }
    if(verifyProcessName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'process-name-already-exist' }; }
    else{
        let createProcess = await bd.createProcessQuery(processData).then((res) => res);
        if(createProcess.error){ return { status: false, code: 500, message: createProcess.error }; }
        if(createProcess.result.rowsAffected > 0){ return { status: true, cproceso: createProcess.result.recordset[0].CPROCESO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createProcess' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailProcess(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailProcess' } });
        });
    }
});

const operationDetailProcess = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cproceso'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let processData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cproceso: requestBody.cproceso
    };
    let getProcessData = await bd.getProcessDataQuery(processData).then((res) => res);
    if(getProcessData.error){ return { status: false, code: 500, message: getProcessData.error }; }
    if(getProcessData.result.rowsAffected > 0){
        return {
            status: true,
            cproceso: getProcessData.result.recordset[0].CPROCESO,
            xproceso: getProcessData.result.recordset[0].XPROCESO,
            bactivo: getProcessData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Process not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateProcess(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateProcess' } });
        });
    }
});

const operationUpdateProcess = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cproceso', 'xproceso', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let processData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cproceso: requestBody.cproceso,
        xproceso: requestBody.xproceso.toUpperCase(),
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion 
    };
    let verifyProcessName = await bd.verifyProcessNameToUpdateQuery(processData).then((res) => res);
    if(verifyProcessName.error){ return { status: false, code: 500, message: verifyProcessName.error }; }
    if(verifyProcessName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'process-name-already-exist'}; }
    else{
        let updateProcess = await bd.updateProcessQuery(processData).then((res) => res);
        if(updateProcess.error){ return { status: false, code: 500, message: updateProcess.error }; }
        if(updateProcess.result.rowsAffected > 0){ return { status: true, cproceso: processData.cproceso }; }
        else{ return { status: false, code: 404, message: 'Process not found.' }; }
    }
}

router.route('/configuration/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationConfigurationDetailProcess(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConfigurationDetailProcess' } });
        });
    }
});

const operationConfigurationDetailProcess = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cproceso'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let processData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cproceso: requestBody.cproceso
    };
    let getProcessData = await bd.getProcessDataQuery(processData).then((res) => res);
    if(getProcessData.error){ return { status: false, code: 500, message: getProcessData.error }; }
    if(getProcessData.result.rowsAffected > 0){
        let cancellationCauses = [];
        let getCancellationCausesData = await bd.getCancellationCausesByProcessDataQuery(processData.cproceso).then((res) => res);
        if(getCancellationCausesData.error){ return { status: false, code: 500, message: getCancellationCausesData.error }; }
        if(getCancellationCausesData.result.rowsAffected > 0){
            for(let i = 0; i < getCancellationCausesData.result.recordset.length; i++){
                let cancellationCause = {
                    ccausaanulacion: getCancellationCausesData.result.recordset[i].CCAUSAANULACION,
                    xcausaanulacion: getCancellationCausesData.result.recordset[i].XCAUSAANULACION
                }
                cancellationCauses.push(cancellationCause);
            }
        }
        let generalStatus = [];
        let getGeneralStatusData = await bd.getGeneralStatusByProcessDataQuery(processData.cproceso).then((res) => res);
        if(getGeneralStatusData.error){ return { status: false, code: 500, message: getGeneralStatusData.error }; }
        if(getGeneralStatusData.result.rowsAffected > 0){
            for(let i = 0; i < getGeneralStatusData.result.recordset.length; i++){
                let status = {
                    cestatusgeneral: getGeneralStatusData.result.recordset[i].CESTATUSGENERAL,
                    xestatusgeneral: getGeneralStatusData.result.recordset[i].XESTATUSGENERAL,
                    bdefault: getGeneralStatusData.result.recordset[i].BDEFAULT,
                    cgrupo: getGeneralStatusData.result.recordset[i].CGRUPO,
                    cmodulo: getGeneralStatusData.result.recordset[i].CMODULO,
                    bgestionable: getGeneralStatusData.result.recordset[i].BGESTIONABLE
                }
                generalStatus.push(status);
            }
        }
        let documents = [];
        let getDocumentsData = await bd.getDocumentsByProcessDataQuery(processData.cproceso).then((res) => res);
        if(getDocumentsData.error){ return { status: false, code: 500, message: getDocumentsData.error }; }
        if(getDocumentsData.result.rowsAffected > 0){
            for(let i = 0; i < getDocumentsData.result.recordset.length; i++){
                let document = {
                    cdocumento: getDocumentsData.result.recordset[i].CDOCUMENTO,
                    xdocumento: getDocumentsData.result.recordset[i].XDOCUMENTO
                }
                documents.push(document);
            }
        }
        let modules = [];
        let getProcessModulesData = await bd.getModulesByProcessDataQuery(processData.cproceso).then((res) => res);
        if(getProcessModulesData.error){ return { status: false, code: 500, message: getProcessModulesData.error }; }
        if(getProcessModulesData.result.rowsAffected > 0){
            for(let i = 0; i < getProcessModulesData.result.recordset.length; i++){
                let module = {
                    cgrupo: getProcessModulesData.result.recordset[i].CGRUPO,
                    xgrupo: getProcessModulesData.result.recordset[i].XGRUPO,
                    cmodulo: getProcessModulesData.result.recordset[i].CMODULO,
                    xmodulo: getProcessModulesData.result.recordset[i].XMODULO
                }
                modules.push(module);
            }
        }
        return {
            status: true,
            cproceso: getProcessData.result.recordset[0].CPROCESO,
            xproceso: getProcessData.result.recordset[0].XPROCESO,
            cancellationCauses: cancellationCauses,
            generalStatus: generalStatus,
            documents: documents,
            modules: modules,
            bactivo: getProcessData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Process not found.' }; }
}

router.route('/configuration/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationConfigurationUpdateProcess(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConfigurationUpdateProcess' } });
        });
    }
});

const operationConfigurationUpdateProcess = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais','ccompania','cproceso', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let processData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cproceso: requestBody.cproceso,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyProcessExist = await bd.getProcessDataQuery(processData).then((res) => res);
    if(verifyProcessExist.error){ return { status: false, code: 500, message: verifyProcessExist.error }; }
    if(verifyProcessExist.result.rowsAffected > 0)
    {
        if(requestBody.cancellationCauses){
            if(requestBody.cancellationCauses.create && requestBody.cancellationCauses.create.length > 0){
                for(let i = 0; i < requestBody.cancellationCauses.create.length; i++){
                    if(!helper.validateRequestObj(requestBody.cancellationCauses.create[i], ['ccausaanulacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let createCancellationCauseByProcessUpdate = await bd.createCancellationCauseByProcessUpdateQuery(requestBody.cancellationCauses.create, processData).then((res) => res);
                if(createCancellationCauseByProcessUpdate.error){ return { status: false, code: 500, message: createCancellationCauseByProcessUpdate.error }; }
                if(createCancellationCauseByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCancellationCauseByProcessUpdate' }; }
            } 
            if(requestBody.cancellationCauses.update && requestBody.cancellationCauses.update.length > 0){
                for(let i = 0; i < requestBody.cancellationCauses.update.length; i++){
                    if(!helper.validateRequestObj(requestBody.cancellationCauses.update[i], ['ccausaanulacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let updateCancellationCauseByProcessUpdate = await bd.updateCancellationCauseByProcessUpdateQuery(requestBody.cancellationCauses.update, processData).then((res) => res);
                if(updateCancellationCauseByProcessUpdate.error){ return { status: false, code: 500, message: updateCancellationCauseByProcessUpdate.error }; }
                if(updateCancellationCauseByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Cancellation Cause not found.' }; }
            }
            if(requestBody.cancellationCauses.delete && requestBody.cancellationCauses.delete.length){
                for(let i = 0; i < requestBody.cancellationCauses.delete.length; i++){
                    if(!helper.validateRequestObj(requestBody.cancellationCauses.delete[i], ['ccausaanulacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let deleteCancellationCauseByProcessUpdate = await bd.deleteCancellationCauseByProcessUpdateQuery(requestBody.cancellationCauses.delete, processData).then((res) => res);
                if(deleteCancellationCauseByProcessUpdate.error){ return { status: false, code: 500, message: deleteCancellationCauseByProcessUpdate.error }; }
                if(deleteCancellationCauseByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteCancellationCauseByProcessUpdate' }; }
            }
        }
        if(requestBody.generalStatus){
            if(requestBody.generalStatus.create && requestBody.generalStatus.create.length > 0){
                for(let i = 0; i < requestBody.generalStatus.create.length; i++){
                    if(!helper.validateRequestObj(requestBody.generalStatus.create[i], ['cestatusgeneral', 'bdefault', 'bgestionable'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let createGeneralStatusByProcessUpdate = await bd.createGeneralStatusByProcessUpdateQuery(requestBody.generalStatus.create, processData).then((res) => res);
                if(createGeneralStatusByProcessUpdate.error){ return { status: false, code: 500, message: createGeneralStatusByProcessUpdate.error }; }
                if(createGeneralStatusByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCancellationCauseByProcessUpdate' }; }
            } 
            if(requestBody.generalStatus.update && requestBody.generalStatus.update.length > 0){
                for(let i = 0; i < requestBody.generalStatus.update.length; i++){
                    if(!helper.validateRequestObj(requestBody.generalStatus.update[i], ['cestatusgeneral', 'bdefault', 'bgestionable'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let updateGeneralStatusByProcessUpdate = await bd.updateGeneralStatusByProcessUpdateQuery(requestBody.generalStatus.update, processData).then((res) => res);
                if(updateGeneralStatusByProcessUpdate.error){ return { status: false, code: 500, message: updateGeneralStatusByProcessUpdate.error }; }
                if(updateGeneralStatusByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'General Status not found.' }; }
            }
            if(requestBody.generalStatus.delete && requestBody.generalStatus.delete.length){
                for(let i = 0; i < requestBody.generalStatus.delete.length; i++){
                    if(!helper.validateRequestObj(requestBody.generalStatus.delete[i], ['cestatusgeneral'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let deleteGeneralStatusByProcessUpdate = await bd.deleteGeneralStatusByProcessUpdateQuery(requestBody.generalStatus.delete, processData).then((res) => res);
                if(deleteGeneralStatusByProcessUpdate.error){ return { status: false, code: 500, message: deleteGeneralStatusByProcessUpdate.error }; }
                if(deleteGeneralStatusByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteCancellationCauseByProcessUpdate' }; }
            }
        }
        if(requestBody.documents){
            if(requestBody.documents.create && requestBody.documents.create.length > 0){
                for(let i = 0; i < requestBody.documents.create.length; i++){
                    if(!helper.validateRequestObj(requestBody.documents.create[i], ['cdocumento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let createDocumentByProcessUpdate = await bd.createDocumentByProcessUpdateQuery(requestBody.documents.create, processData).then((res) => res);
                if(createDocumentByProcessUpdate.error){ return { status: false, code: 500, message: createDocumentByProcessUpdate.error }; }
                if(createDocumentByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCancellationCauseByProcessUpdate' }; }
            } 
            if(requestBody.documents.update && requestBody.documents.update.length > 0){
                for(let i = 0; i < requestBody.documents.update.length; i++){
                    if(!helper.validateRequestObj(requestBody.documents.update[i], ['cdocumento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let updateDocumentByProcessUpdate = await bd.updateDocumentByProcessUpdateQuery(requestBody.documents.update, processData).then((res) => res);
                if(updateDocumentByProcessUpdate.error){ return { status: false, code: 500, message: updateDocumentByProcessUpdate.error }; }
                if(updateDocumentByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Document not found.' }; }
            }
            if(requestBody.documents.delete && requestBody.documents.delete.length){
                for(let i = 0; i < requestBody.documents.delete.length; i++){
                    if(!helper.validateRequestObj(requestBody.documents.delete[i], ['cdocumento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let deleteDocumentByProcessUpdate = await bd.deleteDocumentByProcessUpdateQuery(requestBody.documents.delete, processData).then((res) => res);
                if(deleteDocumentByProcessUpdate.error){ return { status: false, code: 500, message: deleteDocumentByProcessUpdate.error }; }
                if(deleteDocumentByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteCancellationCauseByProcessUpdate' }; }
            }
        }
        if(requestBody.modules){
            if(requestBody.modules.create && requestBody.modules.create.length > 0){
                for(let i = 0; i < requestBody.modules.create.length; i++){
                    if(!helper.validateRequestObj(requestBody.modules.create[i], ['cgrupo','cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let createModulesByProcessUpdate = await bd.createModulesByProcessUpdateQuery(requestBody.modules.create, processData).then((res) => res);
                if(createModulesByProcessUpdate.error){ return { status: false, code: 500, message: createModulesByProcessUpdate.error }; }
                if(createModulesByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createModulesByProcessUpdate' }; }
            } 
            if(requestBody.modules.update && requestBody.modules.update.length > 0){
                for(let i = 0; i < requestBody.modules.update.length; i++){
                    if(!helper.validateRequestObj(requestBody.modules.update[i], ['cgrupo','cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let updateModulesByProcessUpdate = await bd.updateModulesByProcessUpdateQuery(requestBody.modules.update, processData).then((res) => res);
                if(updateModulesByProcessUpdate.error){ return { status: false, code: 500, message: updateModulesByProcessUpdate.error }; }
                if(updateModulesByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Module not found.' }; }
            }
            if(requestBody.modules.delete && requestBody.modules.delete.length){
                for(let i = 0; i < requestBody.modules.delete.length; i++){
                    if(!helper.validateRequestObj(requestBody.modules.delete[i], ['cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                }
                let deleteModulesByProcessUpdate = await bd.deleteModulesByProcessUpdateQuery(requestBody.modules.delete, processData).then((res) => res);
                if(deleteModulesByProcessUpdate.error){ return { status: false, code: 500, message: deleteModulesByProcessUpdate.error }; }
                if(deleteModulesByProcessUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteModulesByProcessUpdate' }; }
            }
        }
        return { status: true, cproceso: processData.cproceso };
    }else{ return { status: false, code: 404, message: 'Process not found.' }; }
}

module.exports = router;