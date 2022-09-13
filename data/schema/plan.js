const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        searchProductsApiPlanSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        detailProductsApiPlanSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cplan: joi.number().required()
        })
    },
    production: {
        searchProductsProductionPlanSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipoplan: joi.string(),
            xplan: joi.string()
        }),
        createProductsProductionPlanSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xplan: joi.string().required(),
            ctipoplan: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            paymentMethodologies: joi.array().items(
                joi.object({
                    cmetodologiapago: joi.number().required(), 
                    mmetodologiapago: joi.number().required()
                })
            ),
            insurers: joi.array().items(
                joi.object({
                    caseguradora: joi.number().required()
                })
            ),
            services: joi.array().items(
                joi.object({
                    cservicio: joi.number().required(),
                    ctiposervicio: joi.number().required(),
                    ctipoagotamientoservicio: joi.number().required(),
                    ncantidad: joi.number().required(),
                    pservicio: joi.number().required(),
                    mmaximocobertura: joi.number().required(),
                    mdeducible: joi.number().required(),
                    bserviciopadre: joi.bool().required(),
                    coverages: joi.array().items(
                        joi.object({
                            ccobertura: joi.number().required(),
                            cconceptocobertura: joi.number().required()
                        })
                    )
                })
            )
        }),
        detailProductsProductionPlanSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cplan: joi.number().required()
        }),
        updateProductsProductionPlanSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cplan: joi.number().required(),
            xplan: joi.string().required(),
            ctipoplan: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            paymentMethodologies: joi.object({
                create: joi.array().items(
                    joi.object({
                        cmetodologiapago: joi.number().required(), 
                        mmetodologiapago: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cmetodologiapago: joi.number().required(), 
                        mmetodologiapago: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cmetodologiapago: joi.number().required()
                    })
                )
            }),
            insurers: joi.object({
                create: joi.array().items(
                    joi.object({
                        caseguradora: joi.number().required()
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        caseguradora: joi.number().required()
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        caseguradora: joi.number().required()
                    })
                )
            }),
            services: joi.object({
                create: joi.array().items(
                    joi.object({
                        cservicio: joi.number().required(),
                        ctiposervicio: joi.number().required(),
                        ctipoagotamientoservicio: joi.number().required(),
                        ncantidad: joi.number().required(),
                        pservicio: joi.number().required(),
                        mmaximocobertura: joi.number().required(),
                        mdeducible: joi.number().required(),
                        bserviciopadre: joi.bool().required(),
                        coverages: joi.array().items(
                            joi.object({
                                ccobertura: joi.number().required(),
                                cconceptocobertura: joi.number().required()
                            })
                        )
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        cservicioplan: joi.number().required(),
                        cservicio: joi.number().required(),
                        ctiposervicio: joi.number().required(),
                        ctipoagotamientoservicio: joi.number().required(),
                        ncantidad: joi.number().required(),
                        pservicio: joi.number().required(),
                        mmaximocobertura: joi.number().required(),
                        mdeducible: joi.number().required(),
                        bserviciopadre: joi.bool().required(),
                        coverages: joi.object({
                            create: joi.array().items(
                                joi.object({
                                    ccobertura: joi.number().required(),
                                    cconceptocobertura: joi.number().required()
                                })
                            ),
                            update: joi.array().items(
                                joi.object({
                                    ccobertura: joi.number().required(),
                                    cconceptocobertura: joi.number().required()
                                })
                            ),
                            delete: joi.array().items(
                                joi.object({
                                    ccobertura: joi.number().required()
                                })
                            )
                        })
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        cservicioplan: joi.number().required(),
                        cservicio: joi.number().required()
                    })
                )
            })
        })
    }
}