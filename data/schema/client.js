const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {

    },
    production: {
        searchClientsProductionClientSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xcliente: joi.string().allow('').allow(null),
            xcontrato: joi.string().allow('').allow(null),
            ctipodocidentidad: joi.string().allow('').allow(null),
            xdocidentidad: joi.string().allow('').allow(null)
        }),
        createClientsProductionClientSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xcliente: joi.string().required(),
            xcontrato: joi.string().allow('').allow(null),
            xrepresentante: joi.string().required(),
            cempresa: joi.number().allow(''),
            cactividadempresa: joi.number().required(),
            ctipodocidentidad: joi.number().required(),
            xdocidentidad: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xdireccionfiscal: joi.string().required(),
            xemail: joi.string().required(),
            fanomaximo: joi.number().allow(''),
            finicio: joi.date().required(),
            xtelefono: joi.string().allow('').allow(null),
            bcolectivo: joi.bool().required(),
            bfacturar: joi.bool().required(),
            bfinanciar: joi.bool().required(),
            bcontribuyente: joi.bool().required(),
            bimpuesto: joi.bool().required(),
            bnotificacionsms: joi.bool().required(),
            xpaginaweb: joi.string().allow('').allow(null),
            ctipopago: joi.number().allow(''),
            xrutaimagen: joi.string().allow('').allow(null),
            ifacturacion: joi.string().allow('').allow(null),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            banks: joi.array().items(
                joi.object({
                    cbanco: joi.number().required(),
                    ctipocuentabancaria: joi.number().required(),
                    xnumerocuenta: joi.string().required(),
                    xcontrato: joi.string().required(),
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
                    xemail: joi.string().allow('').allow(null),
                    xcargo: joi.string().allow('').allow(null),
                    xtelefonocasa: joi.string().allow('').allow(null),
                    xtelefonooficina: joi.string().allow('').allow(null),
                    xfax: joi.string().allow('').allow(null),
                    bnotificacion: joi.bool().required()
                })
            ),
            associates: joi.array().items(
                joi.object({
                    casociado: joi.number().required()
                })
            ),
            bonds: joi.array().items(
                joi.object({
                    pbono: joi.number().required(),
                    mbono: joi.number().required(),
                    fefectiva: joi.date().required()
                })
            ),
            brokers: joi.array().items(
                joi.object({
                    ccorredor: joi.number().required(),
                    pcorredor: joi.number().required(),
                    mcorredor: joi.number().required(),
                    fefectiva: joi.date().required()
                })
            ),
            depreciations: joi.array().items(
                joi.object({
                    cdepreciacion: joi.number().required(),
                    pdepreciacion: joi.number().required(),
                    mdepreciacion: joi.number().required(),
                    fefectiva: joi.date().required()
                })
            ),
            relationships: joi.array().items(
                joi.object({
                    cparentesco: joi.number().required(),
                    xobservacion: joi.string().required(),
                    fefectiva: joi.date().required()
                })
            ),
            penalties: joi.array().items(
                joi.object({
                    cpenalizacion: joi.number().required(),
                    ppenalizacion: joi.number().required(),
                    mpenalizacion: joi.number().required(),
                    fefectiva: joi.date().required()
                })
            ),
            providers: joi.array().items(
                joi.object({
                    cproveedor: joi.number().required(),
                    xobservacion: joi.string().required(),
                    fefectiva: joi.date().required()
                })
            ),
            models: joi.array().items(
                joi.object({
                    cmarca: joi.number().required(),
                    cmodelo: joi.number().required(),
                    xobservacion: joi.string().required()
                })
            ),
            workers: joi.array().items(
                joi.object({
                    xnombre: joi.string().required(),
                    xapellido: joi.string().required(),
                    ctipodocidentidad: joi.number().required(),
                    xdocidentidad: joi.string().required(),
                    xtelefonocelular: joi.string().required(),
                    xemail: joi.string().required(),
                    xprofesion: joi.string().allow('').allow(null),
                    xocupacion: joi.string().allow('').allow(null),
                    xtelefonocasa: joi.string().allow('').allow(null),
                    xfax: joi.string().allow('').allow(null),
                    cparentesco: joi.number().required(),
                    cestado: joi.number().required(),
                    cciudad: joi.number().required(),
                    xdireccion: joi.string().required(),
                    fnacimiento: joi.date().required(),
                    cestadocivil: joi.number().required()
                })
            ),
            documents: joi.array().items(
                joi.object({
                    cdocumento: joi.number().required(),
                    xrutaarchivo: joi.string().allow('').allow(null)
                })
            ),
            groupers: joi.array().items(
                joi.object({
                    xcontratoalternativo: joi.string().required(),
                    xnombre: joi.string().required(),
                    xrazonsocial: joi.string().required(),
                    cestado: joi.number().required(),
                    cciudad: joi.number().required(),
                    xdireccionfiscal: joi.string().required(),
                    ctipodocidentidad: joi.number().required(),
                    xdocidentidad: joi.string().required(),
                    bfacturar: joi.bool().required(),
                    bcontribuyente: joi.bool().required(),
                    bimpuesto: joi.bool().required(),
                    xtelefono: joi.string().required(),
                    xfax: joi.string().allow('').allow(null),
                    xemail: joi.string().required(),
                    xrutaimagen: joi.string().allow('').allow(null),
                    bactivo: joi.bool().required(),
                    banks: joi.array().items(
                        joi.object({
                            cbanco: joi.number().required(),
                            ctipocuentabancaria: joi.number().required(),
                            xnumerocuenta: joi.string().required(),
                            xcontrato: joi.string().required(),
                            bprincipal: joi.bool().required()
                        })
                    )
                })
            ),
            plans: joi.array().items(
                joi.object({
                    cplan: joi.number().required(),
                    casociado: joi.number().required(),
                    ctipoplan: joi.number().required(),
                    fdesde: joi.date().required(),
                    fhasta: joi.date().required()
                })
            )
        }),
        detailClientsProductionClientSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ccliente: joi.number().required()
        }),
        updateClientsProductionClientSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ccliente: joi.number().required(),
            xcliente: joi.string().required(),
            xcontrato: joi.string().allow('').allow(null),
            xrepresentante: joi.string().required(),
            cempresa: joi.number().required(),
            cactividadempresa: joi.number().required(),
            ctipodocidentidad: joi.number().required(),
            xdocidentidad: joi.string().required(),
            cestado: joi.number().required(),
            cciudad: joi.number().required(),
            xdireccionfiscal: joi.string().required(),
            xemail: joi.string().required(),
            fanomaximo: joi.number().allow(null), // deberia de ser allow('')
            finicio: joi.date().required(),
            xtelefono: joi.string().allow('').allow(null),
            bcolectivo: joi.bool().required(),
            bfacturar: joi.bool().required(),
            bfinanciar: joi.bool().required(),
            bcontribuyente: joi.bool().required(),
            bimpuesto: joi.bool().required(),
            bnotificacionsms: joi.bool().required(),
            xpaginaweb: joi.string().allow('').allow(null),
            ctipopago: joi.number().required(),
            xrutaimagen: joi.string().allow('').allow(null),
            ifacturacion: joi.string().allow('').allow(null),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            banks: joi.object({
                create: joi.array().items(
                    joi.object({
                        cbanco: joi.number().required(),
                        ctipocuentabancaria: joi.number().required(),
                        xnumerocuenta: joi.string().required(),
                        xcontrato: joi.string().required(),
                        bprincipal: joi.bool().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cbanco: joi.number().required(),
                        ctipocuentabancaria: joi.number().required(),
                        xnumerocuenta: joi.string().required(),
                        xcontrato: joi.string().required(),
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
                        xemail: joi.string().allow('').allow(null),
                        xcargo: joi.string().allow('').allow(null),
                        xtelefonocasa: joi.string().allow('').allow(null),
                        xtelefonooficina: joi.string().allow('').allow(null),
                        xfax: joi.string().allow('').allow(null),
                        bnotificacion: joi.bool().required()
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
                        xemail: joi.string().allow('').allow(null),
                        xcargo: joi.string().allow('').allow(null),
                        xtelefonocasa: joi.string().allow('').allow(null),
                        xtelefonooficina: joi.string().allow('').allow(null),
                        xfax: joi.string().allow('').allow(null),
                        bnotificacion: joi.bool().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        ccontacto: joi.number().required()
                    })
                )
            }),
            associates: joi.object({
                create: joi.array().items(
                    joi.object({
                        casociado: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        casociado: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        casociado: joi.number().required()
                    })
                )
            }),
            bonds: joi.object({
                create: joi.array().items(
                    joi.object({
                        pbono: joi.number().required(),
                        mbono: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cbono: joi.number().required(),
                        pbono: joi.number().required(),
                        mbono: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cbono: joi.number().required()
                    })
                )
            }),
            brokers: joi.object({
                create: joi.array().items(
                    joi.object({
                        ccorredor: joi.number().required(),
                        pcorredor: joi.number().required(),
                        mcorredor: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        ccorredor: joi.number().required(),
                        pcorredor: joi.number().required(),
                        mcorredor: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        ccorredor: joi.number().required()
                    })
                )
            }),
            depreciations: joi.object({
                create: joi.array().items(
                    joi.object({
                        cdepreciacion: joi.number().required(),
                        pdepreciacion: joi.number().required(),
                        mdepreciacion: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cdepreciacion: joi.number().required(),
                        pdepreciacion: joi.number().required(),
                        mdepreciacion: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cdepreciacion: joi.number().required()
                    })
                )
            }),
            relationships: joi.object({
                create: joi.array().items(
                    joi.object({
                        cparentesco: joi.number().required(),
                        xobservacion: joi.string().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cparentesco: joi.number().required(),
                        xobservacion: joi.string().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cparentesco: joi.number().required()
                    })
                )
            }),
            penalties: joi.object({
                create: joi.array().items(
                    joi.object({
                        cpenalizacion: joi.number().required(),
                        ppenalizacion: joi.number().required(),
                        mpenalizacion: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cpenalizacion: joi.number().required(),
                        ppenalizacion: joi.number().required(),
                        mpenalizacion: joi.number().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cpenalizacion: joi.number().required()
                    })
                )
            }),
            providers: joi.object({
                create: joi.array().items(
                    joi.object({
                        cproveedor: joi.number().required(),
                        xobservacion: joi.string().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cproveedor: joi.number().required(),
                        xobservacion: joi.string().required(),
                        fefectiva: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cproveedor: joi.number().required()
                    })
                )
            }),
            models: joi.object({
                create: joi.array().items(
                    joi.object({
                        cmarca: joi.number().required(),
                        cmodelo: joi.number().required(),
                        xobservacion: joi.string().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cmarca: joi.number().required(),
                        cmodelo: joi.number().required(),
                        xobservacion: joi.string().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cmodelo: joi.number().required()
                    })
                )
            }),
            workers: joi.object({
                create: joi.array().items(
                    joi.object({
                        xnombre: joi.string().required(),
                        xapellido: joi.string().required(),
                        ctipodocidentidad: joi.number().required(),
                        xdocidentidad: joi.string().required(),
                        xtelefonocelular: joi.string().required(),
                        xemail: joi.string().required(),
                        xprofesion: joi.string().allow('').allow(null),
                        xocupacion: joi.string().allow('').allow(null),
                        xtelefonocasa: joi.string().allow('').allow(null),
                        xfax: joi.string().allow('').allow(null),
                        cparentesco: joi.number().required(),
                        cestado: joi.number().required(),
                        cciudad: joi.number().required(),
                        xdireccion: joi.string().required(),
                        fnacimiento: joi.date().required(),
                        cestadocivil: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        ctrabajador: joi.number().required(),
                        xnombre: joi.string().required(),
                        xapellido: joi.string().required(),
                        ctipodocidentidad: joi.number().required(),
                        xdocidentidad: joi.string().required(),
                        xtelefonocelular: joi.string().required(),
                        xemail: joi.string().required(),
                        xprofesion: joi.string().allow('').allow(null),
                        xocupacion: joi.string().allow('').allow(null),
                        xtelefonocasa: joi.string().allow('').allow(null),
                        xfax: joi.string().allow('').allow(null),
                        cparentesco: joi.number().required(),
                        cestado: joi.number().required(),
                        cciudad: joi.number().required(),
                        xdireccion: joi.string().required(),
                        fnacimiento: joi.date().required(),
                        cestadocivil: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        ctrabajador: joi.number().required()
                    })
                )
            }),
            documents: joi.object({
                create: joi.array().items(
                    joi.object({
                        cdocumento: joi.number().required(),
                        xrutaarchivo: joi.string().allow('').allow(null)
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cdocumento: joi.number().required(),
                        xrutaarchivo: joi.string().allow('').allow(null)
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cdocumento: joi.number().required()
                    })
                )
            }),
            groupers: joi.object({
                create: joi.array().items(
                    joi.object({
                        xcontratoalternativo: joi.string().required(),
                        xnombre: joi.string().required(),
                        xrazonsocial: joi.string().required(),
                        cestado: joi.number().required(),
                        cciudad: joi.number().required(),
                        xdireccionfiscal: joi.string().required(),
                        ctipodocidentidad: joi.number().required(),
                        xdocidentidad: joi.string().required(),
                        bfacturar: joi.bool().required(),
                        bcontribuyente: joi.bool().required(),
                        bimpuesto: joi.bool().required(),
                        xtelefono: joi.string().required(),
                        xfax: joi.string().allow('').allow(null),
                        xemail: joi.string().required(),
                        xrutaimagen: joi.string().allow('').allow(null),
                        bactivo: joi.bool().required(),
                        banks: joi.array().items(
                            joi.object({
                                cbanco: joi.number().required(),
                                ctipocuentabancaria: joi.number().required(),
                                xnumerocuenta: joi.string().required(),
                                xcontrato: joi.string().required(),
                                bprincipal: joi.bool().required()
                            })
                        )
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cagrupador: joi.number().required(),
                        xcontratoalternativo: joi.string().required(),
                        xnombre: joi.string().required(),
                        xrazonsocial: joi.string().required(),
                        cestado: joi.number().required(),
                        cciudad: joi.number().required(),
                        xdireccionfiscal: joi.string().required(),
                        ctipodocidentidad: joi.number().required(),
                        xdocidentidad: joi.string().required(),
                        bfacturar: joi.bool().required(),
                        bcontribuyente: joi.bool().required(),
                        bimpuesto: joi.bool().required(),
                        xtelefono: joi.string().required(),
                        xfax: joi.string(),
                        xemail: joi.string().required(),
                        xrutaimagen: joi.string(),
                        bactivo: joi.bool().required(),
                        banks: joi.object({
                            create: joi.array().items(
                                joi.object({
                                    cbanco: joi.number().required(),
                                    ctipocuentabancaria: joi.number().required(),
                                    xnumerocuenta: joi.string().required(),
                                    xcontrato: joi.string().required(),
                                    bprincipal: joi.bool().required()
                                })
                            ),
                            update: joi.array().items(
                                joi.object({
                                    cbanco: joi.number().required(),
                                    ctipocuentabancaria: joi.number().required(),
                                    xnumerocuenta: joi.string().required(),
                                    xcontrato: joi.string().required(),
                                    bprincipal: joi.bool().required()
                                })
                            ),
                            delete: joi.array().items(
                                joi.object({
                                    cbanco: joi.number().required()
                                })
                            )
                        })
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cagrupador: joi.number().required()
                    })
                )
            }),
            plans: joi.object({
                create: joi.array().items(
                    joi.object({
                        cplan: joi.number().required(),
                        casociado: joi.number().required(),
                        ctipoplan: joi.number().required(),
                        fdesde: joi.date().required(),
                        fhasta: joi.date().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cplancliente: joi.number().required(),
                        cplan: joi.number().required(),
                        casociado: joi.number().required(),
                        ctipoplan: joi.number().required(),
                        fdesde: joi.date().required(),
                        fhasta: joi.date().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cplancliente: joi.number().required()
                    })
                )
            })
        })
    }
}