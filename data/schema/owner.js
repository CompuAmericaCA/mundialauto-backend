const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        searchThirdpartiesApiOwnerSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string(),
            xemail: joi.string()
        }),
        searchThirdpartiesApiOwnerPlateSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            xplaca: joi.string().required()
        }),
        createThirdpartiesApiOwnerSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xnombre: joi.string().required(),
            xapellido: joi.string().required(),
            cestadocivil: joi.number().required(),
            ctipodocidentidad: joi.number().required(),
            fnacimiento: joi.string().required(),
            xprofesion: joi.string(),
            xocupacion: joi.string(),
            xdocidentidad: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xdireccion: joi.string().required(),
            xemail: joi.string().email().required(),
            xtelefonocasa: joi.string(),
            xtelefonocelular: joi.string().required(),
            xfax: joi.string(),
            cparentesco: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            documents: joi.array().items(
                joi.object({ 
                    cdocumento: joi.number().required(), 
                    xrutaarchivo: joi.string().required() 
                })
            ),
            vehicles: joi.array().items(
                joi.object({ 
                    cmarca: joi.number().required(),
                    cmodelo: joi.number().required(),
                    cversion: joi.number().required(),
                    xplaca: joi.string().required(),
                    fano: joi.number().required(),
                    xcolor: joi.string().required(),
                    nkilometraje: joi.number().required(),
                    bimportado: joi.bool().required(),
                    xcertificadoorigen: joi.string().required(),
                    mpreciovehiculo: joi.number().required(),
                    xserialcarroceria: joi.string().required(),
                    xserialmotor: joi.string().required(),
                    cmoneda: joi.number().required(),
                    xuso: joi.number().required(),
                    ncapacidadcarga: joi.number().required(),
                    ncapacidadpasajeros: joi.number().required(),
                    xtipo: joi.string().allow('').allow(null),
                    images: joi.array().items(
                        joi.object({
                            cimagen: joi.number().required(),
                            xrutaimagen: joi.string().required()
                        })
                    )
                })
            )
        }),
        createThirdpartiesApiOwnerVehicleSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cusuariocreacion: joi.number().required(),
            cpropietario: joi.number().required(),
            cmarca: joi.number().required(),
            cmodelo: joi.number().required(),
            cversion: joi.number().required(),
            xplaca: joi.string().required(),
            fano: joi.number().required(),
            xcolor: joi.string().required(),
            nkilometraje: joi.number().required(),
            bimportado: joi.bool().required(),
            xcertificadoorigen: joi.string().required(),
            mpreciovehiculo: joi.number().required(),
            xserialcarroceria: joi.string().required(),
            xserialmotor: joi.string().required(),
            cmoneda: joi.number().required(),
            xuso: joi.number().required(),
            ncapacidadcarga: joi.number().required(),
            ncapacidadpasajeros: joi.number().required(),
            xtipo: joi.string().allow('').allow(null),
            images: joi.array().items(
                joi.object({
                    cimagen: joi.number().required(),
                    xrutaimagen: joi.string().required()
                })
            )
        }),
        detailThirdpartiesApiOwnerSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number().required()
        }),
        updateThirdpartiesApiOwnerSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number().required(),
            xnombre: joi.string().required(),
            xapellido: joi.string().required(),
            cestadocivil: joi.number().required(),
            ctipodocidentidad: joi.number().required(),
            fnacimiento: joi.string().required(),
            xprofesion: joi.string(),
            xocupacion: joi.string(),
            xdocidentidad: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xdireccion: joi.string().required(),
            xemail: joi.string().email().required(),
            xtelefonocasa: joi.string(),
            xtelefonocelular: joi.string().required(),
            xfax: joi.string(),
            cparentesco: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            documents: joi.object({
                create: joi.array().items(
                    joi.object({ 
                        cdocumento: joi.number().required(), 
                        xrutaarchivo: joi.string().required() 
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cdocumentopropietario: joi.number().required(),
                        cdocumento: joi.number().required(),
                        xrutaarchivo: joi.string().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cdocumentopropietario: joi.number().required()
                    })
                ),
            }),
            vehicles: joi.object({
                create: joi.array().items(
                    joi.object({ 
                        cmarca: joi.number().required(),
                        cmodelo: joi.number().required(),
                        cversion: joi.number().required(),
                        xplaca: joi.string().required(),
                        fano: joi.number().required(),
                        xcolor: joi.string().required(),
                        nkilometraje: joi.number().required(),
                        bimportado: joi.bool().required(),
                        xcertificadoorigen: joi.string().required(),
                        mpreciovehiculo: joi.number().required(),
                        xserialcarroceria: joi.string().required(),
                        xserialmotor: joi.string().required(),
                        cmoneda: joi.number().required(),
                        xuso: joi.number().required(),
                        ncapacidadcarga: joi.number().required(),
                        ncapacidadpasajeros: joi.number().required(),
                        xtipo: joi.string().allow('').allow(null),
                        images: joi.array().items(
                            joi.object({
                                cimagen: joi.number().required(),
                                xrutaimagen: joi.string().required()
                            })
                        )
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cvehiculopropietario: joi.number().required(),
                        cmarca: joi.number().required(),
                        cmodelo: joi.number().required(),
                        cversion: joi.number().required(),
                        xplaca: joi.string().required(),
                        fano: joi.number().required(),
                        xcolor: joi.string().required(),
                        nkilometraje: joi.number().required(),
                        bimportado: joi.bool().required(),
                        xcertificadoorigen: joi.string().required(),
                        mpreciovehiculo: joi.number().required(),
                        xserialcarroceria: joi.string().required(),
                        xserialmotor: joi.string().required(),
                        cmoneda: joi.number().required(),
                        xuso: joi.number().required(),
                        ncapacidadcarga: joi.number().required(),
                        ncapacidadpasajeros: joi.number().required(),
                        xtipo: joi.string().allow('').allow(null),
                        images: joi.object({
                            create: joi.array().items(
                                joi.object({
                                    cimagen: joi.number().required(),
                                    xrutaimagen: joi.string().required()
                                })
                            ),
                            update: joi.array().items(
                                joi.object({
                                    cimagen: joi.number().required(),
                                    xrutaimagen: joi.string().required()
                                })
                            ),
                            delete: joi.array().items(
                                joi.object({
                                    cimagen: joi.number().required()
                                })
                            )
                        })
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cvehiculopropietario: joi.number().required()
                    })
                )
            })
        }),
        updateThirdpartiesApiOwnerVehicleImageSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number().required(),
            cvehiculopropietario: joi.number().required(),
            cusuariomodificacion: joi.number().required(),
            images: joi.object({
                create: joi.array().items(
                    joi.object({
                        cimagen: joi.number().required(),
                        xrutaimagen: joi.string().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cimagen: joi.number().required(),
                        xrutaimagen: joi.string().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cimagen: joi.number().required()
                    })
                )
            })
        })
    },
    production: {
        searchThirdpartiesProductionOwnerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string(),
            xnombre: joi.string(),
            xapellido: joi.string()
        }),
        createThirdpartiesProductionOwnerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xnombre: joi.string().required(),
            xapellido: joi.string().allow('').allow(null),
            cestadocivil: joi.number().allow('').allow(null),
            ctipodocidentidad: joi.number().required(),
            fnacimiento: joi.string().allow('').allow(null),
            xprofesion: joi.string(),
            xocupacion: joi.string(),
            xdocidentidad: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xdireccion: joi.string().required(),
            xemail: joi.string().email().required(),
            xtelefonocasa: joi.string(),
            xtelefonocelular: joi.string().required(),
            xfax: joi.string(),
            cparentesco: joi.number().allow('').allow(null),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            //csexo: joi.number().required(),
            //xnacionalidad: joi.string().required(),
            documents: joi.array().items(
                joi.object({
                    cdocumento: joi.number().required(),
                    xrutaarchivo: joi.string().required()
                })
            ),
            vehicles: joi.array().items(
                joi.object({
                    cmarca: joi.number().required(),
                    cmodelo: joi.number().required(),
                    cversion: joi.number().required(),
                    xplaca: joi.string().required(),
                    fano: joi.number().required(),
                    xcolor: joi.string().required(),
                    nkilometraje: joi.number().required(),
                    bimportado: joi.bool().allow('').allow(null),
                    xcertificadoorigen: joi.string().required(),
                    mpreciovehiculo: joi.number().required(),
                    xserialcarroceria: joi.string().required(),
                    xserialmotor: joi.string().required(),
                    cmoneda: joi.number().required(),
                    xuso: joi.string().required(),
                    ncapacidadcarga: joi.number().required(),
                    ncapacidadpasajeros: joi.number().required(),
                    xtipo: joi.string().allow('').allow(null),
                    images: joi.array().items(
                        joi.object({
                            cimagen: joi.number().required(),
                            xrutaimagen: joi.string().required()
                        })
                    )
                })
            )
        }),
        detailThirdpartiesProductionOwnerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number().required()
        }),
        updateThirdpartiesProductionOwnerSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number().required(),
            xnombre: joi.string().required(),
            xapellido: joi.string().allow('').allow(null),
            cestadocivil: joi.number().allow('').allow(null),
            ctipodocidentidad: joi.number().required(),
            fnacimiento: joi.string().allow('').allow(null),
            xprofesion: joi.string(),
            xocupacion: joi.string(),
            xdocidentidad: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xdireccion: joi.string().required(),
            xemail: joi.string().email().required(),
            xtelefonocasa: joi.string(),
            xtelefonocelular: joi.string().required(),
            xfax: joi.string(),
            cparentesco: joi.number().allow('').allow(null),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            documents: joi.object({
                create: joi.array().items(
                    joi.object({ 
                        cdocumento: joi.number().required(), 
                        xrutaarchivo: joi.string().required() 
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cdocumentopropietario: joi.number().required(),
                        cdocumento: joi.number().required(),
                        xrutaarchivo: joi.string().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cdocumentopropietario: joi.number().required()
                    })
                ),
            }),
            vehicles: joi.object({
                create: joi.array().items(
                    joi.object({ 
                        cmarca: joi.number().required(),
                        cmodelo: joi.number().required(),
                        xplaca: joi.string().required(),
                        fano: joi.number().required(),
                        nkilometraje: joi.number().required(),
                        xcertificadoorigen: joi.string().allow('').allow(null),
                        mpreciovehiculo: joi.number().allow('').allow(null),
                        xserialcarroceria: joi.string().required(),
                        xserialmotor: joi.string().required(),
                        cmoneda: joi.allow('').allow(null),
                        xuso: joi.string().required(),
                        xtipo: joi.string().required(),
                        xcolor: joi.string().required(),
                        ncapacidadcarga: joi.number().required(),
                        ncapacidadpasajeros: joi.number().required(),
                        bimportado: joi.bool().allow('').allow(null),
                        images: joi.array().items(
                            joi.object({
                                cimagen: joi.number().required(),
                                xrutaimagen: joi.string().required()
                            })
                        )
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cvehiculopropietario: joi.number().required(),
                        cmarca: joi.number().required(),
                        cmodelo: joi.number().required(),
                        xplaca: joi.string().required(),
                        fano: joi.number().required(),
                        nkilometraje: joi.number().allow('').allow(null),
                        bimportado: joi.allow('').allow(null),
                        xcertificadoorigen: joi.string().allow('').allow(null),
                        mpreciovehiculo: joi.allow('').allow(null),
                        xserialcarroceria: joi.string().required(),
                        xserialmotor: joi.string().required(),
                        cversion: joi.allow('').allow(null),
                        cmoneda: joi.allow('').allow(null),
                        xuso: joi.allow('').allow(null),
                        xcolor: joi.string().required(),
                        ncapacidadcarga: joi.allow('').allow(null),
                        ncapacidadpasajeros: joi.allow('').allow(null),
                        xtipo: joi.string().allow('').allow(null),
                        images: joi.object({
                            create: joi.array().items(
                                joi.object({
                                    cimagen: joi.number().required(),
                                    xrutaimagen: joi.string().required()
                                })
                            ),
                            update: joi.array().items(
                                joi.object({
                                    cimagen: joi.number().required(),
                                    xrutaimagen: joi.string().required()
                                })
                            ),
                            delete: joi.array().items(
                                joi.object({
                                    cimagen: joi.number().required()
                                })
                            )
                        })
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cvehiculopropietario: joi.number().required()
                    })
                )
            })
        })
    }
}