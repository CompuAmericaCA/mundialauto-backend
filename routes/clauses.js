const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchClauses(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClauses' } });
        });
    }
});

const operationSearchClauses = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xanexo: requestBody.xanexo ? requestBody.xanexo.toUpperCase() : undefined,
        xclausulas: requestBody.xclausulas ? requestBody.xclausulas.toUpperCase() : undefined
    }
    console.log(searchData)
    let searchClauses = await bd.searchClausesQuery(searchData).then((res) => res);
    if(searchClauses.error){ return { status: false, code: 500, message: searchClauses.error }; }
    if(searchClauses.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchClauses.result.recordset.length; i++){
            jsonList.push({
                canexo: searchClauses.result.recordset[i].CANEXO,
                xanexo: searchClauses.result.recordset[i].XANEXO
                //xclausulas: searchClauses.result.recordset[i].XCLAUSULAS
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/exhibit/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateExhibit(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateExhibit' } });
        });
    }
});

const operationCreateExhibit = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let exhibitData = {
        xanexo: requestBody.xanexo,
        xobservacion: requestBody.xobservacion,
        bactivo: requestBody.bactivo
    };

    let createExhibit = await bd.createExhibitQuery(exhibitData).then((res) => res);
    if(createExhibit.error){ return { status: false, code: 500, message: createExhibit.error }; }
    if(createExhibit.result.rowsAffected > 0){ return { status: true, canexo: createExhibit.result.recordset[0].CANEXO }; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createExhibit' };  }
    
}

router.route('/exhibit/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailExhibit(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailExhibit' } });
        });
    }
});

const operationDetailExhibit = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let exhibitData = {
        canexo: requestBody.canexo
    };
    let getexhibitData = await bd.getExhibitDataQuery(exhibitData).then((res) => res);
    if(getexhibitData.error){ return { status: false, code: 500, message: getexhibitData.error }; }
    if(getexhibitData.result.rowsAffected > 0){
        return {
            status: true,
            canexo: getexhibitData.result.recordset[0].CANEXO,
            xanexo: getexhibitData.result.recordset[0].XANEXO,
            xobservacion: getexhibitData.result.recordset[0].XOBSERVACION,
            bactivo: getexhibitData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Color not found.' }; }
}

router.route('/search-exhibit').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchExhibit(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchExhibit' } });
        });
    }
});

const operationSearchExhibit = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        canexo: requestBody.canexo
    };
    let getexhibitSearch = await bd.getSearchExhibitDataQuery(searchData).then((res) => res);
    if(getexhibitSearch.error){ return { status: false, code: 500, message: getexhibitSearch.error }; }
    if(getexhibitSearch.result.rowsAffected > 0){
        return {
            status: true,
            canexo: getexhibitSearch.result.recordset[0].CANEXO,
            xanexo: getexhibitSearch.result.recordset[0].XANEXO,
            xobservacion: getexhibitSearch.result.recordset[0].XOBSERVACION,
            bactivo: getexhibitSearch.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Color not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateClauses(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateClauses' } });
        });
    }
});

const operationUpdateClauses = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clausesData = {
        canexo: requestBody.canexo
    }
    if(requestBody.exhibit){
        let exhibitUpdateList = [];
        if(requestBody.exhibit.update && requestBody.exhibit.update.length > 0){
            for(let i = 0; i < requestBody.exhibit.update.length; i++){
                exhibitUpdateList.push({
                    canexo: requestBody.exhibit.update[i].canexo
                })
                console.log(exhibitUpdateList)
            }
            let updateExhibitByClausesUpdate = await bd.updateExhibitByClausesUpdateQuery(exhibitUpdateList).then((res) => res);
            if(updateExhibitByClausesUpdate.error){ return { status: false, code: 500, message: updateExhibitByClausesUpdate.error }; }
            if(updateExhibitByClausesUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
    }
    if(requestBody.clauses){
        let clausesCreateList = [];
        if(requestBody.clauses.create && requestBody.clauses.create.length > 0){
            for(let i = 0; i < requestBody.clauses.create.length; i++){
                clausesCreateList.push({
                    canexo: requestBody.clauses.create[i].canexo,
                    cclausula: requestBody.clauses.create[i].cclausula,
                    xclausulas: requestBody.clauses.create[i].xclausulas,
                    xobjetivo: requestBody.clauses.create[i].xobjetivo,
                    xobservacion: requestBody.clauses.create[i].xobservacion
                })
            }

            let createClausesByClauseUpdate = await bd.createClausesByClausesUpdateQuery(clausesCreateList).then((res) => res);
            if(createClausesByClauseUpdate.error){ console.log(createClausesByClauseUpdate); return { status: false, code: 500, message: createClausesByClauseUpdate.error }; }
            if(createClausesByClauseUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createClausesByClauseUpdate' }; }
        } 

        let clausesUpdateList = [];
        if(requestBody.clauses.update && requestBody.clauses.update.length > 0){
            for(let i = 0; i < requestBody.clauses.update.length; i++){
                clausesUpdateList.push({
                    canexo: requestBody.clauses.update[i].canexo,
                    cclausula: requestBody.clauses.update[i].cclausula,
                    xclausulas: requestBody.clauses.update[i].xclausulas,
                    xobjetivo: requestBody.clauses.update[i].xobjetivo,
                    xobservacion: requestBody.clauses.update[i].xobservacion,
                    bactivo: requestBody.clauses.update[i].bactivo
                })
            }
            let updateClausesByClausesUpdate = await bd.updateClausesByClausesUpdateQuery(clausesUpdateList).then((res) => res);
            if(updateClausesByClausesUpdate.error){ console.log(updateClausesByClausesUpdate); return { status: false, code: 500, message: updateClausesByClausesUpdate.error }; }
            if(updateClausesByClausesUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
        
    }
    if(requestBody.objetives){
        let objetivesCreateList = [];
        if(requestBody.objetives.create && requestBody.objetives.create.length > 0){
            for(let i = 0; i < requestBody.objetives.create.length; i++){
                objetivesCreateList.push({
                    cclausula: requestBody.objetives.create[i].cclausula,
                    xobjetivo: requestBody.objetives.create[i].xobjetivo
                })
            }

            let createObjetivesByClauseUpdate = await bd.createObjetivesByClausesUpdateQuery(objetivesCreateList).then((res) => res);
            if(createObjetivesByClauseUpdate.error){ console.log(createObjetivesByClauseUpdate); return { status: false, code: 500, message: createObjetivesByClauseUpdate.error }; }
            if(createObjetivesByClauseUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createObjetivesByClauseUpdate' }; }
        } 

        let objetivesUpdateList = [];
        if(requestBody.objetives.update && requestBody.objetives.update.length > 0){
            for(let i = 0; i < requestBody.objetives.update.length; i++){
                objetivesUpdateList.push({
                    cclausula: requestBody.objetives.update[i].cclausula,
                    xobjetivo: requestBody.objetives.update[i].xobjetivo,
                    bactivo: requestBody.objetives.update[i].bactivo
                })
            }
            let updateObjetivesByClausesUpdate = await bd.updateObjetivesByClausesUpdateQuery(objetivesUpdateList).then((res) => res);
            if(updateObjetivesByClausesUpdate.error){ console.log(updateObjetivesByClausesUpdate); return { status: false, code: 500, message: updateObjetivesByClausesUpdate.error }; }
            if(updateObjetivesByClausesUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Note not found.' }; }
        }
        
    }
    return { status: true, canexo: clausesData.canexo};
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailClauses(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message);
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailClauses' } });
        });
    }
});

const operationDetailClauses = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clausesData = {
        canexo: requestBody.canexo
    };
    let clauses = [];
    let getClausesData = await bd.getClausesDataQuery(clausesData.canexo).then((res) => res);
    if(getClausesData.error){ return { status: false, code: 500, message: getClausesData.error }; }
    if(getClausesData.result.rowsAffected > 0){
        for(let i = 0; i < getClausesData.result.recordset.length; i++){
            let clausesList = {
                canexo: getClausesData.result.recordset[i].CANEXO,
                cclausula: getClausesData.result.recordset[i].CCLAUSULA,
                xclausulas: getClausesData.result.recordset[i].XCLAUSULAS,
                xobjetivo: getClausesData.result.recordset[i].XOBJETIVO,
                xobservacion: getClausesData.result.recordset[i].XOBSERVACION,
                bactivo: getClausesData.result.recordset[i].BACTIVO
            }
            clauses.push(clausesList);
        }
        return {
            status: true,
            clauses: clauses
        }
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/detail-objetives').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailObjetives(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message);
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailObjetives' } });
        });
    }
});

const operationDetailObjetives = async(authHeader, requestBody) => { 
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clausesData = {
        cclausula: requestBody.cclausula ? requestBody.cclausula: undefined,
        canexo: requestBody.canexo
    };
    let objetives = [];
    let getObjetivesData = await bd.getObjetivesDataQuery(clausesData).then((res) => res);
    if(getObjetivesData.error){ return { status: false, code: 500, message: getObjetivesData.error }; }
    if(getObjetivesData.result.rowsAffected > 0){
        for(let i = 0; i < getObjetivesData.result.recordset.length; i++){
            let objetiveList = {
                cclausula: getObjetivesData.result.recordset[i].CCLAUSULA,
                xclausulas: getObjetivesData.result.recordset[i].XCLAUSULAS,
                cobjetivo: getObjetivesData.result.recordset[i].COBJETIVO,
                xobjetivo: getObjetivesData.result.recordset[i].XOBJETIVO,
                bactivo: getObjetivesData.result.recordset[i].BACTIVO
            }
            objetives.push(objetiveList);
        }
        return {
            status: true,
            objetives: objetives
        }
    }else{ return { status: false, code: 404, message: 'Notification not found.' }; }
}

router.route('/search-clauses').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchClausesDetail(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClausesDetail' } });
        });
    }
});

const operationSearchClausesDetail = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cclausula: requestBody.cclausula
    };
    let getClausesSearchDetail = await bd.getSearchClausesDataQuery(searchData).then((res) => res);
    if(getClausesSearchDetail.error){ return { status: false, code: 500, message: getClausesSearchDetail.error }; }
    if(getClausesSearchDetail.result.rowsAffected > 0){
        return {
            status: true,
            cclausula: getClausesSearchDetail.result.recordset[0].CCLAUSULA,
            xclausulas: getClausesSearchDetail.result.recordset[0].XCLAUSULAS,
            xobservacion: getClausesSearchDetail.result.recordset[0].XOBSERVACION,
            xobjetivo: getClausesSearchDetail.result.recordset[0].XOBJETIVO,
            xanexo: getClausesSearchDetail.result.recordset[0].XANEXO,
            bactivo: getClausesSearchDetail.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Clauses not found.' }; }
}

router.route('/search-objetives').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchObjetivesDetail(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchObjetivesDetail' } });
        });
    }
});

const operationSearchObjetivesDetail = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cobjetivo: requestBody.cobjetivo
    };
    let getObjetivesSearchDetail = await bd.getObjetivesClausesDataQuery(searchData).then((res) => res);
    if(getObjetivesSearchDetail.error){ return { status: false, code: 500, message: getObjetivesSearchDetail.error }; }
    if(getObjetivesSearchDetail.result.rowsAffected > 0){
        return {
            status: true,
            cobjetivo: getObjetivesSearchDetail.result.recordset[0].COBJETIVO,
            cclausula: getObjetivesSearchDetail.result.recordset[0].CCLAUSULA,
            xclausulas: getObjetivesSearchDetail.result.recordset[0].XCLAUSULAS,
            xobjetivo: getObjetivesSearchDetail.result.recordset[0].XOBJETIVO,
            bactivo: getObjetivesSearchDetail.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Objetives not found.' }; }
}    

module.exports = router;