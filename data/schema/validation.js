const joi = require('joi');

module.exports = {
    api: {
        verifyApiModulePermissionSchema: joi.object({
            cconsumidor: joi.number().required(),
            cmodulo: joi.number().required()
        })
    },
    production: {
        verifyProductionModulePermissionSchema: joi.object({
            cusuario: joi.number().required(),
            cmodulo: joi.number().required()
        })
    }
}