const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        
    },
    production: {
        searchApiProductionEmailAlertSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number(),
            ccompania: joi.number(),
            xcorreo: joi.string()
        }),
        createApiProductionEmailAlertSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            xcorreo: joi.string().required(),
            ilenguaje: joi.string().required(),
            xasunto: joi.string().required(),
            xhtml: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariocreacion: joi.number().required(),
            roles: joi.array().items(
                joi.object({
                    cdepartamento: joi.number().required(),
                    crol: joi.number().required()
                })
            )
        }),
        detailApiProductionEmailAlertSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            ccorreo: joi.number().required()
        }),
        updateApiProductionEmailAlertSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            ccorreo: joi.number().required(),
            xcorreo: joi.string().required(),
            ilenguaje: joi.string().required(),
            xasunto: joi.string().required(),
            xhtml: joi.string().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariomodificacion: joi.number().required(),
            roles: joi.object({
                create: joi.array().items(
                    joi.object({
                        cdepartamento: joi.number().required(),
                        crol: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cdepartamento: joi.number().required(),
                        crol: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cdepartamento: joi.number().required(),
                        crol: joi.number().required()
                    })
                )
            })
        })
    }
}