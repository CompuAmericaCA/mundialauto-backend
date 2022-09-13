const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {

    },
    production: {
        searchTablesProductionImageSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ximagen: joi.string()
        }),
        createTablesProductionImageSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            ximagen: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariocreacion: joi.number().required()
        }),
        detailTablesProductionImageSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cimagen: joi.number().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        updateTablesProductionImageSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cimagen: joi.number().required(),
            ximagen: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariomodificacion: joi.number().required()
        })
    }
}