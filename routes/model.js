const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchModel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;s
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchModel' } });
        });
    }
});

const operationSearchModel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais','xmarca'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        xmarca: requestBody.xmarca ? requestBody.xmarca : undefined,
        xmodelo: requestBody.xmodelo ? requestBody.xmodelo : undefined
    }

    let searchModel = await bd.searchModelQuery(searchData).then((res) => res);
    if(searchModel.error){ return { status: false, code: 500, message: searchModel.error }; }
    if(searchModel.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchModel.result.recordset.length; i++){
            jsonList.push({
                cmodelo: searchModel.result.recordset[i].CMODELO,
                xmodelo: searchModel.result.recordset[i].XMODELO,
                cmarca: searchModel.result.recordset[i].CMARCA,
                xmarca: searchModel.result.recordset[i].XMARCA,
                bactivo: searchModel.result.recordset[i].BACTIVO
            });  
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Model not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateModel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateModel' } });
        });
    }
});

const operationCreateModel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xmodelo', 'cmarca', 'bactivo', 'cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let modelData = {
        xmodelo: requestBody.xmodelo.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca,
        cusuariocreacion: requestBody.cusuariocreacion
    };
    let verifyModelName = await bd.verifyModelNameToCreateQuery(modelData).then((res) => res);
    if(verifyModelName.error){ return { status: false, code: 500, message: verifyModelName.error }; }
    if(verifyModelName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'model-name-already-exist' }; }
    else{
        let createModel = await bd.createModelQuery(modelData).then((res) => res);
        if(createModel.error){ return { status: false, code: 500, message: createModel.error }; }
        if(createModel.result.rowsAffected > 0){ return { status: true, cmodelo: createModel.result.recordset[0].CMODELO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createModel' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailModel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailModel' } })
        });
    }
});

const operationDetailModel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'cmodelo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let modelData = {
        cpais: requestBody.cpais,
        cmodelo: requestBody.cmodelo
    };
    let getModelData = await bd.getModelDataQuery(modelData).then((res) => res);
    if(getModelData.error){ return { status: false, code: 500, message: getModelData.error }; }
    if(getModelData.result.rowsAffected > 0){
        return { 
            status: true,
            cmodelo: getModelData.result.recordset[0].CMODELO,
            xmodelo: getModelData.result.recordset[0].XMODELO,
            cmarca: getModelData.result.recordset[0].CMARCA,
            casociado: getModelData.result.recordset[0].CASOCIADO,
            bactivo: getModelData.result.recordset[0].BACTIVO
        }
    }else{ return { status: false, code: 404, message: 'Model not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateModel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateModel' } })
        });
    }
});

const operationUpdateModel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cmodelo', 'xmodelo', 'cmarca', 'bactivo', 'cpais', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let modelData = {
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
        xmodelo: requestBody.xmodelo.toUpperCase() ? requestBody.xmodelo : undefined,
        bactivo: requestBody.bactivo? requestBody.bactivo : undefined,
        cpais: requestBody.cpais? requestBody.cpais : undefined,
        cmarca: requestBody.cmarca? requestBody.cmarca : undefined,
        // casociado: requestBody.casociado,
        cusuariomodificacion: requestBody.cusuariomodificacion
    };
    console.log(modelData)
    let verifyModelName = await bd.verifyModelNameToUpdateQuery(modelData).then((res) => res);
    if(verifyModelName.error){ return { status: false, code: 500, message: verifyModelName.error }; }
    if(verifyModelName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'model-name-already-exist'}; }
    else{
        let updateModel = await bd.updateModelQuery(modelData).then((res) => res);
        if(updateModel.error){ return { status: false, code: 500, message: updateModel.error }; }
        if(updateModel.result.rowsAffected > 0){ return { status: true, cmodelo: modelData.cmodelo }; }
        else{ return { status: false, code: 404, message: 'Model not found.' }; }
    }
}

module.exports = router;