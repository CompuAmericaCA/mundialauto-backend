const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const db = require('../data/db');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchParentPolicy(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchFleetContractManagement' } });
        });
    }
});

const operationSearchParentPolicy = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccarga: requestBody.ccarga ? requestBody.ccarga : undefined,
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
    };
    let searchParentPolicy = await bd.searchParentPolicyQuery(searchData).then((res) => res);
    if(searchParentPolicy.error){ return  { status: false, code: 500, message: searchParentPolicyQuery.error }; }
    if(searchParentPolicy.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchParentPolicy.result.recordset.length; i++){
            jsonList.push({
                ccarga: searchParentPolicy.result.recordset[i].ccarga,
                xmoneda: searchParentPolicy.result.recordset[i].xmoneda,
                xmetodologiapago: searchParentPolicy.result.recordset[i].XMETODOLOGIAPAGO,
                xdescripcion: searchParentPolicy.result.recordset[i].xdescripcion_l,
                xpoliza: searchParentPolicy.result.recordset[i].xpoliza,
                nrecibos: searchParentPolicy.result.recordset[i].nrecibos,
                mprimaanual: searchParentPolicy.result.recordset[i].mprimaanual,
                fcreacion: searchParentPolicy.result.recordset[i].fcreacion
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Parent Policy not found.' }; } 
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailParentPolicy(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log('error: ' + err.message);
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailParentPolicy' } });
        });
    }
});

const operationDetailParentPolicy = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ccarga'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let parentPolicyData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccarga: requestBody.ccarga
    };
    let getParentPolicyData = await bd.getParentPolicyDataQuery(parentPolicyData).then((res) => res);
    if(getParentPolicyData.error){ console.log(getParentPolicyData.error);return { status: false, code: 500, message: getParentPolicyData.error }; }
    let batches = [];
    if(getParentPolicyData.result.rowsAffected > 0){
        let getParentPolicyBatches = await db.getParentPolicyBatches(getParentPolicyData.result.recordset[0].ccarga);
        if(getParentPolicyBatches.error){ return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
        if(getParentPolicyBatches.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Parent Policy Batches not found.' }; }
        for (let i = 0; i < getParentPolicyBatches.result.recordset.length; i++) {
            let getBatchContracts = await db.getBatchContractsDataQuery(getParentPolicyBatches.result.recordset[i].clote).then((res) => res);
            if(getBatchContracts.error){ console.log(getParentPolicyData.error);return { status: false, code: 500, message: getParentPolicyData.error }; }
            let contracts = [];
            if(getBatchContracts.result.rowsAffected > 0){
                for (let i = 0; i < getBatchContracts.result.recordset.length; i++) {
                    let xpropietario;
                    if (getBatchContracts.result.recordset[i].XAPELLIDO) {
                        xpropietario = `${getBatchContracts.result.recordset[i].XNOMBRE} ${getBatchContracts.result.recordset[i].XAPELLIDO}`
                    } else {
                        xpropietario = getBatchContracts.result.recordset[i].XNOMBRE
                    }
                    let contract = {};
                    contract = {
                        ccontratoflota: getBatchContracts.result.recordset[i].CCONTRATOFLOTA,
                        xmarca: getBatchContracts.result.recordset[i].XMARCA,
                        xmodelo: getBatchContracts.result.recordset[i].XMODELO,
                        xversion: getBatchContracts.result.recordset[i].XVERSION,
                        xplaca: getBatchContracts.result.recordset[i].XPLACA,
                        xpropietario: xpropietario
                    }
                    contracts.push(contract);
                }
            }
            let batch = {
                clote: getParentPolicyBatches.result.recordset[i].clote,
                xobservacion: getParentPolicyBatches.result.recordset[i].xobservacion,
                fcreacion: getParentPolicyBatches.result.recordset[i].fcreacion,
                contratos: contracts
            }
            batches.push(batch);
        }
    }
    return {
        status: true,
        ccarga: getParentPolicyData.result.recordset[0].ccarga,
        xdescripcion: getParentPolicyData.result.recordset[0].xdescripcion_l,
        xpoliza: getParentPolicyData.result.recordset[0].xpoliza,
        ccliente: getParentPolicyData.result.recordset[0].ccliente,
        cmoneda: getParentPolicyData.result.recordset[0].cmoneda,
        ccorredor: getParentPolicyData.result.recordset[0].ccorredor,
        cmetodologiapago: getParentPolicyData.result.recordset[0].cmetodologiapago,
        mprimaanual: getParentPolicyData.result.recordset[0].mprimaanual,
        fcreacion: getParentPolicyData.result.recordset[0].fcreacion,
        batches: batches
    }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationParentPolicy(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationParentPolicy' } });
        });
    }
});

const operationParentPolicy = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }

    if(requestBody.polizaMatriz.ccarga){

        if(requestBody.polizaMatriz.lotes.length > 0) {

            for(i = 0; i < requestBody.polizaMatriz.lotes.length; i++) { 

                if (requestBody.polizaMatriz.lotes[i].create){
                    //Temporalmente se inhabilitará el agregar más vehículos a un lote que ya haya sido previamente cargado.
                    if (requestBody.polizaMatriz.lotes[i].clote){ 
                        /*
                        if(requestBody.polizaMatriz.lotes[i].contratosCSV.length > 0){
                            let createBatchContract = await bd.createBatchContractQuery(requestBody.polizaMatriz.lotes[i].contratosCSV, requestBody.polizaMatriz.ccarga, requestBody.polizaMatriz.lotes[i].clote, requestBody.polizaMatriz.ccliente).then((res) => res);
                            if(createBatchContract.error){ console.log(createBatchContract.error);return { status: false, code: 500, message: createBatchContract.error }; }
                        }*/

                    } else { 
                        let createBatch = await bd.createBatchQuery(requestBody.polizaMatriz.ccarga, requestBody.cusuario, requestBody.polizaMatriz.lotes[i]).then((res) => res);
                        if(createBatch.error){ console.log(createBatch.error);return { status: false, code: 500, message: createBatch.error }; }
                        if(requestBody.polizaMatriz.lotes[i].contratosCSV.length > 0){
                            let createBatchContract = await bd.createBatchContractQuery(requestBody.polizaMatriz.lotes[i].contratosCSV, requestBody.polizaMatriz.ccarga, createBatch.result.clote, requestBody.polizaMatriz.ccliente).then((res) => res);
                            if(createBatchContract.error){ console.log(createBatchContract.error);return { status: false, code: 500, message: createBatchContract.error }; }
                        }
                    }
                }
            }
        }
    }

    return {
        status: true,
        code: 200,
        message: "todo bien"
    }
}

module.exports = router;