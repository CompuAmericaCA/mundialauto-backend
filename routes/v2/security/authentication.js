const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');

router.route('/api/authorization').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    operationConsumerAuthorization(req.header('Authorization')).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationConsumerAuthorization' } });
    });
});

const operationConsumerAuthorization = async(authHeader) => {
    let validateConsumerCredentials = helper.validateConsumerCredentials(authHeader);
    if(validateConsumerCredentials.error){ return { status: false, code: 500, message: validateConsumerCredentials.error }; }
    validateConsumerCredentials.user = helper.encrypt(validateConsumerCredentials.user.toUpperCase());
    validateConsumerCredentials.password = helper.encrypt(validateConsumerCredentials.password);
    let authenticationConsumer = await db.authenticationConsumerQuery(validateConsumerCredentials.user).then((res) => res);
    if(authenticationConsumer.error){ return { status: false, code: 500, message: authenticationConsumer.error }; }
    if(authenticationConsumer.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Consumer not found.' }; }
    if(authenticationConsumer.result.recordset[0].XCONTRASENA != validateConsumerCredentials.password){ return { status: false, code: 401, condition: 'bad-password' } }
    let jwt = helper.generateJsonWebToken(authenticationConsumer.result.recordset[0].CCONSUMIDOR, 'api');
    return { status: true, csession: jwt.token, expires: jwt.expires };
}

router.route('/api/authorization/client').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'authentication', req.body, 'authorizationSecurityApiAuthorizationClientSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationClientAuthorization(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationClientAuthorization' } });
    });
});

const operationClientAuthorization = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clientData = {
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xcontrasena: helper.encrypt(requestBody.xcontrasena)
    }
    let clientAuthorization = await db.clientAuthorizationQuery(clientData.xemail).then((res) => res);
    if(clientAuthorization.error){ return { status: false, code: 500, message: clientAuthorization.error }; }
    if(clientAuthorization.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Client not found.' };  }
    if(clientAuthorization.result.recordset[0].XCONTRASENA != clientData.xcontrasena){ return { status: false, code: 401, condition: 'bad-password' }; }
    return { status: true, cusuarioclub: clientAuthorization.result.recordset[0].CUSUARIOCLUB, ccompania: clientAuthorization.result.recordset[0].CCOMPANIA, cpais: clientAuthorization.result.recordset[0].CPAIS, crolclub: clientAuthorization.result.recordset[0].CROLCLUB, ccontratoclub: clientAuthorization.result.recordset[0].CCONTRATOCLUB, cpropietario: clientAuthorization.result.recordset[0].CPROPIETARIO };
}

router.route('/api/authorization/provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'authentication', req.body, 'authorizationSecurityApiAuthorizationProviderSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationProviderAuthorization(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationProviderAuthorization' } });
    });
});

const operationProviderAuthorization = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let providerData = {
        xemail: helper.encrypt(requestBody.xemail.toUpperCase()),
        xcontrasena: helper.encrypt(requestBody.xcontrasena)
    }
    let providerAuthorization = await db.providerAuthorizationQuery(providerData.xemail).then((res) => res);
    if(providerAuthorization.error){ return { status: false, code: 500, message: providerAuthorization.error }; }
    if(providerAuthorization.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Provider not found.' };  }
    if(providerAuthorization.result.recordset[0].XCONTRASENA != providerData.xcontrasena){ return { status: false, code: 401, condition: 'bad-password' }; }
    return { status: true, cusuarioclub: providerAuthorization.result.recordset[0].CUSUARIOCLUB, ccompania: providerAuthorization.result.recordset[0].CCOMPANIA, cpais: providerAuthorization.result.recordset[0].CPAIS, crolclub: providerAuthorization.result.recordset[0].CROLCLUB, cproveedor: providerAuthorization.result.recordset[0].CPROVEEDOR};
}

router.route('/api/search/verify-club-email').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'authentication', req.body, 'searchSecurityApiVerifyClubEmailSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationVerifyClubEmail(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyClubEmail' } });
    });
});

const operationVerifyClubEmail = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xemail: helper.encrypt(requestBody.xemail.toUpperCase())
    }
    let verifyClubEmail = await db.clientAuthorizationQuery(searchData.xemail).then((res) => res);
    if(verifyClubEmail.error){ return { status: false, code: 500, message: verifyClubEmail.error }; }
    if(verifyClubEmail.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Email not found.' };  }
    let token = helper.generateSecurityToken(20);
    let createPasswordChangeToken = await db.createPasswordChangeTokenQuery(token, verifyClubEmail.result.recordset[0].CUSUARIOCLUB).then((res) => res);
    if(createPasswordChangeToken.error){ return { status: false, code: 500, message: createPasswordChangeToken.error }; }
    if(createPasswordChangeToken.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Error creating security token.' };  }
    return { status: true, cusuarioclub: verifyClubEmail.result.recordset[0].CUSUARIOCLUB, ccambiocontrasenaclub: token };
}

router.route('/api/update/change-club-password').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'authentication', req.body, 'updateSecurityApiChangeClubPasswordSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationChangeClubPassword(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationChangeClubPassword' } });
    });
});

const operationChangeClubPassword = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let clubUserData = {
        cusuarioclub: requestBody.cusuarioclub,
        xcontrasena: helper.encrypt(requestBody.xcontrasena),
        ccambiocontrasenaclub: requestBody.ccambiocontrasenaclub
    }
    let updatePasswordChangeToken = await db.updatePasswordChangeTokenQuery(clubUserData).then((res) => res);
    if(updatePasswordChangeToken.error){ return { status: false, code: 500, message: updatePasswordChangeToken.error }; }
    if(updatePasswordChangeToken.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Password Change Token not found.' };  }
    let updateClubUserPassword = await db.updateClubUserPasswordQuery(clubUserData).then((res) => res);
    if(updateClubUserPassword.error){ return { status: false, code: 500, message: updateClubUserPassword.error }; }
    if(updateClubUserPassword.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club User not found.' };  }
    return { status: true };
}

module.exports = router;