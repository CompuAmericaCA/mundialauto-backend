const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        searchUtilsApiValrepCivilStatusSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        searchUtilsApiValrepProcessDocumentSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cmodulo: joi.number().required()
        }),
        searchUtilsApiValrepDocumentTypeSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required()
        }),
        searchUtilsApiValrepStateSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required()
        }),
        searchUtilsApiValrepCitySchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            cestado: joi.number().required()
        }),
        searchUtilsApiValrepRelationshipSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required()
        }),
        searchUtilsApiValrepBrandSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required()
        }),
        searchUtilsApiValrepModelSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            cmarca: joi.number().required()
        }),
        searchUtilsApiValrepVersionSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            cmarca: joi.number().required(),
            cmodelo: joi.number().required()
        }),
        searchUtilsApiValrepColorSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required()
        }),
        searchUtilsApiValrepImageSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        searchUtilsApiValrepPaymentMethodologySchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        searchUtilsApiValrepBankSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cpais: joi.number().required()
        }),
        searchUtilsApiValrepProviderServiceTypeSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cproveedor: joi.number().required(),
            cplan: joi.number().required()
        }),
        searchUtilsApiValrepProviderServiceSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            ctiposervicio: joi.number().required(),
            cproveedor: joi.number().required(),
            cplan: joi.number().required()
        }),
        searchUtilsApiValrepPlanServiceTypeSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cplan: joi.number().required()
        }),
        searchUtilsApiValrepPlanServiceSchema: joi.object({
            permissionData: validationSchema.api.verifyApiModulePermissionSchema.required(),
            cplan: joi.number().required(),
            ctiposervicio: joi.number().required()
        })
    },
    production: {
        searchUtilsProductionValrepImageSchema: joi.object({
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        searchUtilsProductionValrepPaymentMethodologySchema: joi.object({
            cpais: joi.number().required(),
            ccompania: joi.number().required()
        }),
        searchUtilsProductionValrepPlanPaymentMethodologySchema: joi.object({
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            cplan: joi.number().required()
        }),
        searchUtilsProductionValrepPlanServiceTypeSchema: joi.object({
            cplan: joi.number().required()
        }),
        searchUtilsProductionValrepPlanServiceSchema: joi.object({
            cplan: joi.number().required(),
            ctiposervicio: joi.number().required()
        }),
        searchUtilsProductionValrepClubMenuSchema: joi.object({})
    }
}