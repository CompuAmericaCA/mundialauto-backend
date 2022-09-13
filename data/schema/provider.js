const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        detailProvidersApiProviderSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cproveedor: joi.number().required()
        })
    },
    production: {
        searchProvidersProductionProviderSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xproveedor: joi.string(),
            xrazonsocial: joi.string(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string()
        }),
        createProvidersProductionProviderSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xproveedor: joi.string().required(),
            ctipodocidentidad: joi.number().required(),
            xdocidentidad: joi.string().required(),
            xrazonsocial: joi.string().required(),
            xtelefono: joi.string().required(),
            xemail: joi.string(),
            xdireccion: joi.string().required(),
            xdireccioncorreo: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xfax: joi.string(),
            pretencion: joi.number(),
            centeimpuesto: joi.string().required(),
            ldiascredito: joi.number().required(),
            bafiliado: joi.bool().required(),
            xpaginaweb: joi.string(),
            xobservacion: joi.string().required(),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            banks: joi.array().items(
                joi.object({
                    cbanco: joi.number().required(),
                    ctipocuentabancaria: joi.number().required(),
                    xnumerocuenta: joi.string().required(),
                    bprincipal: joi.bool().required()
                })
            ),
            contacts: joi.array().items(
                joi.object({
                    xnombre: joi.string().required(),
                    xapellido: joi.string().required(),
                    ctipodocidentidad: joi.number().required(),
                    xdocidentidad: joi.string().required(),
                    xtelefonocelular: joi.string().required(),
                    xemail: joi.string().required(),
                    xcargo: joi.string(),
                    xtelefonooficina: joi.string(),
                    xtelefonocasa: joi.string(),
                    xfax: joi.string()
                })
            ),
            services:joi.array().items(
                joi.object({
                    cservicio: joi.number().required(),
                    ctiposervicio: joi.number().required()
                })
            ),
            brands: joi.array().items(
                joi.object({
                    cmarca: joi.number().required()
                })
            ),
            states: joi.array().items(
                joi.object({
                    cestado: joi.number().required()
                })
            )
        }),
        detailProvidersProductionProviderSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cproveedor: joi.number().required()
        }),
        updateProvidersProductionProviderSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cproveedor: joi.number().required(),
            xproveedor: joi.string().required(),
            ctipodocidentidad: joi.number().required(),
            xdocidentidad: joi.string().required(),
            xrazonsocial: joi.string().required(),
            xtelefono: joi.string().required(),
            xemail: joi.string(),
            xdireccion: joi.string().required(),
            xdireccioncorreo: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xfax: joi.string(),
            pretencion: joi.number(),
            centeimpuesto: joi.string().required(),
            ldiascredito: joi.number().required(),
            bafiliado: joi.bool().required(),
            xpaginaweb: joi.string(),
            xobservacion: joi.string().required(),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            banks: joi.object({
                create: joi.array().items(
                    joi.object({
                        cbanco: joi.number().required(),
                        ctipocuentabancaria: joi.number().required(),
                        xnumerocuenta: joi.string().required(),
                        bprincipal: joi.bool().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cbanco: joi.number().required(),
                        ctipocuentabancaria: joi.number().required(),
                        xnumerocuenta: joi.string().required(),
                        bprincipal: joi.bool().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cbanco: joi.number().required()
                    })
                )
            }),
            contacts: joi.object({
                create: joi.array().items(
                    joi.object({
                        xnombre: joi.string().required(),
                        xapellido: joi.string().required(),
                        ctipodocidentidad: joi.number().required(),
                        xdocidentidad: joi.string().required(),
                        xtelefonocelular: joi.string().required(),
                        xemail: joi.string().required(),
                        xcargo: joi.string(),
                        xtelefonooficina: joi.string(),
                        xtelefonocasa: joi.string(),
                        xfax: joi.string()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        ccontacto: joi.number().required(),
                        xnombre: joi.string().required(),
                        xapellido: joi.string().required(),
                        ctipodocidentidad: joi.number().required(),
                        xdocidentidad: joi.string().required(),
                        xtelefonocelular: joi.string().required(),
                        xemail: joi.string().required(),
                        xcargo: joi.string(),
                        xtelefonooficina: joi.string(),
                        xtelefonocasa: joi.string(),
                        xfax: joi.string()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        ccontacto: joi.number().required()
                    })
                )
            }),
            services: joi.object({
                create: joi.array().items(
                    joi.object({
                        cservicio: joi.number().required(),
                        ctiposervicio: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cservicio: joi.number().required(),
                        ctiposervicio: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cservicio: joi.number().required()
                    })
                )
            }),
            brands: joi.object({
                create: joi.array().items(
                    joi.object({
                        cmarca: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cmarca: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cmarca: joi.number().required()
                    })
                )
            }),
            states: joi.object({
                create: joi.array().items(
                    joi.object({
                        cestado: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cestado: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cestado: joi.number().required()
                    })
                )
            })
        })
    }
}