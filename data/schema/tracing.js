const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    production: {
        searchBusinessProductionTrancingSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            btodos: joi.boolean(),
            cusuario: joi.number()
        })
    }
}