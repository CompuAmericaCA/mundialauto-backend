const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const { request } = require('express');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBroker(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBroker' } });
        });
    }
});

const operationSearchBroker = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ncorredor: requestBody.ncorredor ? helper.encrypt(requestBody.ncorredor) : undefined,
        cactividadempresa: requestBody.cactividadempresa ? requestBody.cactividadempresa : undefined,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido.toUpperCase()) : undefined
    };
    let searchBroker = await bd.searchBrokerQuery(searchData).then((res) => res);
    if(searchBroker.error){ return  { status: false, code: 500, message: searchBroker.error }; }
    if(searchBroker.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBroker.result.recordset.length; i++){
            jsonList.push({
                ccorredor: searchBroker.result.recordset[i].CCORREDOR,
                ncorredor: helper.decrypt(searchBroker.result.recordset[i].NCORREDOR),
                xnombre: helper.decrypt(searchBroker.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(searchBroker.result.recordset[i].XAPELLIDO),
                cactividadempresa: searchBroker.result.recordset[i].CACTIVIDADEMPRESA,
                xactividadempresa: searchBroker.result.recordset[i].XACTIVIDADEMPRESA,
                xdocidentidad: helper.decrypt(searchBroker.result.recordset[i].XDOCIDENTIDAD),
                bactivo: searchBroker.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Owner not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code:400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateBroker(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateBroker' } });
        });
    }
});

const operationCreateBroker = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ncorredor', 'xnombre', 'xapellido', 'cactividadempresa', 'ctipodocidentidad', 'xdocidentidad', 'xtelefono', 'xemail', 'xdireccion', 'cestado', 'cciudad', 'bactivo', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let banks = [];
    if(requestBody.banks){
        banks = requestBody.banks;
        for(let i = 0; i < banks.length; i++){
            if(!helper.validateRequestObj(banks[i], ['cbanco', 'ctipocuentabancaria', 'xnumerocuenta'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
            banks[i].xnumerocuenta = helper.encrypt(banks[i].xnumerocuenta);
        }
    }
    let brokerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ncorredor: helper.encrypt(requestBody.ncorredor),
        banks: banks ? banks : undefined,
        xnombre: helper.encrypt(requestBody.xnombre.toUpperCase()),
        xapellido: helper.encrypt(requestBody.xapellido.toUpperCase()),
        cactividadempresa: requestBody.cactividadempresa,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        bactivo: requestBody.bactivo,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyBrokerNumber = await bd.verifyBrokerNumberToCreateQuery(brokerData).then((res) => res);
    if(verifyBrokerNumber.error){ return { status: false, code: 500, message: verifyBrokerNumber.error }; }
    if(verifyBrokerNumber.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'broker-number-already-exist' }; }
    else{
        let verifyBrokerIdentification = await bd.verifyBrokerIdentificationToCreateQuery(brokerData).then((res) => res);
        if(verifyBrokerIdentification.error){ return { status: false, code: 500, message: verifyBrokerIdentification.error }; }
        if(verifyBrokerIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
        else{
            let createBroker = await bd.createBrokerQuery(brokerData).then((res) => res);
            if(createBroker.error){ return { status: false, code: 500, message: createBroker.error }; }
            if(createBroker.result.rowsAffected > 0){ return { status: true, ccorredor: createBroker.result.recordset[0].CCORREDOR }; }
            else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBroker' }; }
        }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailBroker(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailBroker' } });
        });
    }
});

const operationDetailBroker = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccorredor'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let brokerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccorredor: requestBody.ccorredor
    };
    let getBrokerData = await bd.getBrokerDataQuery(brokerData).then((res) => res);
    if(getBrokerData.error){ return { status: false, code: 500, message: getBrokerData.error }; }
    if(getBrokerData.result.rowsAffected > 0){
        let banks = [];
        let getBrokerBanksData = await bd.getBrokerBanksDataQuery(brokerData.ccorredor).then((res) => res);
        if(getBrokerBanksData.error){ return { status: false, code: 500, message: getBrokerBanksData.error }; }
        if(getBrokerBanksData.result.rowsAffected > 0){
            for(let i = 0; i < getBrokerBanksData.result.recordset.length; i++){
                let bank = {
                    cbanco: getBrokerBanksData.result.recordset[i].CBANCO,
                    xbanco: getBrokerBanksData.result.recordset[i].XBANCO,
                    ctipocuentabancaria: getBrokerBanksData.result.recordset[i].CTIPOCUENTABANCARIA,
                    xtipocuentabancaria: getBrokerBanksData.result.recordset[i].XTIPOCUENTABANCARIA,
                    xnumerocuenta: helper.decrypt(getBrokerBanksData.result.recordset[i].XNUMEROCUENTA)
                }
                banks.push(bank);
            }
        }
        return {
            status: true,
            ccorredor: getBrokerData.result.recordset[0].CCORREDOR,
            ncorredor: helper.decrypt(getBrokerData.result.recordset[0].NCORREDOR),
            xnombre: helper.decrypt(getBrokerData.result.recordset[0].XNOMBRE),
            xapellido: helper.decrypt(getBrokerData.result.recordset[0].XAPELLIDO),
            cactividadempresa: getBrokerData.result.recordset[0].CACTIVIDADEMPRESA,
            ctipodocidentidad: getBrokerData.result.recordset[0].CTIPODOCIDENTIDAD,
            xdocidentidad: helper.decrypt(getBrokerData.result.recordset[0].XDOCIDENTIDAD),
            xtelefono: helper.decrypt(getBrokerData.result.recordset[0].XTELEFONO),
            xemail: helper.decrypt(getBrokerData.result.recordset[0].XEMAIL),
            xdireccion: helper.decrypt(getBrokerData.result.recordset[0].XDIRECCION),
            cestado: getBrokerData.result.recordset[0].CESTADO,
            cciudad: getBrokerData.result.recordset[0].CCIUDAD,
            bactivo: getBrokerData.result.recordset[0].BACTIVO,
            banks: banks
        }
    }else{ return { status: false, code: 404, message: 'Broker not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateBroker(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateBroker' } });
        });
    }
});

const operationUpdateBroker = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccorredor', 'ncorredor', 'xnombre', 'xapellido', 'cactividadempresa', 'ctipodocidentidad', 'xdocidentidad', 'xtelefono', 'xemail', 'xdireccion', 'cestado', 'cciudad', 'bactivo', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let brokerData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccorredor: requestBody.ccorredor,
        ncorredor: helper.encrypt(requestBody.ncorredor),
        xnombre: helper.encrypt(requestBody.xnombre.toUpperCase()),
        xapellido: helper.encrypt(requestBody.xapellido.toUpperCase()),
        cactividadempresa: requestBody.cactividadempresa,
        ctipodocidentidad: requestBody.ctipodocidentidad,
        xdocidentidad: helper.encrypt(requestBody.xdocidentidad),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        bactivo: requestBody.bactivo,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyBrokerNumber = await bd.verifyBrokerNumberToUpdateQuery(brokerData).then((res) => res);
    if(verifyBrokerNumber.error){ return { status: false, code: 500, message: verifyBrokerNumber.error }; }
    if(verifyBrokerNumber.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'broker-number-already-exist'}; }
    else{
        let verifyBrokerIdentification = await bd.verifyBrokerIdentificationToUpdateQuery(brokerData).then((res) => res);
        if(verifyBrokerIdentification.error){ return { status: false, code: 500, message: verifyBrokerIdentification.error }; }
        if(verifyBrokerIdentification.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'identification-document-already-exist' }; }
        else{
            let updateBroker = await bd.updateBrokerQuery(brokerData).then((res) => res);
            if(updateBroker.error){ return { status: false, code: 500, message: updateBroker.error }; }
            if(updateBroker.result.rowsAffected > 0){
                if(requestBody.banks){
                    if(requestBody.banks.create && requestBody.banks.create.length > 0){
                        for(let i = 0; i < requestBody.banks.create.length; i++){
                            if(!helper.validateRequestObj(requestBody.banks.create[i], ['cbanco','ctipocuentabancaria','xnumerocuenta'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                            requestBody.banks.create[i].xnumerocuenta = helper.encrypt(requestBody.banks.create[i].xnumerocuenta);
                        }
                        let createBanksByBrokerUpdate = await bd.createBanksByBrokerUpdateQuery(requestBody.banks.create, brokerData).then((res) => res);
                        if(createBanksByBrokerUpdate.error){ return { status: false, code: 500, message: createBanksByBrokerUpdate.error }; }
                        if(createBanksByBrokerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createBanksByBrokerUpdate' }; }
                    } 
                    if(requestBody.banks.update && requestBody.banks.update.length > 0){
                        for(let i = 0; i < requestBody.banks.update.length; i++){
                            if(!helper.validateRequestObj(requestBody.banks.update[i], ['cbanco','ctipocuentabancaria','xnumerocuenta'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                            requestBody.banks.update[i].xnumerocuenta = helper.encrypt(requestBody.banks.update[i].xnumerocuenta);
                        }
                        let updateBanksByBrokerUpdate = await bd.updateBanksByBrokerUpdateQuery(requestBody.banks.update, brokerData).then((res) => res);
                        if(updateBanksByBrokerUpdate.error){ return { status: false, code: 500, message: updateBanksByBrokerUpdate.error }; }
                        if(updateBanksByBrokerUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Bank not found.' }; }
                    }
                    if(requestBody.banks.delete && requestBody.banks.delete.length){
                        for(let i = 0; i < requestBody.banks.delete.length; i++){
                            if(!helper.validateRequestObj(requestBody.banks.delete[i], ['cbanco'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
                        }
                        let deleteBanksByBrokerUpdate = await bd.deleteBanksByBrokerUpdateQuery(requestBody.banks.delete, brokerData).then((res) => res);
                        if(deleteBanksByBrokerUpdate.error){ return { status: false, code: 500, message: deleteBanksByBrokerUpdate.error }; }
                        if(deleteBanksByBrokerUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteBanksByBrokerUpdate' }; }
                    }
                }
                return { status: true, ccorredor: brokerData.ccorredor }; 
            }
            else{ return { status: false, code: 404, message: 'Broker not found.' }; }
        }
    }
}

router.route('/search-broker-individual').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBrokerIndividual(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBrokerIndividual' } });
        });
    }
});

const operationSearchBrokerIndividual = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccorredor: requestBody.ccorredor
    };
    let searchBrokerIndividual = await bd.searchBrokerIndividualQuery(searchData).then((res) => res);
    if(searchBrokerIndividual.error){ return  { status: false, code: 500, message: searchBrokerIndividual.error }; }
        return { status: true, 
                 ccorredor: searchBrokerIndividual.result.recordset[0].CCORREDOR,
                 xcorredor: searchBrokerIndividual.result.recordset[0].XCORREDOR
               };
}

module.exports = router;