const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchUser(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchUser' } });
        });
    }
});

const operationSearchUser = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cdepartamento: requestBody.cdepartamento,
        crol: requestBody.crol,
        xnombre: requestBody.xnombre ? helper.encrypt(requestBody.xnombre.toUpperCase()) : undefined,
        xapellido: requestBody.xapellido ? helper.encrypt(requestBody.xapellido.toUpperCase()) : undefined
    }
    let searchUser = await bd.searchUserQuery(searchData).then((res) => res);
    if(searchUser.error){ return { status: false, code: 500, message: searchUser.error }; }
    if(searchUser.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchUser.result.recordset.length; i++){
            jsonList.push({
                cusuario: searchUser.result.recordset[i].CUSUARIO,
                xnombre: helper.decrypt(searchUser.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(searchUser.result.recordset[i].XAPELLIDO),
                bactivo: searchUser.result.recordset[i].BACTIVO,
                cpais: searchUser.result.recordset[i].CPAIS,
                xpais: searchUser.result.recordset[i].XPAIS,
                ccompania: searchUser.result.recordset[i].CCOMPANIA,
                xcompania: searchUser.result.recordset[i].XCOMPANIA,
                cdepartamento: searchUser.result.recordset[i].CDEPARTAMENTO,
                xdepartamento: searchUser.result.recordset[i].XDEPARTAMENTO,
                crol: searchUser.result.recordset[i].CROL,
                xrol: searchUser.result.recordset[i].XROL
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'User not found.' }; }
}

router.route('/search/provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchProvider' } });
        });
    }
});

const operationSearchProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipodocidentidad: requestBody.ctipodocidentidad ? requestBody.ctipodocidentidad : undefined,
        xdocidentidad: requestBody.xdocidentidad ? helper.encrypt(requestBody.xdocidentidad) : undefined,
        xnombre: requestBody.xnombre ? requestBody.xnombre.toUpperCase() : undefined,
        xrazonsocial: requestBody.xrazonsocial ? helper.encrypt(requestBody.xrazonsocial.toUpperCase()) : undefined
    };
    let searchProvider = await bd.searchProviderQuery(searchData).then((res) => res);
    if(searchProvider.error){ return  { status: false, code: 500, message: searchProvider.error }; }
    if(searchProvider.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchProvider.result.recordset.length; i++){
            jsonList.push({
                cproveedor: searchProvider.result.recordset[i].CPROVEEDOR,
                xnombre: searchProvider.result.recordset[i].XNOMBRE,
                xrazonsocial: searchProvider.result.recordset[i].XRAZONSOCIAL,
                bactivo: searchProvider.result.recordset[i].BACTIVO
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Owner not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateUser(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateUser' } });
        });
    }
});

const operationCreateUser = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xnombre', 'xapellido', 'xemail', 'xtelefono', 'xdireccion', 'xcontrasena', 'bproveedor', 'bactivo','cdepartamento', 'cpais', 'ccompania', 'crol', 'cusuariocreacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let userData = {
        xnombre: helper.encrypt(requestBody.xnombre.toUpperCase()),
        xapellido: helper.encrypt(requestBody.xapellido.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        xcontrasena: helper.encrypt(requestBody.xcontrasena),
        bproveedor: requestBody.bproveedor,
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cdepartamento: requestBody.cdepartamento,
        crol: requestBody.crol,
        cproveedor: requestBody.cproveedor ? requestBody.cproveedor : undefined,
        cusuariocreacion: requestBody.cusuariocreacion,
        ccorredor: requestBody.ccorredor ? requestBody.ccorredor : undefined,
        bcorredor: requestBody.bcorredor,
    };
    let verifyUserEmail = await bd.verifyUserEmailToCreateQuery(userData.xemail).then((res) => res);
    if(verifyUserEmail.error){ return { status: false, code: 500, message: verifyUserEmail.error }; }
    if(verifyUserEmail.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'email-already-exist' }; }
    else{
        let createUser = await bd.createUserQuery(userData).then((res) => res);
        if(createUser.error){ return { status: false, code: 500, message: createUser.error }; }
        if(createUser.result.rowsAffected > 0){ return { status: true, cusuario: createUser.result.recordset[0].CUSUARIO }; }
        else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createUser' }; }
    }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailUser(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
         
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailUser' } })
        });
    }
});

const operationDetailUser = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cusuario'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cusuario = requestBody.cusuario;
    let getUserData = await bd.getUserDataQuery(cusuario).then((res) => res);
    if(getUserData.error){ return { status: false, code: 500, message: getUserData.error }; }
    if(getUserData.result.rowsAffected > 0){
        let providerData = {};
        if(getUserData.result.recordset[0].BPROVEEDOR && getUserData.result.recordset[0].CPROVEEDOR){
            let getUserProviderData = await bd.getUserProviderDataQuery(getUserData.result.recordset[0].CPROVEEDOR, getUserData.result.recordset[0].CPAIS, getUserData.result.recordset[0].CCOMPANIA).then((res) => res);
            if(getUserProviderData.error){ return { status: false, code: 500, message: getUserProviderData.error }; }
            if(getUserProviderData.result.rowsAffected > 0){
                providerData = { xproveedor: helper.decrypt(getUserProviderData.result.recordset[0].XPROVEEDOR), xrazonsocial: helper.decrypt(getUserProviderData.result.recordset[0].XRAZONSOCIAL) }
            }else{ return { status: false, code: 404, message: 'User Provider not found.' }; }
        }
        let brokerData = {};
        if(getUserData.result.recordset[0].BCORREDOR && getUserData.result.recordset[0].CCORREDOR){
            let getUserBrokerData = await bd.getUserBrokerDataQuery(getUserData.result.recordset[0].CCORREDOR, getUserData.result.recordset[0].CPAIS, getUserData.result.recordset[0].CCOMPANIA).then((res) => res);
            if(getUserBrokerData.error){ return { status: false, code: 500, message: getUserProviderData.error }; }
            if(getUserBrokerData.result.rowsAffected > 0){
                brokerData = { xcorredor: getUserBrokerData.result.recordset[0].XCORREDOR }
            }else{ return { status: false, code: 404, message: 'User Provider not found.' }; }
        }
        return { 
            status: true,
            cusuario: getUserData.result.recordset[0].CUSUARIO,
            xnombre: helper.decrypt(getUserData.result.recordset[0].XNOMBRE),
            xapellido: helper.decrypt(getUserData.result.recordset[0].XAPELLIDO),
            xemail: helper.decrypt(getUserData.result.recordset[0].XEMAIL),
            xtelefono: helper.decrypt(getUserData.result.recordset[0].XTELEFONO),
            xdireccion: helper.decrypt(getUserData.result.recordset[0].XDIRECCION),
            bproveedor: getUserData.result.recordset[0].BPROVEEDOR,
            bactivo: getUserData.result.recordset[0].BACTIVO,
            cpais: getUserData.result.recordset[0].CPAIS,
            ccompania: getUserData.result.recordset[0].CCOMPANIA,
            cdepartamento: getUserData.result.recordset[0].CDEPARTAMENTO,
            crol: getUserData.result.recordset[0].CROL,
            cproveedor: getUserData.result.recordset[0].CPROVEEDOR ? getUserData.result.recordset[0].CPROVEEDOR : undefined,
            xproveedor: providerData.xproveedor ? providerData.xproveedor : undefined,
            xrazonsocial: providerData.xrazonsocial ? providerData.xrazonsocial : undefined,
            xcorredor: brokerData.xcorredor ? brokerData.xcorredor : undefined,
        }
    }else{ return { status: false, code: 404, message: 'User not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateUser(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateUser' } })
        });
    }
});

const operationUpdateUser = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cusuario', 'xnombre', 'xapellido', 'xemail', 'xtelefono', 'xdireccion', 'bproveedor', 'bactivo','cdepartamento', 'cpais', 'ccompania', 'crol', 'cusuariomodificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let userData = {
        cusuario: requestBody.cusuario,
        xnombre: helper.encrypt(requestBody.xnombre.toUpperCase()),
        xapellido: helper.encrypt(requestBody.xapellido.toUpperCase()),
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xtelefono: helper.encrypt(requestBody.xtelefono),
        xdireccion: helper.encrypt(requestBody.xdireccion.toUpperCase()),
        bproveedor: requestBody.bproveedor,
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cdepartamento: requestBody.cdepartamento,
        crol: requestBody.crol,
        cproveedor: requestBody.cproveedor ? requestBody.cproveedor : undefined,
        cusuariomodificacion: requestBody.cusuariomodificacion,
        ccorredor: requestBody.ccorredor ? requestBody.ccorredor : undefined,
        bcorredor: requestBody.bcorredor ? requestBody.bcorredor : undefined,
    };
    let verifyUserEmail = await bd.verifyUserEmailToUpdateQuery(userData.cusuario, userData.xemail).then((res) => res);
    if(verifyUserEmail.error){ return { status: false, code: 500, message: verifyUserEmail.error }; }
    if(verifyUserEmail.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'email-already-exist'}; }
    else{
        let updateUser = await bd.updateUserQuery(userData).then((res) => res);
        if(updateUser.error){ return { status: false, code: 500, message: updateUser.error }; }
        if(updateUser.result.rowsAffected > 0){ return { status: true, cusuario: userData.cusuario }; }
        else{ return { status: false, code: 404, message: 'User not found.' }; }
    }
}

router.route('/change-password').post((req, res) => {
    operationChangeUserPassword(req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationChangeUserPassword' } });
    });
});

const operationChangeUserPassword = async(requestBody) => {
    if(!helper.validateRequestObj(requestBody, ['token', 'cusuario', 'xcontrasena'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let token = requestBody.token;
    let cusuario = requestBody.cusuario;
    let xcontrasena = helper.encrypt(requestBody.xcontrasena);
    let updateChangePasswordToken = await bd.updateChangePasswordTokenQuery(token).then((res) => res);
    if(updateChangePasswordToken.error){ return { status: false, code: 500, message: updateChangePasswordToken.error }; }
    if(updateChangePasswordToken.result.rowsAffected > 0){
        let updateUserPassword = await bd.updateUserPasswordQuery(cusuario, xcontrasena).then((res) => res);
        if(updateUserPassword.error){ return { status: false, code: 500, message: updateUserPassword.error }; }
        if(updateUserPassword.result.rowsAffected > 0){ 
            let createSignIn = await bd.createSignInQuery(cusuario);
            if(createSignIn.error){ return { status: false, code: 500, message: createSignIn.error }; }
            return { status: true };
        }
        else{ return { status: false, code: 404, message: 'User not found!' }; }
    }else{ return { status: false, code: 404, message: 'Password change token not found!' }; }
}

router.route('/search/broker').post((req, res) => {
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
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
    };
    let searchBroker = await bd.searchBrokerQuery(searchData).then((res) => res);
    if(searchBroker.error){ return  { status: false, code: 500, message: searchBroker.error }; }
    if(searchBroker.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBroker.result.recordset.length; i++){
            jsonList.push({
                ccorredor: searchBroker.result.recordset[i].CCORREDOR,
                xcorredor: searchBroker.result.recordset[i].XCORREDOR,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Owner not found.' }; }
}

module.exports = router;