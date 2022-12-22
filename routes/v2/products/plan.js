const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/api/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'plan', req.body, 'searchProductsApiPlanSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(400).json({ status: false, code: 401, condition: 'consumer-dont-have-permissions', expired: false });
            return;
        }
        operationSearchPlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPlan' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'plan', req.body, 'searchProductsProductionPlanSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(400).json({ status: false, code: 401, condition: 'consumer-dont-have-permissions', expired: false });
            return;
        }
        operationSearchPlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPlan' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationSearchPlan = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoplan: requestBody.ctipoplan ? requestBody.ctipoplan : undefined,
        xplan: requestBody.xplan ? requestBody.xplan.toUpperCase() : undefined
    };
    let searchPlan = await db.searchPlanQuery(searchData).then((res) => res);
    if(searchPlan.error){ return  { status: false, code: 500, message: searchPlan.error }; }
    if(searchPlan.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Plan not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchPlan.result.recordset.length; i++){
        jsonList.push({
            cplan: searchPlan.result.recordset[i].CPLAN,
            xplan: searchPlan.result.recordset[i].XPLAN,
            mcosto: searchPlan.result.recordset[i].MCOSTO,
            bactivo: searchPlan.result.recordset[i].BACTIVO
        });
    }
    return { status: true, list: jsonList };
}

router.route('/production/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'plan', req.body, 'createProductsProductionPlanSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BCREAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationCreatePlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePlan' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationCreatePlan = async (authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let planData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        paymentMethodologies: requestBody.paymentMethodologies ? requestBody.paymentMethodologies : undefined,
        insurers: requestBody.insurers ? requestBody.insurers : undefined,
        services: requestBody.services ? requestBody.services : undefined,
        xplan: requestBody.xplan.toUpperCase(),
        bactivo: requestBody.bactivo,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoplan: requestBody.ctipoplan,
        cusuariocreacion: requestBody.cusuariocreacion
    }
    let verifyPlanName = await db.verifyPlanNameToCreateQuery(planData).then((res) => res);
    if(verifyPlanName.error){ return { status: false, code: 500, message: verifyPlanName.error }; }
    if(verifyPlanName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'plan-name-already-exist' }; }
    let createPlan = await db.createPlanQuery(planData).then((res) => res);
    if(createPlan.error){ return { status: false, code: 500, message: createPlan.error }; }
    if(createPlan.result.rowsAffected == 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPlan' }; }
    return { status: true, cplan: createPlan.result.recordset[0].CPLAN };
}

router.route('/api/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'plan', req.body, 'detailProductsApiPlanSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyApiModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(400).json({ status: false, code: 401, condition: 'consumer-dont-have-permissions', expired: false });
            return;
        }
        operationDetailPlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPlan' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

router.route('/production/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    // let validateSchema = helper.validateSchema('production', 'plan', req.body, 'detailProductsProductionPlanSchema');
    // if(validateSchema.error){ 
    //     res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
    //     return;
    // }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BDETALLE').then((response) => {
        if(response.error){ 
            res.status(400).json({ status: false, code: 401, condition: 'consumer-dont-have-permissions', expired: false });
            return;
        }
        operationDetailPlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPlan' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationDetailPlan = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let planData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        cplan: requestBody.cplan
    };
    let getPlanData = await db.getPlanDataQuery(planData).then((res) => res);
    if(getPlanData.error){ return { status: false, code: 500, message: getPlanData.error }; }
    if(getPlanData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Plan not found.' }; }
    let paymentMethodologies = [];
    let getPlanPaymentMethodologiesData = await db.getPlanPaymentMethodologiesDataQuery(planData.cplan).then((res) => res);
    if(getPlanPaymentMethodologiesData.error){ return { status: false, code: 500, message: getPlanPaymentMethodologiesData.error }; }
    if(getPlanPaymentMethodologiesData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanPaymentMethodologiesData.result.recordset.length; i++){
            let paymentMethodology = {
                cmetodologiapago: getPlanPaymentMethodologiesData.result.recordset[i].CMETODOLOGIAPAGO,
                xmetodologiapago: getPlanPaymentMethodologiesData.result.recordset[i].XMETODOLOGIAPAGO,
                mmetodologiapago: getPlanPaymentMethodologiesData.result.recordset[i].MMETODOLOGIAPAGO
            }
            paymentMethodologies.push(paymentMethodology);
        }
    }
    let insurers = [];
    let getPlanInsurersData = await db.getPlanInsurersDataQuery(planData.cplan).then((res) => res);
    if(getPlanInsurersData.error){ return { status: false, code: 500, message: getPlanInsurersData.error }; }
    if(getPlanInsurersData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanInsurersData.result.recordset.length; i++){
            let insurer = {
                caseguradora: getPlanInsurersData.result.recordset[i].CASEGURADORA,
                xaseguradora: getPlanInsurersData.result.recordset[i].XASEGURADORA
            }
            insurers.push(insurer);
        }
    }
    let services = [];
    let getPlanServicesData = await db.getPlanServicesDataQuery(planData.cplan).then((res) => res);
    if(getPlanServicesData.error){ return { status: false, code: 500, message: getPlanServicesData.error }; }
    if(getPlanServicesData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanServicesData.result.recordset.length; i++){
            let coverages = [];
            let getCoveragesServiceData = await db.getCoveragesServiceDataQuery(getPlanServicesData.result.recordset[i].CSERVICIOPLAN).then((res) => res);
            if(getCoveragesServiceData.error){ return { status: false, code: 500, message: getCoveragesServiceData.error }; }
            if(getCoveragesServiceData.result.rowsAffected > 0){
                for(let i = 0; i < getCoveragesServiceData.result.recordset.length; i++){
                    let coverage = {
                        ccobertura: getCoveragesServiceData.result.recordset[i].CCOBERTURA,
                        xcobertura: getCoveragesServiceData.result.recordset[i].XCOBERTURA,
                        cconceptocobertura: getCoveragesServiceData.result.recordset[i].CCONCEPTOCOBERTURA,
                        xconceptocobertura: getCoveragesServiceData.result.recordset[i].XCONCEPTOCOBERTURA
                    }
                    coverages.push(coverage);
                }
            }
            let service = {
                cservicio: getPlanServicesData.result.recordset[i].CSERVICIO,
                cservicioplan: getPlanServicesData.result.recordset[i].CSERVICIOPLAN,
                xservicio: getPlanServicesData.result.recordset[i].XSERVICIO,
                ctiposervicio: getPlanServicesData.result.recordset[i].CTIPOSERVICIO,
                xtiposervicio: getPlanServicesData.result.recordset[i].XTIPOSERVICIO,
                ctipoagotamientoservicio: getPlanServicesData.result.recordset[i].CTIPOAGOTAMIENTOSERVICIO,
                ncantidad: getPlanServicesData.result.recordset[i].NCANTIDAD,
                pservicio: getPlanServicesData.result.recordset[i].PSERVICIO,
                mmaximocobertura: getPlanServicesData.result.recordset[i].MMAXIMOCOBERTURA,
                mdeducible: getPlanServicesData.result.recordset[i].MDEDUCIBLE,
                bserviciopadre: getPlanServicesData.result.recordset[i].BSERVICIOPADRE,
                coverages: coverages
            }
            services.push(service);
        }
    }
    let servicesInsurers = [];
    let getPlanServicesInsurersData = await db.getPlanServicesInsurersDataQuery(planData.cplan).then((res) => res);
    if(getPlanServicesInsurersData.error){ return { status: false, code: 500, message: getPlanServicesInsurersData.error }; }
    if(getPlanServicesInsurersData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanServicesInsurersData.result.recordset.length; i++){
            let serviceInsurer = {
                cservicio: getPlanServicesInsurersData.result.recordset[i].CSERVICIO_ASEG,
                cservicioplan: getPlanServicesInsurersData.result.recordset[i].CSERVICIOPLAN,
                xservicio: getPlanServicesInsurersData.result.recordset[i].XSERVICIO_ASEG,
                ctiposervicio: getPlanServicesInsurersData.result.recordset[i].CTIPOSERVICIO,
                xtiposervicio: getPlanServicesInsurersData.result.recordset[i].XTIPOSERVICIO,
            }
            servicesInsurers.push(serviceInsurer);
        }
    }
    console.log( getPlanData.result.recordset[0].PASEGURADORA,getPlanData.result.recordset[0].PARYS);
    return { 
        status: true,
        cplan: getPlanData.result.recordset[0].CPLAN,
        xplan: getPlanData.result.recordset[0].XPLAN,
        mcosto: getPlanData.result.recordset[0].MCOSTO,
        ctipoplan: getPlanData.result.recordset[0].CTIPOPLAN,
        bactivo: getPlanData.result.recordset[0].BACTIVO,
        paymentMethodologies: paymentMethodologies,
        insurers: insurers,
        services: services,
        servicesInsurers: servicesInsurers,
        parys: getPlanData.result.recordset[0].PARYS, 
        paseguradora: getPlanData.result.recordset[0].PASEGURADORA,
    }
}

router.route('/productos').get((req, res) => {
    operationDetailProducts().then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        console.log(err.message);
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPlan' } });
    });
});

const operationDetailProducts = async() => {

    let planes = [
        {
            codigoplan: 1,
            nombreplan: "PLAN BÁSICO",
            costomensualusd: 1,
            costoanualusd: 12,
            detalle: [
                {
                    codigotiposervicio: 71,
                    nombretiposervicio: "JURÍDICO",
                    servicios: [
                        {
                            nombreservicio: "ASESORÍA Y ASISTENCIA LEGAL TELEFÓNICA"
                        }
                    ]
                },
                {
                    codigotiposervicio: 72,
                    nombretiposervicio: "MANTENIMIENTO",
                    servicios: [
                        {
                            nombreservicio: "MANTENIMIENTO CORRECTIVO"
                        },
                        {
                            nombreservicio: "MANTENIMIENTO PREVENTIVO"
                        }
                    ]
                },
                {
                    codigotiposervicio: 75,
                    nombretiposervicio: "SERVICIOS",
                    servicios: [
                        {
                            nombreservicio: "CENTRO DE ATENCIÓN 24/7 (CALL CENTER)"
                        },
                        {
                            nombreservicio: "RED DE PROVEEDORES CERTIFICADOS"
                        },
                        {
                            nombreservicio: "ACOMPAÑAMIENTO"
                        },
                        {
                            nombreservicio: "APOYO ESTADÍSTICO"
                        },
                        {
                            nombreservicio: "ASISTENCIA VIAL TELEFÓNICA EN CASO DE SINIESTRO"
                        },
                        {
                            nombreservicio: "BÚSQUEDA O UBICACIÓN DE REPUESTOS"
                        },
                        {
                            nombreservicio: "CRISTALERÍA Y VIDRIOS"
                        },
                        {
                            nombreservicio: "EXPEDIENTES ELECTRÓNICOS"
                        },
                        {
                            nombreservicio: "MANEJO Y ADMINISTRACIÓN DE SINIESTROS"
                        },
                        {
                            nombreservicio: "TALLER DE REPARACIÓN MECÁNICA LATONERIA Y PINTURA"
                        }
                    ]
                },
                {
                    codigotiposervicio: 68,
                    nombretiposervicio: "ASISTENCIA PERSONAS",
                    servicios: [
                        {
                            nombreservicio: "RCV"
                        }
                    ]
                }
            ]
        },
        {
            codigoplan: 2,
            nombreplan: "PLAN GENERAL",
            costomensualusd: 3,
            costoanualusd: 36,
            detalle: [
                {
                    codigotiposervicio: 71,
                    nombretiposervicio: "JURÍDICO",
                    servicios: [
                        {
                            nombreservicio: "ASESORÍA Y ASISTENCIA LEGAL TELEFÓNICA"
                        }
                    ]
                },
                {
                    codigotiposervicio: 72,
                    nombretiposervicio: "MANTENIMIENTO",
                    servicios: [
                        {
                            nombreservicio: "MANTENIMIENTO CORRECTIVO"
                        },
                        {
                            nombreservicio: "MANTENIMIENTO PREVENTIVO"
                        }
                    ]
                },
                {
                    codigotiposervicio: 75,
                    nombretiposervicio: "SERVICIOS",
                    servicios: [
                        {
                            nombreservicio: "CENTRO DE ATENCIÓN 24/7 (CALL CENTER)"
                        },
                        {
                            nombreservicio: "RED DE PROVEEDORES CERTIFICADOS"
                        },
                        {
                            nombreservicio: "ACOMPAÑAMIENTO"
                        },
                        {
                            nombreservicio: "APOYO ESTADISTICO"
                        },
                        {
                            nombreservicio: "ASISTENCIA VIAL TELEFÓNICA EN CASO DE SINIESTRO"
                        },
                        {
                            nombreservicio: "BÚSQUEDA O UBICACIÓN DE REPUESTOS"
                        },
                        {
                            nombreservicio: "CRISTALERÍA Y VIDRIOS"
                        },
                        {
                            nombreservicio: "EXPEDIENTES ELECTRÓNICOS"
                        },
                        {
                            nombreservicio: "MANEJO Y ADMINISTRACIÓN DE SINIESTROS"
                        },
                        {
                            nombreservicio: "TALLER DE REPARACIÓN MECÁNICA LATONERIA Y PINTURA"
                        }
                    ]
                },
                {
                    codigotiposervicio: 73,
                    nombretiposervicio: "MECÁNICA",
                    servicios: [
                        {
                            nombreservicio: "MECÁNICA A DOMICILIO"
                        },
                        {
                            nombreservicio: "CAMBIO CAUCHO DE REPUESTO"
                        },
                        {
                            nombreservicio: "VIDRIOS ROTOS SUSTITUCION COBERTURA HASTA 80$"
                        }
                    ]
                },
                {
                    codigotiposervicio: 69,
                    nombretiposervicio: "ASISTENCIA VEHICULOS",
                    servicios: [
                        {
                            nombreservicio: "MECÁNICA LIGERA"
                        },
                        {
                            nombreservicio: "TALLER"
                        }
                    ]
                },
                {
                    codigotiposervicio: 70,
                    nombretiposervicio: "GRUAS",
                    servicios: [
                        {
                            nombreservicio: "ARYSVIAL COBERTURA HASTA 70$"
                        }
                    ]
                },
                {
                    codigotiposervicio: 68,
                    nombretiposervicio: "ASISTENCIA PERSONAS",
                    servicios: [
                        {
                            nombreservicio: "RCV"
                        }
                    ]
                }
            ]
        },
        {
            codigoplan: 3,
            nombreplan: "PLAN TOTAL",
            costomensualusd: 3,
            costoanualusd: 36,
            detalle: [
                {
                    codigotiposervicio: 71,
                    nombretiposervicio: "JURÍDICO",
                    servicios: [
                        {
                            nombreservicio: "ASESORÍA Y ASISTENCIA LEGAL TELEFÓNICA"
                        }
                    ]
                },
                {
                    codigotiposervicio: 72,
                    nombretiposervicio: "MANTENIMIENTO",
                    servicios: [
                        {
                            nombreservicio: "MANTENIMIENTO CORRECTIVO"
                        },
                        {
                            nombreservicio: "MANTENIMIENTO PREVENTIVO"
                        }
                    ]
                },
                {
                    codigotiposervicio: 75,
                    nombretiposervicio: "SERVICIOS",
                    servicios: [
                        {
                            nombreservicio: "CENTRO DE ATENCIÓN 24/7 (CALL CENTER)"
                        },
                        {
                            nombreservicio: "RED DE PROVEEDORES CERTIFICADOS"
                        },
                        {
                            nombreservicio: "ACOMPAÑAMIENTO"
                        },
                        {
                            nombreservicio: "APOYO ESTADISTICO"
                        },
                        {
                            nombreservicio: "ASISTENCIA VIAL TELEFÓNICA EN CASO DE SINIESTRO"
                        },
                        {
                            nombreservicio: "BÚSQUEDA O UBICACIÓN DE REPUESTOS"
                        },
                        {
                            nombreservicio: "CRISTALERÍA Y VIDRIOS"
                        },
                        {
                            nombreservicio: "EXPEDIENTES ELECTRÓNICOS"
                        },
                        {
                            nombreservicio: "MANEJO Y ADMINISTRACIÓN DE SINIESTROS"
                        },
                        {
                            nombreservicio: "TALLER DE REPARACIÓN MECÁNICA LATONERIA Y PINTURA"
                        }
                    ]
                },
                {
                    codigotiposervicio: 73,
                    nombretiposervicio: "MECÁNICA",
                    servicios: [
                        {
                            nombreservicio: "MECÁNICA A DOMICILIO"
                        },
                        {
                            nombreservicio: "CAMBIO CAUCHO DE REPUESTO"
                        },
                        {
                            nombreservicio: "VIDRIOS ROTOS SUSTITUCION COBERTURA HASTA 80$"
                        }
                    ]
                },
                {
                    codigotiposervicio: 69,
                    nombretiposervicio: "ASISTENCIA VEHICULOS",
                    servicios: [
                        {
                            nombreservicio: "MECÁNICA LIGERA"
                        },
                        {
                            nombreservicio: "TALLER"
                        }
                    ]
                },
                {
                    codigotiposervicio: 70,
                    nombretiposervicio: "GRUAS",
                    servicios: [
                        {
                            nombreservicio: "ARYSVIAL COBERTURA HASTA 70$"
                        }
                    ]
                },
                {
                    codigotiposervicio: 68,
                    nombretiposervicio: "ASISTENCIA PERSONAS",
                    servicios: [
                        {
                            nombreservicio: "RCV"
                        }
                    ]
                },
                {
                    codigotiposervicio: 76,
                    nombretiposervicio: "SINIESTROS",
                    servicios: [
                        {
                            nombreservicio: "PARABRISAS Y VIDRIOS"
                        },
                        {
                            nombreservicio: "VIDRIOS ROTOS SUSTITUCION COBERTURA HASTA 80$"
                        }
                    ]
                }
            ]
        }
    ]

    return {
        status: true,
        code: 200,
        productos: planes
    }
    /*let getPlanData = await db.getPlanDataQuery(planData).then((res) => res);
    if(getPlanData.error){ return { status: false, code: 500, message: getPlanData.error }; }
    if(getPlanData.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Plan not found.' }; }
    let paymentMethodologies = [];
    let getPlanPaymentMethodologiesData = await db.getPlanPaymentMethodologiesDataQuery(planData.cplan).then((res) => res);
    if(getPlanPaymentMethodologiesData.error){ return { status: false, code: 500, message: getPlanPaymentMethodologiesData.error }; }
    if(getPlanPaymentMethodologiesData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanPaymentMethodologiesData.result.recordset.length; i++){
            let paymentMethodology = {
                cmetodologiapago: getPlanPaymentMethodologiesData.result.recordset[i].CMETODOLOGIAPAGO,
                xmetodologiapago: getPlanPaymentMethodologiesData.result.recordset[i].XMETODOLOGIAPAGO,
                mmetodologiapago: getPlanPaymentMethodologiesData.result.recordset[i].MMETODOLOGIAPAGO
            }
            paymentMethodologies.push(paymentMethodology);
        }
    }
    let insurers = [];
    let getPlanInsurersData = await db.getPlanInsurersDataQuery(planData.cplan).then((res) => res);
    if(getPlanInsurersData.error){ return { status: false, code: 500, message: getPlanInsurersData.error }; }
    if(getPlanInsurersData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanInsurersData.result.recordset.length; i++){
            let insurer = {
                caseguradora: getPlanInsurersData.result.recordset[i].CASEGURADORA,
                xaseguradora: getPlanInsurersData.result.recordset[i].XASEGURADORA
            }
            insurers.push(insurer);
        }
    }
    let services = [];
    let getPlanServicesData = await db.getPlanServicesDataQuery(planData.cplan).then((res) => res);
    if(getPlanServicesData.error){ return { status: false, code: 500, message: getPlanServicesData.error }; }
    if(getPlanServicesData.result.rowsAffected > 0){
        for(let i = 0; i < getPlanServicesData.result.recordset.length; i++){
            let coverages = [];
            let getCoveragesServiceData = await db.getCoveragesServiceDataQuery(getPlanServicesData.result.recordset[i].CSERVICIOPLAN).then((res) => res);
            if(getCoveragesServiceData.error){ return { status: false, code: 500, message: getCoveragesServiceData.error }; }
            if(getCoveragesServiceData.result.rowsAffected > 0){
                for(let i = 0; i < getCoveragesServiceData.result.recordset.length; i++){
                    let coverage = {
                        ccobertura: getCoveragesServiceData.result.recordset[i].CCOBERTURA,
                        xcobertura: getCoveragesServiceData.result.recordset[i].XCOBERTURA,
                        cconceptocobertura: getCoveragesServiceData.result.recordset[i].CCONCEPTOCOBERTURA,
                        xconceptocobertura: getCoveragesServiceData.result.recordset[i].XCONCEPTOCOBERTURA
                    }
                    coverages.push(coverage);
                }
            }
            let service = {
                cservicio: getPlanServicesData.result.recordset[i].CSERVICIO,
                cservicioplan: getPlanServicesData.result.recordset[i].CSERVICIOPLAN,
                xservicio: getPlanServicesData.result.recordset[i].XSERVICIO,
                ctiposervicio: getPlanServicesData.result.recordset[i].CTIPOSERVICIO,
                xtiposervicio: getPlanServicesData.result.recordset[i].XTIPOSERVICIO,
                ctipoagotamientoservicio: getPlanServicesData.result.recordset[i].CTIPOAGOTAMIENTOSERVICIO,
                ncantidad: getPlanServicesData.result.recordset[i].NCANTIDAD,
                pservicio: getPlanServicesData.result.recordset[i].PSERVICIO,
                mmaximocobertura: getPlanServicesData.result.recordset[i].MMAXIMOCOBERTURA,
                mdeducible: getPlanServicesData.result.recordset[i].MDEDUCIBLE,
                bserviciopadre: getPlanServicesData.result.recordset[i].BSERVICIOPADRE,
                coverages: coverages
            }
            services.push(service);
        }
    }
    let servicesInsurers = [];
    let getPlanServicesInsurersData = await db.getPlanServicesDataQuery(planData.cplan).then((res) => res);
    if(getPlanServicesInsurersData.error){ return { status: false, code: 500, message: getPlanServicesInsurersData.error }; }
    if(getPlanServicesInsurersData.result.rowsAffected > 0){

    }

    return { 
        status: true,
        cplan: getPlanData.result.recordset[0].CPLAN,
        xplan: getPlanData.result.recordset[0].XPLAN,
        mcosto: getPlanData.result.recordset[0].MCOSTO,
        ctipoplan: getPlanData.result.recordset[0].CTIPOPLAN,
        bactivo: getPlanData.result.recordset[0].BACTIVO,
        paymentMethodologies: paymentMethodologies,
        insurers: insurers,
        services: services
    }*/
}

router.route('/production/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('production', 'plan', req.body, 'updateProductsProductionPlanSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BEDITAR').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-have-permissions', expired: false });
            return;
        }
        operationUpdatePlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdatePlan' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyProductionModulePermission' } });
    });
});

const operationUpdatePlan = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let planData = {
        cplan: requestBody.cplan,
        xplan: requestBody.xplan.toUpperCase(),
        bactivo: requestBody.bactivo,       
        parys: requestBody.parys,
        paseguradora: requestBody.paseguradora,
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoplan: requestBody.ctipoplan,
        cusuariomodificacion: requestBody.cusuariomodificacion
    }
    let verifyPlanName = await db.verifyPlanNameToUpdateQuery(planData).then((res) => res);
    if(verifyPlanName.error){ return { status: false, code: 500, message: verifyPlanName.error }; }
    if(verifyPlanName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'plan-name-already-exist' }; }
    let updatePlan = await db.updatePlanQuery(planData).then((res) => res);
    if(updatePlan.error){ return { status: false, code: 500, message: updatePlan.error }; }
    if(updatePlan.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Plan not found.' }; }
    if(requestBody.paymentMethodologies){
        if(requestBody.paymentMethodologies.delete && requestBody.paymentMethodologies.delete.length > 0){
            let deletePaymentMethodologiesByPlanUpdate = await db.deletePaymentMethodologiesByPlanUpdateQuery(requestBody.paymentMethodologies.delete, planData).then((res) => res);
            if(deletePaymentMethodologiesByPlanUpdate.error){ return { status: false, code: 500, message: deletePaymentMethodologiesByPlanUpdate.error }; }
            if(deletePaymentMethodologiesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deletePaymentMethodologiesByPlanUpdate' }; }
        }
        if(requestBody.paymentMethodologies.update && requestBody.paymentMethodologies.update.length > 0){
            let updatePaymentMethodologiesByPlanUpdate = await db.updatePaymentMethodologiesByPlanUpdateQuery(requestBody.paymentMethodologies.update, planData).then((res) => res);
            if(updatePaymentMethodologiesByPlanUpdate.error){ return { status: false, code: 500, message: updatePaymentMethodologiesByPlanUpdate.error }; }
            if(updatePaymentMethodologiesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Payment Methodology not found.' }; }
        }
        if(requestBody.paymentMethodologies.create && requestBody.paymentMethodologies.create.length > 0){
            let createPaymentMethodologiesByPlanUpdate = await db.createPaymentMethodologiesByPlanUpdateQuery(requestBody.paymentMethodologies.create, planData).then((res) => res);
            if(createPaymentMethodologiesByPlanUpdate.error){ return { status: false, code: 500, message: createPaymentMethodologiesByPlanUpdate.error }; }
            if(createPaymentMethodologiesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createPaymentMethodologiesByPlanUpdate' }; }
        }
    }
    if(requestBody.insurers){
        if(requestBody.insurers.delete && requestBody.insurers.delete.length > 0){
            let deleteInsurersByPlanUpdate = await db.deleteInsurersByPlanUpdateQuery(requestBody.insurers.delete, planData).then((res) => res);
            if(deleteInsurersByPlanUpdate.error){ return { status: false, code: 500, message: deleteInsurersByPlanUpdate.error }; }
            if(deleteInsurersByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteInsurersByPlanUpdate' }; }
        }
        if(requestBody.insurers.update && requestBody.insurers.update.length > 0){
            let updateInsurersByPlanUpdate = await db.updateInsurersByPlanUpdateQuery(requestBody.insurers.update, planData).then((res) => res);
            if(updateInsurersByPlanUpdate.error){ return { status: false, code: 500, message: updateInsurersByPlanUpdate.error }; }
            if(updateInsurersByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Insurer not found.' }; }
        }
        if(requestBody.insurers.create && requestBody.insurers.create.length > 0){
            let createInsurersByPlanUpdate = await db.createInsurersByPlanUpdateQuery(requestBody.insurers.create, planData).then((res) => res);
            if(createInsurersByPlanUpdate.error){ return { status: false, code: 500, message: createInsurersByPlanUpdate.error }; }
            if(createInsurersByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createInsurersByPlanUpdate' }; }
        }
    }
    if(requestBody.services){
        if(requestBody.services.delete && requestBody.services.delete.length > 0){
            let deleteServicesByPlanUpdate = await db.deleteServicesByPlanUpdateQuery(requestBody.services.delete, planData).then((res) => res);
            if(deleteServicesByPlanUpdate.error){ return { status: false, code: 500, message: deleteServicesByPlanUpdate.error }; }
            if(deleteServicesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteServicesByPlanUpdate' }; }
        }
        if(requestBody.services.update && requestBody.services.update.length > 0){
            let updateServicesByPlanUpdate = await db.updateServicesByPlanUpdateQuery(requestBody.services.update, planData).then((res) => res);
            if(updateServicesByPlanUpdate.error){ return { status: false, code: 500, message: updateServicesByPlanUpdate.error }; }
            if(updateServicesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Service not found.' }; }
        }
        if(requestBody.services.create && requestBody.services.create.length > 0){
            let createServicesByPlanUpdate = await db.createServicesByPlanUpdateQuery(requestBody.services.create, planData).then((res) => res);
            if(createServicesByPlanUpdate.error){ return { status: false, code: 500, message: createServicesByPlanUpdate.error }; }
            if(createServicesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServicesByPlanUpdate' }; }
        }
    }
    if(requestBody.servicesInsurers){
        /*(requestBody.services.delete && requestBody.services.delete.length > 0){
            let deleteServicesByPlanUpdate = await db.deleteServicesByPlanUpdateQuery(requestBody.services.delete, planData).then((res) => res);
            if(deleteServicesByPlanUpdate.error){ return { status: false, code: 500, message: deleteServicesByPlanUpdate.error }; }
            if(deleteServicesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'deleteServicesByPlanUpdate' }; }
        }
        if(requestBody.services.update && requestBody.services.update.length > 0){
            let updateServicesByPlanUpdate = await db.updateServicesByPlanUpdateQuery(requestBody.services.update, planData).then((res) => res);
            if(updateServicesByPlanUpdate.error){ return { status: false, code: 500, message: updateServicesByPlanUpdate.error }; }
            if(updateServicesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Service not found.' }; }
        }*/
        if(requestBody.services.create && requestBody.services.create.length > 0){
            let createServicesByPlanUpdate = await db.createServicesInsurersByPlanUpdateQuery(requestBody.services.create, planData).then((res) => res);
            if(createServicesByPlanUpdate.error){ return { status: false, code: 500, message: createServicesByPlanUpdate.error }; }
            if(createServicesByPlanUpdate.result.rowsAffected < 0){ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServicesByPlanUpdate' }; }
        }
    }
    return { status: true, cplan: planData.cplan };
}

module.exports = router;