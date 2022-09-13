const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchQuoteByFleet(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchQuoteByFleet' } });
        });
    }
});

const operationSearchQuoteByFleet = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente ? requestBody.ccliente : undefined,
        casociado: requestBody.casociado ? requestBody.casociado : undefined
    }
    let searchQuoteByFleet = await bd.searchQuoteByFleetQuery(searchData).then((res) => res);
    if(searchQuoteByFleet.error){ return { status: false, code: 500, message: searchQuoteByFleet.error }; }
    if(searchQuoteByFleet.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchQuoteByFleet.result.recordset.length; i++){
            jsonList.push({
                ccotizadorflota: searchQuoteByFleet.result.recordset[i].CCOTIZADORFLOTA,
                ccliente: searchQuoteByFleet.result.recordset[i].CCLIENTE,
                xcliente: helper.decrypt(searchQuoteByFleet.result.recordset[i].XCLIENTE),
                casociado: searchQuoteByFleet.result.recordset[i].CASOCIADO,
                xasociado: helper.decrypt(searchQuoteByFleet.result.recordset[i].XASOCIADO),
                bactivo: searchQuoteByFleet.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Quote By Fleet not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateQuoteByFleet(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateQuoteByFleet' } });
        });
    }
});

const operationCreateQuoteByFleet = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccliente', 'casociado', 'mmembresia', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let extraCoverages = [];
    if(requestBody.extraCoverages){
        extraCoverages = requestBody.extraCoverages;
        for(let i = 0; i < extraCoverages.length; i++){
            if(!helper.validateRequestObj(extraCoverages[i], ['ccoberturaextra'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
        }
    }
    let quoteByFleetData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        extraCoverages: extraCoverages ? extraCoverages : undefined,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        mmembresia: requestBody.mmembresia,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyQuoteByFleetAssociate = await bd.verifyQuoteByFleetAssociateToCreateQuery(quoteByFleetData).then((res) => res);
    if(verifyQuoteByFleetAssociate.error){ return { status: false, code: 500, message: verifyQuoteByFleetAssociate.error }; }
    if(verifyQuoteByFleetAssociate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-already-exist' }; }
    else{
        let createQuoteByFleet = await bd.createQuoteByFleetQuery(quoteByFleetData).then((res) => res);
        if(createQuoteByFleet.error){ return { status: false, code: 500, message: createQuoteByFleet.error }; }
        if(createQuoteByFleet.result.rowsAffected > 0){ return { status: true, ccotizadorflota: createQuoteByFleet.result.recordset[0].CCOTIZADORFLOTA }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createQuoteByFleet' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailQuoteByFleet(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailQuoteByFleet' } });
        });
    }
});

const operationDetailQuoteByFleet = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccotizadorflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteByFleetData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccotizadorflota: requestBody.ccotizadorflota
    };
    let getQuoteByFleetData = await bd.getQuoteByFleetDataQuery(quoteByFleetData).then((res) => res);
    if(getQuoteByFleetData.error){ return { status: false, code: 500, message: getQuoteByFleetData.error }; }
    if(getQuoteByFleetData.result.rowsAffected > 0){
        let extraCoverages = [];
        let getQuoteByFleetExtraCoveragesData = await bd.getQuoteByFleetExtraCoveragesDataQuery(quoteByFleetData.ccotizadorflota).then((res) => res);
        if(getQuoteByFleetExtraCoveragesData.error){ return { status: false, code: 500, message: getQuoteByFleetExtraCoveragesData.error }; }
        if(getQuoteByFleetExtraCoveragesData.result.rowsAffected > 0){
            for(let i = 0; i < getQuoteByFleetExtraCoveragesData.result.recordset.length; i++){
                let extraCoverage = {
                    ccoberturaextra: getQuoteByFleetExtraCoveragesData.result.recordset[i].CCOBERTURAEXTRA,
                    xcoberturaextra: helper.decrypt(getQuoteByFleetExtraCoveragesData.result.recordset[i].XCOBERTURAEXTRA)
                }
                extraCoverages.push(extraCoverage);
            }
        }
        return {
            status: true,
            ccotizadorflota: getQuoteByFleetData.result.recordset[0].CCOTIZADORFLOTA,
            ccliente: getQuoteByFleetData.result.recordset[0].CCLIENTE,
            casociado:  getQuoteByFleetData.result.recordset[0].CASOCIADO,
            mmembresia:  getQuoteByFleetData.result.recordset[0].MMEMBRESIA,
            bactivo: getQuoteByFleetData.result.recordset[0].BACTIVO,
            extraCoverages: extraCoverages
        }
    }else{ return { status: false, code: 404, message: 'Quote By Fleet not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateQuoteByFleet(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateQuoteByFleet' } });
        });
    }
});

const operationUpdateQuoteByFleet = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccotizadorflota', 'ccliente', 'casociado', 'mmembresia', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteByFleetData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccotizadorflota: requestBody.ccotizadorflota,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado,
        mmembresia: requestBody.mmembresia,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyQuoteByFleetAssociate = await bd.verifyQuoteByFleetAssociateToUpdateQuery(quoteByFleetData).then((res) => res);
    if(verifyQuoteByFleetAssociate.error){ return { status: false, code: 500, message: verifyQuoteByFleetAssociate.error }; }
    if(verifyQuoteByFleetAssociate.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'associate-already-exist' }; }
    else{
        let updateQuoteByFleet = await bd.updateQuoteByFleetQuery(quoteByFleetData).then((res) => res);
        if(updateQuoteByFleet.error){ return { status: false, code: 500, message: updateQuoteByFleet.error }; }
        if(updateQuoteByFleet.result.rowsAffected > 0){
            if(requestBody.extraCoverages){
                if(requestBody.extraCoverages.create && requestBody.extraCoverages.create.length > 0){
                    for(let i = 0; i < requestBody.extraCoverages.create.length; i++){
                        if(!helper.validateRequestObj(requestBody.extraCoverages.create[i], ['ccoberturaextra'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let createExtraCoverageByQuoteByFleetUpdate = await bd.createExtraCoverageByQuoteByFleetUpdateQuery(requestBody.extraCoverages.create, quoteByFleetData).then((res) => res);
                    if(createExtraCoverageByQuoteByFleetUpdate.error){ return { status: false, code: 500, message: createExtraCoverageByQuoteByFleetUpdate.error }; }
                    if(createExtraCoverageByQuoteByFleetUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createExtraCoverageByQuoteByFleetUpdate' }; }
                } 
                if(requestBody.extraCoverages.update && requestBody.extraCoverages.update.length > 0){
                    for(let i = 0; i < requestBody.extraCoverages.update.length; i++){
                        if(!helper.validateRequestObj(requestBody.extraCoverages.update[i], ['ccoberturaextra'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let updateExtraCoverageByQuoteByFleetUpdate = await bd.updateExtraCoverageByQuoteByFleetUpdateQuery(requestBody.extraCoverages.update, quoteByFleetData).then((res) => res);
                    if(updateExtraCoverageByQuoteByFleetUpdate.error){ return { status: false, code: 500, message: updateExtraCoverageByQuoteByFleetUpdate.error }; }
                    if(updateExtraCoverageByQuoteByFleetUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Extra Coverage not found.' }; }
                }
                if(requestBody.extraCoverages.delete && requestBody.extraCoverages.delete.length){
                    for(let i = 0; i < requestBody.extraCoverages.delete.length; i++){
                        if(!helper.validateRequestObj(requestBody.extraCoverages.delete[i], ['ccoberturaextra'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                    }
                    let deleteExtraCoverageByQuoteByFleetUpdate = await bd.deleteExtraCoverageByQuoteByFleetUpdateQuery(requestBody.extraCoverages.delete, quoteByFleetData).then((res) => res);
                    if(deleteExtraCoverageByQuoteByFleetUpdate.error){ return { status: false, code: 500, message: deleteExtraCoverageByQuoteByFleetUpdate.error }; }
                    if(deleteExtraCoverageByQuoteByFleetUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteExtraCoverageByQuoteByFleetUpdate' }; }
                }
            }
            return { status: true, ccotizadorflota: quoteByFleetData.ccotizadorflota }; 
        }
        else{ return { status: false, code: 404, message: 'Quote By Fleet not found.' }; }
    }
}

router.route('/approval/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationApprovalDetailQuoteByFleet(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationApprovalDetailQuoteByFleet' } });
        });
    }
});

const operationApprovalDetailQuoteByFleet = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania','ccotizadorflota'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteByFleetData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccotizadorflota: requestBody.ccotizadorflota
    };
    let getQuoteByFleetData = await bd.getQuoteByFleetDataQuery(quoteByFleetData).then((res) => res);
    if(getQuoteByFleetData.error){ return { status: false, code: 500, message: getQuoteByFleetData.error }; }
    if(getQuoteByFleetData.result.rowsAffected > 0){
        getQuoteByFleetApprovalData = await bd.getQuoteByFleetApprovalDataQuery(quoteByFleetData).then((res) => res);
        if(getQuoteByFleetApprovalData.error){ return { status: false, code: 500, message: getQuoteByFleetApprovalData.error }; }
        if(getQuoteByFleetApprovalData.result.rowsAffected > 0){
            return {
                status: true,
                ccotizadorflota: getQuoteByFleetData.result.recordset[0].CCOTIZADORFLOTA,
                ccliente: getQuoteByFleetData.result.recordset[0].CCLIENTE,
                casociado:  getQuoteByFleetData.result.recordset[0].CASOCIADO,
                mmembresia:  getQuoteByFleetData.result.recordset[0].MMEMBRESIA,
                bactivo: getQuoteByFleetData.result.recordset[0].BACTIVO,
                mperdidaparcial: getQuoteByFleetApprovalData.result.recordset[0].MPERDIDAPARCIAL,
                cimpuestoevento: getQuoteByFleetApprovalData.result.recordset[0].CIMPUESTOEVENTO,
                mhonorario: getQuoteByFleetApprovalData.result.recordset[0].MHONORARIO,
                cimpuestoprofesional: getQuoteByFleetApprovalData.result.recordset[0].CIMPUESTOPROFESIONAL,
                mgestionvial: getQuoteByFleetApprovalData.result.recordset[0].MGESTIONVIAL,
                cimpuestogestion: getQuoteByFleetApprovalData.result.recordset[0].CIMPUESTOGESTION,
                mtotalcreditofiscal: getQuoteByFleetApprovalData.result.recordset[0].MTOTALCREDITOFISCAL,
                mtotalcapital: getQuoteByFleetApprovalData.result.recordset[0].MTOTALCAPITAL
            }
        }else{
            return {
                status: true,
                ccotizadorflota: getQuoteByFleetData.result.recordset[0].CCOTIZADORFLOTA,
                ccliente: getQuoteByFleetData.result.recordset[0].CCLIENTE,
                casociado:  getQuoteByFleetData.result.recordset[0].CASOCIADO,
                mmembresia:  getQuoteByFleetData.result.recordset[0].MMEMBRESIA,
                bactivo: getQuoteByFleetData.result.recordset[0].BACTIVO
            }
        }
    }else{ return { status: false, code: 404, message: 'Quote By Fleet not found.' }; }
}

router.route('/approval/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationApprovalUpdateQuoteByFleet(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationApprovalUpdateQuoteByFleet' } });
        });
    }
});

const operationApprovalUpdateQuoteByFleet = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccotizadorflota', 'mperdidaparcial', 'cimpuestoevento', 'mhonorario', 'cimpuestoprofesional', 'mgestionvial', 'cimpuestogestion', 'mtotalcreditofiscal', 'mtotalcapital', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let quoteByFleetData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccotizadorflota: requestBody.ccotizadorflota,
        mperdidaparcial: requestBody.mperdidaparcial,
        ctipopago: requestBody.ctipopago,
        cimpuestoevento: requestBody.cimpuestoevento,
        mhonorario: requestBody.mhonorario,
        cimpuestoprofesional: requestBody.cimpuestoprofesional,
        mgestionvial: requestBody.mgestionvial,
        cimpuestogestion: requestBody.cimpuestogestion,
        mtotalcreditofiscal: requestBody.mtotalcreditofiscal,
        mtotalcapital: requestBody.mtotalcapital,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    let updateApprovalQuoteByFleet = await bd.updateApprovalQuoteByFleetQuery(quoteByFleetData).then((res) => res);
    if(updateApprovalQuoteByFleet.error){ return { status: false, code: 500, message: updateApprovalQuoteByFleet.error }; }
    if(updateApprovalQuoteByFleet.result.rowsAffected > 0){ return { status: true, ccotizadorflota: quoteByFleetData.ccotizadorflota }; }
    else{ return { status: false, code: 404, message: 'Quote By Fleet not found.' }; }
}

module.exports = router;