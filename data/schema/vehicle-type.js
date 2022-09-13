const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {

    },
    production: {
        searchTablesProductionVehicleTypeSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            xtipovehiculo: joi.string()
        }),
        createTablesProductionVehicleTypeSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            xtipovehiculo: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            cusuariocreacion: joi.number().required()
        }),
        detailTablesProductionVehicleTypeSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            ctipovehiculo: joi.number().required(),
            cpais: joi.number().required()
        }),
        updateTablesProductionVehicleTypeSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            ctipovehiculo: joi.number().required(),
            xtipovehiculo: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            cusuariomodificacion: joi.number().required()
        })
    }
}