const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        
    },
    production: {
        searchApiProductionConsumerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number(),
            ccompania: joi.number(),
            xconsumidor: joi.string(),
            xproducto: joi.string()
        }),
        createApiProductionConsumerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            xconsumidor: joi.string().required(),
            xproducto: joi.string().required(),
            xemail: joi.string().email().required(),
            xusuario: joi.string().required(),
            xcontrasena: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariocreacion: joi.number().required(),
            permissions: joi.array().items(
                joi.object({
                    cgrupo: joi.number().required(),
                    cmodulo: joi.number().required(),
                    bindice: joi.bool().required(),
                    bcrear: joi.bool().required(),
                    bdetalle: joi.bool().required(),
                    beditar: joi.bool().required(),
                    beliminar: joi.bool().required()
                })
            )
        }),
        detailApiProductionConsumerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cconsumidor: joi.number().required()
        }),
        updateApiProductionConsumerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cconsumidor: joi.number().required(),
            xconsumidor: joi.string().required(),
            xproducto: joi.string().required(),
            xemail: joi.string().email().required(),
            xusuario: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariomodificacion: joi.number().required(),
            permissions: joi.object({
                create: joi.array().items(
                    joi.object({
                        cgrupo: joi.number().required(),
                        cmodulo: joi.number().required(),
                        bindice: joi.bool().required(),
                        bcrear: joi.bool().required(),
                        bdetalle: joi.bool().required(),
                        beditar: joi.bool().required(),
                        beliminar: joi.bool().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cgrupo: joi.number().required(),
                        cmodulo: joi.number().required(),
                        bindice: joi.bool().required(),
                        bcrear: joi.bool().required(),
                        bdetalle: joi.bool().required(),
                        beditar: joi.bool().required(),
                        beliminar: joi.bool().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cgrupo: joi.number().required(),
                        cmodulo: joi.number().required()
                    })
                )
            })
        })
    }
}