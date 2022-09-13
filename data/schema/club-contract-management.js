const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        searchSubscriptionApiClubContractManagementSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string()
        }),
        searchSubscriptionApiClubContractManagementPlateSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            xplaca: joi.string().required()
        }),
        createSubscriptionApiClubContractManagementSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            fvencimiento: joi.date().required(),
            cpropietario: joi.number().required(),
            cvehiculopropietario: joi.number().required(),
            bpropietario: joi.bool().required(),
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
            xcontrasena: joi.string().required(),
            xtelefonocasa: joi.string(),
            xtelefonocelular: joi.string().required(),
            xfax: joi.string(),
            cparentesco: joi.number().required(),
            ctipoplan: joi.number().required(),
            cplan: joi.number().required(),
            cmetodologiapago: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            csexo: joi.number().required(),
            xnacionalidad: joi.string().required(),
            paymentVouchers: joi.array().items(
                joi.object({ 
                    ctransaccion: joi.string().required(),
                    creferenciatransaccion: joi.string().required(),
                    cbanco: joi.number().required()
                })
            )
        })
    },
    production: {
        searchSubscriptionProductionClubContractManagementSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string(),
            xnombre: joi.string(),
            xapellido: joi.string()
        }),
        searchSubscriptionApiClubContractManagementOwnerSchema: joi.object({
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ctipodocidentidad: joi.number(),
            xdocidentidad: joi.string(),
            xnombre: joi.string(),
            xapellido: joi.string()
        }),
        searchSubscriptionApiClubContractManagementOwnerVehicleSchema: joi.object({
            cpropietario: joi.number().required(),
            cmarca: joi.number(),
            cmodelo: joi.number(),
            cversion: joi.number(),
            xplaca: joi.string()
        }),
        createSubscriptionProductionClubContractManagementSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            fvencimiento: joi.date().required(),
            cpropietario: joi.number().required(),
            cvehiculopropietario: joi.number().required(),
            bpropietario: joi.bool().required(),
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
            ctipoplan: joi.number().required(),
            cplan: joi.number().required(),
            cmetodologiapago: joi.number().required(),
            csexo: joi.number().required(),
            xnacionalidad: joi.string().required(),
            bactivo: joi.bool().required(),
            cusuariocreacion: joi.number().required(),
            paymentVouchers: joi.array().items(
                joi.object({ 
                    ctransaccion: joi.string().required(),
                    creferenciatransaccion: joi.string().required(),
                    cbanco: joi.number().required()
                })
            )
        }),
        detailSubscriptionProductionClubContractManagementOwnerSchema: joi.object({
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cpropietario: joi.number().required(),
        }),
        detailSubscriptionProductionClubContractManagementSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ccontratoclub: joi.number().required(),
        }),
        updateSubscriptionProductionClubContractManagementSchema: joi.object({
            permissionData: validationSchema.production.verifyProductionModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            ccontratoclub: joi.number().required(),
            cpropietario: joi.number().required(),
            fvencimiento: joi.string().required(),
            frenovacion: joi.string(),
            ctipoplan: joi.number().required(),
            cplan: joi.number().required(),
            cmetodologiapago: joi.number().required(),
            bactivo: joi.bool().required(),
            cusuariomodificacion: joi.number().required(),
            csexo: joi.number().required(),
            xnacionalidad: joi.string().required(),
            paymentVouchers: joi.object({
                create: joi.array().items(
                    joi.object({ 
                        cbanco: joi.number().required(), 
                        ctransaccion: joi.string().required(), 
                        creferenciatransaccion: joi.string().required() 
                    })
                ),
                update: joi.array().items(
                    joi.object({
                        ccomprobantepago: joi.number().required(),
                        cbanco: joi.number().required(), 
                        ctransaccion: joi.string().required(), 
                        creferenciatransaccion: joi.string().required() 
                    })
                ),
                delete: joi.array().items(
                    joi.object({
                        ccomprobantepago: joi.number().required()
                    })
                ),
            })
        })
    }
}