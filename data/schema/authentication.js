const joi = require('joi');

module.exports = {
    api: {
        authorizationSecurityApiAuthorizationProviderSchema: joi.object({
            xemail: joi.string().required(),
            xcontrasena: joi.string().required()
        }),
        authorizationSecurityApiAuthorizationClientSchema: joi.object({
            xemail: joi.string().required(),
            xcontrasena: joi.string().required()
        }),
        searchSecurityApiVerifyClubEmailSchema: joi.object({
            xemail: joi.string().required()
        }),
        updateSecurityApiChangeClubPasswordSchema: joi.object({
            cusuarioclub: joi.number().required(),
            xcontrasena: joi.string().required(),
            ccambiocontrasenaclub: joi.string().required()
        })
    }
}