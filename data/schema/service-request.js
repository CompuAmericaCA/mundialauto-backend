const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        searchEventsApiServiceRequestProviderSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            ctiposervicio: joi.number().required(),
            cservicio: joi.number().required()
        }),
        createEventsApiServiceRequestSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            isolicitante: joi.string().required(),
            ccontratoclub: joi.number().required(),
            cproveedor: joi.number().required(),
            ctiposervicio: joi.number().required(),
            cservicio: joi.number().required(),
            ilenguaje: joi.string().required(),
            cusuariocreacion: joi.number().required(),
        })
    },
    production: {
        searchEventsProductionServiceRequestSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string(),
            xnombre: joi.string(),
            xapellido: joi.string(),
            isolicitante: joi.string()
        }),
        searchEventsProductionServiceRequestClubContractManagementSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string(),
            xnombre: joi.string(),
            xapellido: joi.string()
        }),
        searchEventsProductionServiceRequestProviderSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            ctiposervicio: joi.number().required(),
            cservicio: joi.number().required()
        }),
        createEventsProductionServiceRequestSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            fgestion: joi.string(),
            isolicitante: joi.string().required(),
            ccontratoclub: joi.number().required(),
            cproveedor: joi.number().required(),
            ctiposervicio: joi.number().required(),
            cservicio: joi.number().required(),
            ctiposeguimiento: joi.number().required(),
            cmotivoseguimiento: joi.number().required(),
            fseguimientosolicitudservicio: joi.string().required(),
            cusuariocreacion: joi.number().required(),
        }),
        detailEventsProductionServiceRequestSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            csolicitudservicio: joi.number().required()
        }),
        updateEventsProductionServiceRequestSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            csolicitudservicio: joi.number().required(),
            fgestion: joi.string(),
            ccontratoclub: joi.number().required(),
            cproveedor: joi.number().required(),
            ctiposervicio: joi.number().required(),
            cservicio: joi.number().required(),
            cusuariomodificacion: joi.number().required(),
            tracings: joi.object({
                create: joi.array().items(
                    joi.object({
                        ctiposeguimiento: joi.number().required(),
                        cmotivoseguimiento: joi.number().required(),
                        fseguimientosolicitudservicio: joi.string().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cseguimientosolicitudservicio: joi.number().required(),
                        ctiposeguimiento: joi.number().required(),
                        cmotivoseguimiento: joi.number().required(),
                        fseguimientosolicitudservicio: joi.string().required(),
                        bcerrado: joi.bool().required(),
                        xobservacion: joi.string()
                    })
                )
            })
        })
    }
}