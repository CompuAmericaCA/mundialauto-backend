const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        
    },
    production: {
        searchApiProductionClubMenuSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number(),
            ccompania: joi.number(),
            xmenuclub: joi.string()
        }),
        createApiProductionClubMenuSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            xmenuclub: joi.string().required(),
            xcomponente: joi.string(),
            xcontenido: joi.string().required(),
            bsubmenu: joi.bool().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariocreacion: joi.number().required(),
            submenus: joi.array().items(
                joi.object({
                    xsubmenuclub: joi.string().required(),
                    xcomponente: joi.string().required(),
                    xcontenido: joi.string().required(),
                    bactivo: joi.bool().required()
                })
            )
        }),
        detailApiProductionClubMenuSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cmenuclub: joi.number().required()
        }),
        updateApiProductionClubMenuSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cmenuclub: joi.number().required(),
            xmenuclub: joi.string().required(),
            xcomponente: joi.string(),
            xcontenido: joi.string().required(),
            bsubmenu: joi.bool().required(),
            bactivo: joi.bool().required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariomodificacion: joi.number().required(),
            submenus: joi.object({
                create: joi.array().items(
                    joi.object({
                        xsubmenuclub: joi.string().required(),
                        xcomponente: joi.string().required(),
                        xcontenido: joi.string().required(),
                        bactivo: joi.bool().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        csubmenuclub: joi.number().required(),
                        xsubmenuclub: joi.string().required(),
                        xcomponente: joi.string().required(),
                        xcontenido: joi.string().required(),
                        bactivo: joi.bool().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        csubmenuclub: joi.number().required()
                    })
                )
            })
        })
    }
}