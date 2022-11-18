const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/auth').post((req, res) => {
    operationAuth(req.body).then((result) => {
        if(!result.status){ 
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationAuth' } });
    });
});

const operationAuth = async(requestBody) => {
    if(!helper.validateRequestObj(requestBody, ['xemail', 'xcontrasena'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let xemail = requestBody.xemail.toUpperCase();
    let xcontrasena = requestBody.xcontrasena;
    let query = await bd.authQuery(xemail).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    if(query.result.rowsAffected > 0){
        if(query.result.recordset[0].XCONTRASENA != xcontrasena){ 
            let createAuthError = await bd.createAuthErrorQuery(query.result.recordset[0].CUSUARIO).then((res) => res);
            if(createAuthError.error){ return { status: false, code: 500, message: createAuthError.error }; }
            if(createAuthError.result.rowsAffected > 0){
                if(createAuthError.attempt > 2){
                    let blockUser = await bd.blockUserQuery(query.result.recordset[0].CUSUARIO).then((res) => res);
                    if(blockUser.error){ return { status: false, code: 500, message: blockUser.error, hint: 'blockUser' }; }
                    if(blockUser.result.rowsAffected > 0){
                        return { status: false, code: 401, condition: 'user-blocked', expired: false };
                    }
                }else{
                    return { status: false, code: 401, condition: 'bad-password', attempt: createAuthError.attempt, expired: false };
                }
            }else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createAuthError' }; }
        }else{
            await bd.deleteAuthErrorQuery(query.result.recordset[0].CUSUARIO);
            let validateSignIn = await bd.validateSignInQuery(query.result.recordset[0].CUSUARIO).then((res) => res);
            if(validateSignIn.error){ return { status: false, code: 500, message: validateSignIn.error }; }
            if(validateSignIn.result.rowsAffected > 0){
                let date = new Date();
                let dateToVerify = new Date(new Date(query.result.recordset[0].FMODIFICACION).setMonth(new Date(query.result.recordset[0].FMODIFICACION).getMonth()+5));
                if(date > dateToVerify){
                    let securityToken = helper.generateSecurityToken(20);
                    let createPasswordChange = await bd.createPasswordChangeQuery(query.result.recordset[0].CUSUARIO, securityToken).then((res) => res);
                    if(createPasswordChange.error){ return { status: false, code: 500, message: createPasswordChange }; }
                    if(createPasswordChange.result.rowsAffected > 0){
                        return { status: false, code: 401, condition: 'change-password', token: securityToken, expired: false };
                    }else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPasswordChange' }; }
                }else{
                    await bd.createSignInQuery(query.result.recordset[0].CUSUARIO);
                    let jwt = helper.generateJsonWebToken(query.result.recordset[0].CUSUARIO);
                    return { 
                        status: true, 
                        cusuario: query.result.recordset[0].CUSUARIO, 
                        crol: query.result.recordset[0].CROL, 
                        ccompania: query.result.recordset[0].CCOMPANIA, 
                        xcompania: query.result.recordset[0].XCOMPANIA, 
                        xcolornav: query.result.recordset[0].XCOLORNAV, 
                        ctipo_sistema: query.result.recordset[0].CTIPO_SISTEMA,
                        xcolorprimario: query.result.recordset[0].XCOLORPRIMARIO, 
                        xcolorsegundario: query.result.recordset[0].XCOLORSEGUNDARIO, 
                        xcolorterciario: query.result.recordset[0].XCOLORTERCIARIO, 
                        xcolortexto: query.result.recordset[0].XCOLORTEXTO, 
                        cpais: query.result.recordset[0].CPAIS, 
                        cproveedor: query.result.recordset[0].CPROVEEDOR ? query.result.recordset[0].CPROVEEDOR : undefined, 
                        ccorredor: query.result.recordset[0].CCORREDOR ? query.result.recordset[0].CCORREDOR : undefined,
                        csession: jwt.token, expires: jwt.expires };
                }
            }else{
                let securityToken = helper.generateSecurityToken(20);
                let createPasswordChange = await bd.createPasswordChangeQuery(query.result.recordset[0].CUSUARIO, securityToken).then((res) => res);
                if(createPasswordChange.error){ return { status: false, code: 500, message: createPasswordChange }; }
                if(createPasswordChange.result.rowsAffected > 0){
                    return { status: false, code: 401, condition: 'change-password', token: securityToken, expired: false };
                }else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPasswordChange' }; }
            }
        }
    }else{ return { status: false, code: 404, message: 'User not found.' }; }
}

router.route('/get-user-modules').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationGetUserModules(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationGetUserModules' } });
        });
    }
});

const operationGetUserModules = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cusuario'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cusuario = requestBody.cusuario;
    let searchModules = await bd.searchModulesQuery(cusuario).then((res) => res);
    if(searchModules.error){ return { status: false, code: 500, message: searchModules.error }; }
    if(searchModules.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchModules.result.recordset.length; i++){
            jsonList.push({
                xgrupo: searchModules.result.recordset[i].XGRUPO,
                xmodulo: searchModules.result.recordset[i].XMODULO,
                xruta: searchModules.result.recordset[i].XRUTA
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'User modules not found.' }; }
}

router.route('/verify-module-permission').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationVerifyModulePermission(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyModulePermission' } });
        });
    }
});

const operationVerifyModulePermission = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cusuario', 'cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let validationData = {
        cusuario: requestBody.cusuario,
        cmodulo: requestBody.cmodulo
    };
    let validateModulePermission = await bd.validateModulePermissionQuery(validationData).then((res) => res);
    if(validateModulePermission.error){ return { status: false, code: 500, message: validateModulePermission.error }; }
    if(validateModulePermission.result.rowsAffected > 0){
        return { 
            status: true, 
            bindice: validateModulePermission.result.recordset[0].BINDICE,
            bcrear: validateModulePermission.result.recordset[0].BCREAR,
            bdetalle: validateModulePermission.result.recordset[0].BDETALLE,
            beditar: validateModulePermission.result.recordset[0].BEDITAR,
            beliminar: validateModulePermission.result.recordset[0].BELIMINAR
        };
    }else{ return { status: false, code: 401, condition: 'user-dont-have-permissions', expired: false }; }
}

module.exports = router;