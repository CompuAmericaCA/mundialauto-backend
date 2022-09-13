const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {

    },
    production: {
        searchTablesProductionPaymentMethodologySchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xmetodologiapago: joi.string()
        }),
        createTablesProductionPaymentMethodologySchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            xmetodologiapago: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariocreacion: joi.number().required()
        }),
        detailTablesProductionPaymentMethodologySchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cmetodologiapago: joi.number().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        updateTablesProductionPaymentMethodologySchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cmetodologiapago: joi.number().required(),
            xmetodologiapago: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariomodificacion: joi.number().required()
        })
    }
}