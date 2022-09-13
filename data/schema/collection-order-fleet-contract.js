const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {

    },
    production: {
        searchAdministrationProductionCollectionOrderFleetContractSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ccliente: joi.number().allow('').allow(null),
            ifacturacion: joi.string().allow('').allow(null)
        }),
        detailAdministrationProductionCollectionOrderFleetContractSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            csolicitudcobrocontratoflota: joi.number().required()
        }),
        updateAdministrationProductionCollectionOrderFleetContractSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            csolicitudcobrocontratoflota: joi.number().required(),
            cestatusgeneral: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            payments: joi.object({
                create: joi.array().items(
                    joi.object({
                        mpago: joi.number().required(),
                        bpagado: joi.bool().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cpago: joi.number().required(),
                        mpago: joi.number().required(),
                        bpagado: joi.bool().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cpago: joi.number().required()
                    })
                )
            })
        })
    }
}