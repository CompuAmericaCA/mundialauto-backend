const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        
    },
    production: {
        searchApiProductionClubRoleSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            xrolclub: joi.string()
        }),
        createApiProductionClubRoleSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            crolclub: joi.string().required(),
            xrolclub: joi.string().required(),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            menus: joi.array().items(
                joi.object({
                    cmenuclub: joi.string().required()
                })
            )
        }),
        detailApiProductionClubRoleSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            crolclub: joi.string().required()
        }),
        updateApiProductionClubRoleSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            crolclub: joi.string().required(),
            xrolclub: joi.string().required(),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            menus: joi.object({
                create: joi.array().items(
                    joi.object({
                        cmenuclub: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cmenuclub: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cmenuclub: joi.number().required()
                    })
                )
            })
        })
    }
}