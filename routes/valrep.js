const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const db = require('../data/db');
const { createPermissionsByRoleUpdateQuery, getFleetContractOwnerVehicleDataQuery } = require('../src/bd');

router.route('/country').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCountry(req.header('Authorization')).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCountry' } });
        });
    }
});

const operationValrepCountry = async(authHeader) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.countryValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cpais: query.result.recordset[i].CPAIS, xpais: query.result.recordset[i].XPAIS, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/company').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCompany(req.header('Authorization')).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCompany' } });
        });
    }
});

const operationValrepCompany = async(authHeader) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.companyValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccompania: query.result.recordset[i].CCOMPANIA, xcompania: query.result.recordset[i].XCOMPANIA, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/department').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepDepartment(req.header('Authorization')).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepDepartment' } });
        });
    }
});

const operationValrepDepartment = async(authHeader) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.departmentValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cdepartamento: query.result.recordset[i].CDEPARTAMENTO, xdepartamento: query.result.recordset[i].XDEPARTAMENTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/role').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepRole(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepRole' } });
        });
    }
});

const operationValrepRole = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cdepartamento'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cdepartamento = requestBody.cdepartamento;
    let query = await bd.roleValrepQuery(cdepartamento).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ crol: query.result.recordset[i].CROL, xrol: query.result.recordset[i].XROL, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/group').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepGroup(req.header('Authorization')).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepGroup' } });
        });
    }
});

const operationValrepGroup = async(authHeader) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.groupValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cgrupo: query.result.recordset[i].CGRUPO, xgrupo: query.result.recordset[i].XGRUPO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/module').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepModule(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepModule' } });
        });
    }
});

const operationValrepModule = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cgrupo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cgrupo = requestBody.cgrupo;
    let query = await bd.moduleValrepQuery(cgrupo).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cmodulo: query.result.recordset[i].CMODULO, xmodulo: query.result.recordset[i].XMODULO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/state').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepState(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepState' } });
        });
    }
});

const operationValrepState = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cpais = requestBody.cpais;

    let query = await bd.stateValrepQuery(cpais).then((res) => res);

    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestado: query.result.recordset[i].CESTADO, xestado: query.result.recordset[i].XESTADO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/city').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCity' } });
        });
    }
});

const operationValrepCity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        cestado: requestBody.cestado
    };
    let query = await bd.cityValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cciudad: query.result.recordset[i].CCIUDAD, xciudad: query.result.recordset[i].XCIUDAD, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/service-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepServiceType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepServiceType' } });
        });
    }
});

const operationValrepServiceType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.serviceTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctiposervicio: query.result.recordset[i].CTIPOSERVICIO, xtiposervicio: query.result.recordset[i].XTIPOSERVICIO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/brand').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepBrand(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepBrand' } });
        });
    }
});

const operationValrepBrand = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.brandValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cmarca: query.result.recordset[i].CMARCA, xmarca: query.result.recordset[i].XMARCA, bactivo: query.result.recordset[i].BACTIVO, control: i });
    }
    return { status: true, list: jsonArray }
}

router.route('/model').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepModel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepModel' } });
        });
    }
});

const operationValrepModel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais', 'cmarca'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca
    };
    let query = await bd.modelValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cmodelo: query.result.recordset[i].CMODELO, xmodelo: query.result.recordset[i].XMODELO, bactivo: query.result.recordset[i].BACTIVO, control: i });
    }
    return { status: true, list: jsonArray }
}

router.route('/transmission-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTransmissionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTransmissionType' } });
        });
    }
});

const operationValrepTransmissionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.transmissionTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipotransmision: query.result.recordset[i].CTIPOTRANSMISION, xtipotransmision: query.result.recordset[i].XTIPOTRANSMISION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/vehicle-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepVehicleType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepVehicleType' } });
        });
    }
});

const operationValrepVehicleType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.vehicleTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipovehiculo: query.result.recordset[i].CTIPOVEHICULO, xtipovehiculo: query.result.recordset[i].XTIPOVEHICULO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/vehicle/data').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepVehicleData(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepVehicleData' } });
        });
    }
});

const operationValrepVehicleData = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.vehicleDataValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
             ctipovehiculo: query.result.recordset[i].CTIPOVEHICULO,
             xtipovehiculo: query.result.recordset[i].XTIPOVEHICULO,
             bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/clase/data').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClaseData(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClaseData' } });
        });
    }
});

const operationValrepClaseData = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.ClaseDataValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
            cclase: query.result.recordset[i].CCLASE,
            xclase: query.result.recordset[i].XCLASE,
            bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/replacement-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepReplacementType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepReplacementType' } });
        });
    }
});

const operationValrepReplacementType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.replacementTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctiporepuesto: query.result.recordset[i].CTIPOREPUESTO, xtiporepuesto: query.result.recordset[i].XTIPOREPUESTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/cancellation-cause').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCancellationCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCancellationCause' } });
        });
    }
});

const operationValrepCancellationCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.cancellationCauseValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccausaanulacion: query.result.recordset[i].CCAUSAANULACION, xcausaanulacion: query.result.recordset[i].XCAUSAANULACION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/cancellation-cause/service-order').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCancellationCauseServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCancellationCauseServiceOrder' } });
        });
    }
});

const operationValrepCancellationCauseServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.cancellationCauseServiceOrderValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccausaanulacion: query.result.recordset[i].CCAUSAANULACION, xcausaanulacion: query.result.recordset[i].XCAUSAANULACION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}


router.route('/general-status/service-order').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepGeneralStatusServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepGeneralStatusServiceOrder' } });
        });
    }
});

const operationValrepGeneralStatusServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.generalStatusServiceOrderValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestatusgeneral: query.result.recordset[i].CESTATUSGENERAL, xestatusgeneral: query.result.recordset[i].XESTATUSGENERAL, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/general-status').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepGeneralStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepGeneralStatus' } });
        });
    }
});

const operationValrepGeneralStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.generalStatusValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestatusgeneral: query.result.recordset[i].CESTATUSGENERAL, xestatusgeneral: query.result.recordset[i].XESTATUSGENERAL, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/document').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepDocument(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepDocument' } });
        });
    }
});

const operationValrepDocument = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.documentValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cdocumento: query.result.recordset[i].CDOCUMENTO, xdocumento: query.result.recordset[i].XDOCUMENTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/payment-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepPaymentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepPaymentType' } });
        });
    }
});

const operationValrepPaymentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.paymentTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipopago: query.result.recordset[i].CTIPOPAGO, xtipopago: query.result.recordset[i].XTIPOPAGO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/document-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepDocumentType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepDocumentType' } });
        });
    }
});

const operationValrepDocumentType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    /*if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };*/
    let query = await bd.documentTypeValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipodocidentidad: query.result.recordset[i].CTIPODOCIDENTIDAD, xtipodocidentidad: query.result.recordset[i].XTIPODOCIDENTIDAD, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/associate-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepAssociateType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepAssociateType' } });
        });
    }
});

const operationValrepAssociateType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.associateTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipoasociado: query.result.recordset[i].CTIPOASOCIADO, xtipoasociado: query.result.recordset[i].XTIPOASOCIADO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/business-activity').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepBusinessActivity(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepBusinessActivity' } });
        });
    }
});

const operationValrepBusinessActivity = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cpais = requestBody.cpais;
    let query = await bd.businessActivityValrepQuery(cpais).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cactividadempresa: query.result.recordset[i].CACTIVIDADEMPRESA, xactividadempresa: query.result.recordset[i].XACTIVIDADEMPRESA, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/bank').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepBank' } });
        });
    }
});

const operationValrepBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cpais = requestBody.cpais;
    let query = await bd.bankValrepQuery(cpais).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cbanco: query.result.recordset[i].CBANCO, xbanco: query.result.recordset[i].XBANCO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/destinationBank').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepDestinationBank(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepDestinationBank' } });
        });
    }
});

const operationValrepDestinationBank = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.destinationBankValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cbanco_destino: query.result.recordset[i].CBANCO_DESTINO, xbanco_destino: query.result.recordset[i].XBANCO});
    }
    return { status: true, list: jsonArray }
}

router.route('/bank-account-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepBankAccountType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepBankAccountType' } });
        });
    }
});

const operationValrepBankAccountType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cpais = requestBody.cpais;
    let query = await bd.bankAccountTypeValrepQuery(cpais).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipocuentabancaria: query.result.recordset[i].CTIPOCUENTABANCARIA, xtipocuentabancaria: query.result.recordset[i].XTIPOCUENTABANCARIA, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/plate').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepPlate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepPlate' } });
        });
    }
});

const operationValrepPlate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    } 
    let query = await bd.plateValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ crecibo: query.result.recordset[i].CRECIBO, xplaca: query.result.recordset[i].XPLACA, xnombrepropietario: query.result.recordset[i].XNOMBREPROPIETARIO });
    }
    return { status: true, list: jsonArray }
}

router.route('/service').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepService' } });
        });
    }
});

const operationValrepService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiposervicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiposervicio: requestBody.ctiposervicio
    };
    let query = await bd.serviceValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/aditional-service').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepAditionalService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepService' } });
        });
    }
});

const operationValrepAditionalService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['ccontratoflota'])){ /*return { status: false, code: 400, message: 'Required params not found.' };*/ }
    let searchData = {
        ccarga: requestBody.ccarga,
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais
   }
    let serviciosContratados = await bd.serviceValrepQuery(searchData).then((res) => res);
    if(serviciosContratados.error){ return { status: false, code: 500, message: serviciosContratados.error }; }

    let services = [];

    for(let i = 0; i < serviciosContratados.result.recordset.length; i++){
        services.push({ cservicio: serviciosContratados.result.recordset[i].cservicio, xservicio: serviciosContratados.result.recordset[i].XSERVICIO, ccarga: serviciosContratados.result.recordset[i].ccarga});
    }

    // Se obtienen todos los servicios que esten en la base de datos
    let query = await bd.getAditionalServices(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }

    let jsonArray = [];

    // En este for solo se guardaran en jsonArray los servicios que no tengan el mismo codigo que los servicios de la lista de servicios contratados
    for(let i = 0; i < query.result.recordset.length; i++){
        
        let flag = true;

        for(let j = 0; j < services.length; j++){
            if(services[j].cservicio == query.result.recordset[i].CSERVICIO) {
                flag = false;
                break;
            }

        }

        if (flag == true) {
            jsonArray.push({ cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO });
        }

    }
    return { status: true, list: jsonArray }
}
router.route('/aditional-service-quote').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepAditionalServiceQuote(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepAditionalServiceQuote' } });
        });
    }
});

const operationValrepAditionalServiceQuote = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['ccontratoflota'])){ /*return { status: false, code: 400, message: 'Required params not found.' };*/ }
    let searchData = {
         ccarga: requestBody.ccarga,
         ccompania: requestBody.ccompania,
         cpais: requestBody.cpais
    }
    let serviciosContratados = await bd.serviceValrepQuery(searchData).then((res) => res);
    if(serviciosContratados.error){ return { status: false, code: 500, message: serviciosContratados.error }; }

    let services = [];

    for(let i = 0; i < serviciosContratados.result.recordset.length; i++){
        services.push({ cservicio: serviciosContratados.result.recordset[i].cservicio, xservicio: serviciosContratados.result.recordset[i].XSERVICIO, ccontratoflota: serviciosContratados.result.recordset[i].ccontratoflota , ccarga: serviciosContratados.result.recordset[i].ccarga});
    }

    // Se obtienen todos los servicios que esten en la base de datos
    let query = await bd.getAditionalServicesQuotes(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }

    let jsonArray = [];

    // En este for solo se guardaran en jsonArray los servicios que no tengan el mismo codigo que los servicios de la lista de servicios contratados
    for(let i = 0; i < query.result.recordset.length; i++){

        let flag = true;

        for(let j = 0; j < services.length; j++){
            if(services[j].cservicio == query.result.recordset[i].CSERVICIO) {
                flag = false;
                break;
            }

        }

        if (flag == true) {
            jsonArray.push({ cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO });
        }

    }
    return { status: true, list: jsonArray }
}


router.route('/service-providers').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepServiceProviders(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepService' } });
        });
    }
});

const operationValrepServiceProviders = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cservicio: requestBody.cservicio,
        cestado: requestBody.cestado
    }
    let query = await bd.serviceProvidersValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ xservicio: query.result.recordset[i].XSERVICIO, cproveedor: query.result.recordset[i].CPROVEEDOR , xproveedor: query.result.recordset[i].XNOMBRE });
    }
    return { status: true, list: jsonArray }
}

router.route('/notification-services').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationServices(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepService' } });
        });
    }
});

const operationValrepNotificationServices = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cnotificacion = requestBody.cnotificacion;
    let query = await bd.getNotificationServices(cnotificacion).then((res) => res);
    //if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cservicio: query.result.recordset[i].cservicio, xservicio: query.result.recordset[i].XSERVICIO, ccontratoflota: query.result.recordset[i].ccontratoflota , ccarga: query.result.recordset[i].ccarga});
    }
    return { status: true, list: jsonArray }
}

router.route('/notification-aditional-services').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationAditionalServices(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepService' } });
        });
    }
});

const operationValrepNotificationAditionalServices = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ /*return { status: false, code: 400, message: 'Required params not found.' };*/ }
    let cnotificacion = requestBody.cnotificacion;
    let serviciosContratados = await bd.getNotificationServices(cnotificacion).then((res) => res);
    if(serviciosContratados.error){ return { status: false, code: 500, message: serviciosContratados.error }; }

    let services = [];

    for(let i = 0; i < serviciosContratados.result.recordset.length; i++){
        services.push({ cservicio: serviciosContratados.result.recordset[i].cservicio, xservicio: serviciosContratados.result.recordset[i].XSERVICIO, ccontratoflota: serviciosContratados.result.recordset[i].ccontratoflota , ccarga: serviciosContratados.result.recordset[i].ccarga });
    }

    // Se obtienen todos los servicios que esten en la base de datos
    let query = await bd.getAditionalServices().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }

    let jsonArray = [];

    // En este for solo se guardaran en jsonArray los servicios que no tengan el mismo codigo que los servicios de la lista de servicios contratados
    for(let i = 0; i < query.result.recordset.length; i++){

        let flag = true;

        for(let j = 0; j < services.length; j++){
            if(services[j].cservicio == query.result.recordset[i].CSERVICIO) {
                flag = false;
                break;
            }

        }

        if (flag == true) {
            jsonArray.push({ cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO });
        }

    }
    return { status: true, list: jsonArray }
}

router.route('/service-order-providers').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepServiceOrderProviders(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepService' } });
        });
    }
});

const operationValrepServiceOrderProviders = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cservicio: requestBody.cservicio,
        cestado: requestBody.cestado
    }
    let query = await bd.getServiceOrderProviders(searchData).then((res) => res);
    //if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cproveedor: query.result.recordset[i].CPROVEEDOR, xproveedor: query.result.recordset[i].XNOMBRE, xservicio: query.result.recordset[i].XSERVICIO , xestado: query.result.recordset[i].XESTADO});
    }
    return { status: true, list: jsonArray }
}

router.route('/service-order').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepServiceOrder' } });
        });
    }
});

const operationValrepServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['corden'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let query = await bd.serviceOrderValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ xdanos: query.result.recordset[i].XDANOS, xcliente: query.result.recordset[i].XCLIENTE, corden: query.result.recordset[i].CORDEN});
    }
    return { status: true, list: jsonArray }
}


router.route('/notification').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotification(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotification' } });
        });
    }
});

const operationValrepNotification = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let query = await bd.notificationValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cnotificacion: query.result.recordset[i].CNOTIFICACION, ccontratoflota: query.result.recordset[i].CCONTRATOFLOTA, xnombre: query.result.recordset[i].XNOMBRE, xapellido: query.result.recordset[i].XAPELLIDO, xnombrealternativo: query.result.recordset[i].XNOMBREALTERNATIVO, xapellidoalternativo: query.result.recordset[i].XAPELLIDOALTERNATIVO, fcreacion: query.result.recordset[i].FCREACION, xdescripcionaccidente: query.result.recordset[i].XDESCRIPCION, xnombrepropietario: query.result.recordset[i].XNOMBREPROPIETARIO, xapellidopropietario: query.result.recordset[i].XAPELLIDOPROPIETARIO, xdocidentidadpropietario: query.result.recordset[i].XDOCIDENTIDAD, xtelefonocelularpropietario: query.result.recordset[i].XTELEFONOCELULAR, xplaca: query.result.recordset[i].XPLACA, xmarca: query.result.recordset[i].XMARCA, xmodelo: query.result.recordset[i].XMODELO, xcolor: query.result.recordset[i].XCOLOR });
    }
    return { status: true, list: jsonArray }
}

router.route('/enterprise').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepEnterprise(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepEnterprise' } });
        });
    }
});

const operationValrepEnterprise = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.enterpriseValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cempresa: query.result.recordset[i].CEMPRESA, xnombre: helper.decrypt(query.result.recordset[i].XNOMBRE), bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/associate').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepAssociate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepAssociate' } });
        });
    }
});

const operationValrepAssociate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.associateValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ casociado: query.result.recordset[i].CASOCIADO, xasociado: helper.decrypt(query.result.recordset[i].XASOCIADO), bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/broker').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepBroker(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepBroker' } });
        });
    }
});

const operationValrepBroker = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.brokerValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccorredor: query.result.recordset[i].CCORREDOR, xcorredor: `${helper.decrypt(query.result.recordset[i].XCORREDOR)} `, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/depreciation').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepDepreciation(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepDepreciation' } });
        });
    }
});

const operationValrepDepreciation = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.depreciationValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cdepreciacion: query.result.recordset[i].CDEPRECIACION, xdepreciacion: query.result.recordset[i].XDEPRECIACION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/relationship').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepRelationship(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepRelationship' } });
        });
    }
});

const operationValrepRelationship = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.relationshipValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cparentesco: query.result.recordset[i].CPARENTESCO, xparentesco: query.result.recordset[i].XPARENTESCO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/penalty').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepPenalty(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepPenalty' } });
        });
    }
});

const operationValrepPenalty = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.penaltyValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cpenalizacion: query.result.recordset[i].CPENALIZACION, xpenalizacion: query.result.recordset[i].XPENALIZACION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/provider').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepProvider' } });
        });
    }
});

const operationValrepProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cproveedor'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    //let cproveedor = requestBody.cproveedor;
    let query = await bd.providerValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cproveedor: query.result.recordset[0].CPROVEEDOR, xnombre: query.result.recordset[0].XNOMBRE });
    }
    return { status: true, list: jsonArray }
}

router.route('/civil-status').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCivilStatus(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCivilStatus' } });
        });
    }
});

const operationValrepCivilStatus = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.civilStatusValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestadocivil: query.result.recordset[i].CESTADOCIVIL, xestadocivil: query.result.recordset[i].XESTADOCIVIL, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/process/document').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepProcessDocument(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepProcessDocument' } });
        });
    }
});

const operationValrepProcessDocument = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cmodulo: requestBody.cmodulo
    };
    let query = await bd.processDocumentValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cdocumento: query.result.recordset[i].CDOCUMENTO, xdocumento: query.result.recordset[i].XDOCUMENTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/plan-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepPlanType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepPlanType' } });
        });
    }
});

const operationValrepPlanType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.planTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipoplan: query.result.recordset[i].CTIPOPLAN, xtipoplan: query.result.recordset[i].XTIPOPLAN, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/planrcv-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepPlanRcvType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepPlanRcvType' } });
        });
    }
});

const operationValrepPlanRcvType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.planRcvTypeValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cplan_rc: query.result.recordset[i].CPLAN_RC, xplan_rc: query.result.recordset[i].XPLAN_RC, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/client').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClient' } });
        });
    }
});

const operationValrepClient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.clientValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccliente: query.result.recordset[i].CCLIENTE, xcliente: query.result.recordset[i].XCLIENTE, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/parent-policy').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepParentPolicy(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClient' } });
        });
    }
});

const operationValrepParentPolicy = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.parentPolicyValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccarga: query.result.recordset[i].CCARGA, xdescripcion: query.result.recordset[i].XDESCRIPCION_L, xpoliza: query.result.recordset[i].XPOLIZA, fcreacion: new Date(query.result.recordset[i].FCREACION).toLocaleDateString() });
    }
    return { status: true, list: jsonArray }
}

router.route('/charge').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCharge(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCharge' } });
        });
    }
});

const operationValrepCharge = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.chargeValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];

    for(let i = 0; i < query.result.recordset.length; i++){
        let dateFormat = new Date(query.result.recordset[i].FINGRESO);
        let dd = dateFormat.getDate() + 1;
        let mm = dateFormat.getMonth() + 1;
        let yyyy = dateFormat.getFullYear();
        let fingreso = dd + '/' + mm + '/' + yyyy;
        jsonArray.push({ xcliente: query.result.recordset[i].XCLIENTE, ccliente: query.result.recordset[0].CCLIENTE, xpoliza: query.result.recordset[i].XPOLIZA, ccarga: query.result.recordset[i].CCARGA, fingreso: fingreso, xplaca: query.result.recordset[i].XPLACA });
    }
    return { status: true, list: jsonArray }
}

router.route('/batch').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepBatch(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepBatch' } });
        });
    }
});

const operationValrepBatch = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccarga'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        ccarga: requestBody.ccarga
    };
    let query = await bd.batchValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        dateToString = query.result.recordset[i].FCREACION.toISOString().substr(0,10).split("-");
        let fcreacion = dateToString[2] + '-' + dateToString[1] + '-' + dateToString[0];
        jsonArray.push({ xobservacion: query.result.recordset[i].XOBSERVACION, clote: query.result.recordset[i].CLOTE,  ccarga: query.result.recordset[i].CCARGA, fcreacion: fcreacion });
    }
    return { status: true, list: jsonArray }
}

router.route('/receipt').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepReceipt(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepReceipt' } });
        });
    }
});

const operationValrepReceipt = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['clote'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        clote: requestBody.clote,
        ccarga: requestBody.ccarga
    };
    let query = await bd.receiptValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        let dateFormatDesde = new Date(query.result.recordset[i].FDESDE_REC);
        let ddDesde = dateFormatDesde.getDate() + 1;
        let mmDesde = dateFormatDesde.getMonth() + 1;
        let yyyyDesde = dateFormatDesde.getFullYear();
        let fdesde_rec = ddDesde + '/' + mmDesde + '/' + yyyyDesde;

        let dateFormatHasta = new Date(query.result.recordset[i].FHASTA_REC);
        let ddHasta = dateFormatHasta.getDate() + 1;
        let mmHasta = dateFormatHasta.getMonth() + 1;
        let yyyyHasta = dateFormatHasta.getFullYear();
        let fhasta_rec = ddHasta + '/' + mmHasta + '/' + yyyyHasta;
        let xstatus = "";
        if(query.result.recordset[i].CESTATUSGENERAL == 3) {
            xstatus = "ANULADO";
        }
        if(query.result.recordset[i].CESTATUSGENERAL == 7){
            xstatus = "COBRADO";
        }
        if(query.result.recordset[i].CESTATUSGENERAL == 13){
            xstatus = "PENDIENTE"
        }
        jsonArray.push({ ccarga: query.result.recordset[i].CCARGA, xrecibo: query.result.recordset[i].XRECIBO, crecibo: query.result.recordset[i].CRECIBO, nconsecutivo: query.result.recordset[i].NCONSECUTIVO, fdesde_rec: fdesde_rec, fhasta_rec: fhasta_rec, ccontratoflota: query.result.recordset[i].CCONTRATOFLOTA, mprima_anual: query.result.recordset[i].MPRIMA_ANUAL, msuma_anual: query.result.recordset[i].MSUMA_ANUAL, xstatus: xstatus, xplaca: query.result.recordset[i].XPLACA  });
    }
    return { status: true, list: jsonArray }
}

// router.route('/client/associate-plan').post((req, res) => {
//     if(!req.header('Authorization')){ 
//         res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
//         return;
//     }else{
//         operationValrepClientAssociateByPlan(req.header('Authorization'), req.body).then((result) => {
//             if(!result.status){ 
//                 res.status(result.code).json({ data: result });
//                 return;
//             }
//             res.json({ data: result });
//         }).catch((err) => {
//             res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClientAssociateByPlan' } });
//         });
//     }
// });

// const operationValrepClientAssociateByPlan = async(authHeader, requestBody) => {
//     if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
//     if(!helper.validateRequestObj(requestBody, ['cplan'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
//     let searchData = {
//         cplan: requestBody.cplan
//     };
//     let query = await bd.clientAssociateByPlanValrepQuery(searchData).then((res) => res);
//     if(query.error){ return { status: false, code: 500, message: query.error }; }
//     let jsonArray = [];
//     for(let i = 0; i < query.result.recordset.length; i++){
//         jsonArray.push({ casociado: query.result.recordset[i].CASOCIADO, xasociado: helper.decrypt(query.result.recordset[i].XASOCIADO), bactivo: query.result.recordset[i].BACTIVO });
//     }
//     return { status: true, list: jsonArray }
// }

router.route('/service-depletion-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepServiceDepletionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepServiceDepletionType' } });
        });
    }
});

const operationValrepServiceDepletionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.serviceDepletionTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipoagotamientoservicio: query.result.recordset[i].CTIPOAGOTAMIENTOSERVICIO, xtipoagotamientoservicio: query.result.recordset[i].XTIPOAGOTAMIENTOSERVICIO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/client/associate').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClientAssociate(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClientAssociate' } });
        });
    }
});

const operationValrepClientAssociate = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccliente'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let ccliente = requestBody.ccliente;
    let query = await db.getClientAssociatesDataQuery(ccliente).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ casociado: query.result.recordset[i].CASOCIADO, xasociado: helper.decrypt(query.result.recordset[i].XASOCIADO) });
    }
    return { status: true, list: jsonArray }
}

router.route('/coverage').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCoverage' } });
        });
    }
});

const operationValrepCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.coverageValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccobertura: query.result.recordset[i].CCOBERTURA, xcobertura: query.result.recordset[i].XCOBERTURA, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/coverage-concept').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCoverageConcept(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCoverageConcept' } });
        });
    }
});

const operationValrepCoverageConcept = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.coverageConceptValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cconceptocobertura: query.result.recordset[i].CCONCEPTOCOBERTURA, xconceptocobertura: query.result.recordset[i].XCONCEPTOCOBERTURA, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/client/extra-coverage').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClientExtraCoverage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClientExtraCoverage' } });
        });
    }
});

const operationValrepClientExtraCoverage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccliente', 'casociado', 'cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ccliente: requestBody.ccliente,
        casociado: requestBody.casociado
    };
    let query = await bd.getClientExtraCoveragesValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccoberturaextra: query.result.recordset[i].CCOBERTURAEXTRA, xdescripcion: helper.decrypt(query.result.recordset[i].XDESCRIPCION) });
    }
    return { status: true, list: jsonArray }
}

router.route('/tax').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTax' } });
        });
    }
});

const operationValrepTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cpais = requestBody.cpais;
    let query = await bd.taxValrepQuery(cpais).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cimpuesto: query.result.recordset[i].CIMPUESTO, ximpuesto: query.result.recordset[i].XIMPUESTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

// router.route('/client/worker').post((req, res) => {
//     if(!req.header('Authorization')){ 
//         res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
//         return;
//     }else{
//         operationValrepClientWorker(req.header('Authorization'), req.body).then((result) => {
//             if(!result.status){ 
//                 res.status(result.code).json({ data: result });
//                 return;
//             }
//             res.json({ data: result });
//         }).catch((err) => {
//             res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClientWorker' } });
//         });
//     }
// });

// const operationValrepClientWorker = async(authHeader, requestBody) => {
//     if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
//     if(!helper.validateRequestObj(requestBody, ['ccliente'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
//     let ccliente = requestBody.ccliente;
//     let query = await bd.getClientWorkersDataQuery(ccliente).then((res) => res);
//     if(query.error){ return { status: false, code: 500, message: query.error }; }
//     let jsonArray = [];
//     for(let i = 0; i < query.result.recordset.length; i++){
//         jsonArray.push({ ctrabajador: query.result.recordset[i].CTRABAJADOR, xtrabajador: `${helper.decrypt(query.result.recordset[i].XNOMBRE)} ${helper.decrypt(query.result.recordset[i].XAPELLIDO)}` });
//     }
//     return { status: true, list: jsonArray }
// }

router.route('/color').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepColor(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepColor' } });
        });
    }
});

const operationValrepColor = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.colorValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccolor: query.result.recordset[i].CCOLOR, xcolor: query.result.recordset[i].XCOLOR, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/coin').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCoin(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCoin' } });
        });
    }
});

const operationValrepCoin = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.coinValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cmoneda: query.result.recordset[i].cmoneda, xmoneda: query.result.recordset[i].xmoneda});
    }
    return { status: true, list: jsonArray }
}

router.route('/utility').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepUtility(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepUtility' } });
        });
    }
});

const operationValrepUtility = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.utilityValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cuso: query.result.recordset[i].CUSO, xuso: query.result.recordset[i].XUSO});
    }
    return { status: true, list: jsonArray }
}

router.route('/modeltype').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepModelType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepModelType' } });
        });
    }
});

const operationValrepModelType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.modelTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipomodelo: query.result.recordset[i].CTIPOMODELO, xtipomodelo: query.result.recordset[i].XTIPOMODELO});
    }
    return { status: true, list: jsonArray }
}

router.route('/receipt-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepReceiptType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepReceiptType' } });
        });
    }
});

const operationValrepReceiptType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais
    };
    let query = await bd.receiptTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctiporecibo: query.result.recordset[i].CTIPORECIBO, xtiporecibo: query.result.recordset[i].XTIPORECIBO, ncantidaddias: query.result.recordset[i].NCANTIDADDIAS});
    }
    return { status: true, list: jsonArray }
}

router.route('/client/available-model').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClientAvilableModel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClientAvilableModel' } });
        });
    }
});

const operationValrepClientAvilableModel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccliente', 'cpais', 'cmarca'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca,
        ccliente: requestBody.ccliente,
    };
    let query = await bd.modelValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let queryClient = await bd.getClientModelsDataQuery(searchData.ccliente).then((res) => res);
    if(queryClient.error){ return { status: false, code: 500, message: queryClient.error }; }
    if(queryClient.result.rowsAffected > 0){
        for(let i = 0; i < queryClient.result.recordset.length; i++){
            query.result.recordset = query.result.recordset.filter((model) => { 
                return model.CMODELO != queryClient.result.recordset[i].CMODELO;
            });
        }
    }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
            cmodelo: query.result.recordset[i].CMODELO, 
            xmodelo: query.result.recordset[i].XMODELO, 
            bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/version').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepVersion(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepVersion' } });
        });
    }
});

const operationValrepVersion = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais', 'cmodelo','cmarca'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        cmarca: requestBody.cmarca ? requestBody.cmarca : undefined,
        cmodelo: requestBody.cmodelo ? requestBody.cmodelo : undefined,
    };
    let query = await bd.searchVersionQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cversion: query.result.recordset[i].CVERSION, 
            xversion: query.result.recordset[i].XVERSION + '-' + query.result.recordset[i].CANO, 
            bactivo: query.result.recordset[i].BACTIVO, cano: query.result.recordset[i].CANO, 
            control: i, 
            npasajero: query.result.recordset[i].NPASAJERO,
            xtransmision: query.result.recordset[i].XTRANSMISION  });
    }
    return { status: true, list: jsonArray }
}

router.route('/client/grouper').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClientGrouper(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClientGrouper' } });
        });
    }
});

const operationValrepClientGrouper = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['ccliente'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let ccliente = requestBody.ccliente;
    let query = await db.getClientGroupersDataQuery(ccliente).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cagrupador: query.result.recordset[i].CAGRUPADOR, xagrupador: helper.decrypt(query.result.recordset[i].XNOMBRE) });
    }
    return { status: true, list: jsonArray }
}

router.route('/accesory').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepAccesory(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepAccesory' } });
        });
    }
});

const operationValrepAccesory = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.accesoryValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ caccesorio: query.result.recordset[i].CACCESORIO, xaccesorio: query.result.recordset[i].XACCESORIO, mmontomax: query.result.recordset[i].MMONTOMAX, ptasa: query.result.recordset[i].PTASA});
    }
    return { status: true, list: jsonArray }
}

router.route('/proficient').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepProficient(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepProficient' } });
        });
    }
});

const operationValrepProficient = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.proficientValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cperito: query.result.recordset[i].CPERITO, xperito: helper.decrypt(query.result.recordset[i].XPERITO), bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/inspection-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepInspectionType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepInspectionType' } });
        });
    }
});

const operationValrepInspectionType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.inspectionTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipoinspeccion: query.result.recordset[i].CTIPOINSPECCION, xtipoinspeccion: query.result.recordset[i].XTIPOINSPECCION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/notification-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotificationType' } });
        });
    }
});

const operationValrepNotificationType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.notificationTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctiponotificacion: query.result.recordset[i].CTIPONOTIFICACION, xtiponotificacion: query.result.recordset[i].XTIPONOTIFICACION, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/claim-cause').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClaimCause(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClaimCause' } });
        });
    }
});

const operationValrepClaimCause = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.claimCauseValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccausasiniestro: query.result.recordset[i].CCAUSASINIESTRO, xcausasiniestro: query.result.recordset[i].XCAUSASINIESTRO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/material-damage').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepMaterialDamage(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepMaterialDamage' } });
        });
    }
});

const operationValrepMaterialDamage = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.materialDamageValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cdanomaterial: query.result.recordset[i].CDANOMATERIAL, xdanomaterial: query.result.recordset[i].XDANOMATERIAL, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/damage-level').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepDamageLevel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepDamageLevel' } });
        });
    }
});

const operationValrepDamageLevel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.damageLevelValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cniveldano: query.result.recordset[i].CNIVELDANO, xniveldano: query.result.recordset[i].XNIVELDANO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/replacement').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepReplacement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepReplacement' } });
        });
    }
});

const operationValrepReplacement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiporepuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiporepuesto: requestBody.ctiporepuesto
    };
    let query = await bd.replacementValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ crepuesto: query.result.recordset[i].CREPUESTO, xrepuesto: query.result.recordset[i].XREPUESTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/tracing-type').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTracingType(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTracingType' } });
        });
    }
});

const operationValrepTracingType = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.tracingTypeValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctiposeguimiento: query.result.recordset[i].CTIPOSEGUIMIENTO, xtiposeguimiento: query.result.recordset[i].XTIPOSEGUIMIENTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/tracing-motive').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTracingMotive(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTracingMotive' } });
        });
    }
});

const operationValrepTracingMotive = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.tracingMotiveValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cmotivoseguimiento: query.result.recordset[i].CMOTIVOSEGUIMIENTO, xmotivoseguimiento: query.result.recordset[i].XMOTIVOSEGUIMIENTO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/plan').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepPlan(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepPlan' } });
        });
    }
});

const operationValrepPlan = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctipoplan'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctipoplan: requestBody.ctipoplan
    };
    let query = await bd.planValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cplan: query.result.recordset[i].CPLAN, xplan: query.result.recordset[i].XPLAN, binternacional: query.result.recordset[i].BINTERNACIONAL, bactivo: query.result.recordset[i].BACTIVO, control: i });
    }
    return { status: true, list: jsonArray }
}

router.route('/insurer').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepInsurer(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepInsurer' } });
        });
    }
});

const operationValrepInsurer = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania
    };
    let query = await bd.insurerValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ caseguradora: query.result.recordset[i].CASEGURADORA, xaseguradora: helper.decrypt(query.result.recordset[i].XASEGURADORA), bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/module/general-status').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepGeneralStatusByModule(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepGeneralStatusByModule' } });
        });
    }
});

const operationValrepGeneralStatusByModule = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'cmodulo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        cmodulo: requestBody.cmodulo
    };
    let query = await bd.generalStatusByModuleValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestatusgeneral: query.result.recordset[i].CESTATUSGENERAL, xestatusgeneral: query.result.recordset[i].XESTATUSGENERAL });
    }
    return { status: true, list: jsonArray }
}

router.route('/clauses/search-clauses').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepClauses(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepClauses' } });
        });
    }
});

const operationValrepClauses = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cclausula: requestBody.cclausula,
        canexo: requestBody.canexo
    };
    let query = await bd.clausesByValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cclausula: query.result.recordset[i].CCLAUSULA, xclausulas: query.result.recordset[i].XCLAUSULAS });
    }
    return { status: true, list: jsonArray }
}

router.route('/settlement/replacement').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepReplacementFromSettlement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepReplacementFromSettlement' } });
        });
    }
});

const operationValrepReplacementFromSettlement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cnotificacion: requestBody.cnotificacion
    };
    let query = await bd.replacementByValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ crepuesto: query.result.recordset[i].CREPUESTO, xrepuesto: query.result.recordset[i].XREPUESTO });
    }
    return { status: true, list: jsonArray }
}

router.route('/settlement/service-order').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepServiceOrderFromSettlement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepServiceOrderFromSettlement' } });
        });
    }
});

const operationValrepServiceOrderFromSettlement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cnotificacion: requestBody.cnotificacion
    };
    let query = await bd.serviceOrderByValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ corden: query.result.recordset[i].CORDEN, cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO, xdanos: query.result.recordset[i].XDANOS, xservicioadicional: query.result.recordset[i].XSERVICIOADICIONAL });
    }
    return { status: true, list: jsonArray }
}

router.route('/collections/search-collections').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCollections(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCollections' } });
        });
    }
});

const operationValrepCollections = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        crecaudo: requestBody.crecaudo,
        ccompania: requestBody.ccompania
    };
    let query = await bd.collectionsByValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ crecaudo: query.result.recordset[i].CRECAUDO, xrecaudo: query.result.recordset[i].XRECAUDO });
    }
    return { status: true, list: jsonArray }
}

router.route('/type-vehicle-arysvial').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTypeVehicleArysVial(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTypeVehicleArysVial' } });
        });
    }
});

const operationValrepTypeVehicleArysVial = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais
    };
    let query = await bd.TypeVehicleArysVialByValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctipovehiculo: query.result.recordset[i].CTIPOVEHICULO, xtipovehiculo: query.result.recordset[i].XTIPOVEHICULO });
    }
    return { status: true, list: jsonArray }
}

router.route('/type-vehicle').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationTypeVehicle(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationTypeVehicle' } });
        });
    }
});

const operationTypeVehicle = async( requestBody) => {
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        
    };
    let query = await bd.vehicleQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({  xtipo: query.result.recordset[i].XTIPO });
    }
    return { status: true, list: jsonArray }
}
router.route('/over-limit/type-vehicle').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationOverLimitTypeVehicle(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationOverLimitTypeVehicle' } });
        });
    }
});

const operationOverLimitTypeVehicle = async( requestBody) => {
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        
    };
    let query = await bd.OverLimitvehicleQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
             xgrupo: query.result.recordset[i].XGRUPO,
             ctarifa_exceso: query.result.recordset[i].CTARIFA_EXCESO
             });
    }
    return { status: true, list: jsonArray }
}
router.route('/type-planRCV').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationTypePlanRCV(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationTypePlan' } });
        });
    }
});

const operationTypePlanRCV = async(authHeader,requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['xtipo'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
            xtipo:requestBody.xtipo
    };

    let query = await bd.planRcvTypeQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
             cplan: query.result.recordset[i].CPLAN, 
             cplan_rc: query.result.recordset[i].CPLAN_RC,
             xplan_rc: query.result.recordset[i].XPLAN_RC,
              });
    }

    return { status: true, list: jsonArray }
}

router.route('/metodologia-pago').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTypeMetodologia(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTypeVehicleArysVial' } });
        });
    }
});

const operationValrepTypeMetodologia = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais
    };

    let query = await bd.TypeMetodologia(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
            cmetodologiapago: query.result.recordset[i].CMETODOLOGIAPAGO,
            xmetodologiapago: query.result.recordset[i].XMETODOLOGIAPAGO });
    }

    return { status: true, list: jsonArray }
}

router.route('/metodologia-pago-contract').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTypeMetodologiaContract(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTypeMetodologiaContract' } });
        });
    }
});

const operationValrepTypeMetodologiaContract = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais,
        binternacional: requestBody.binternacional
    };

    let query = await bd.queryTypeMetodologiaContract(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
            cmetodologiapago: query.result.recordset[i].CMETODOLOGIAPAGO,
            xmetodologiapago: query.result.recordset[i].XMETODOLOGIAPAGO });
    }

    return { status: true, list: jsonArray }
}

router.route('/cause-settlement').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepCauseSettlement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCauseSettlement' } });
        });
    }
});

const operationValrepCauseSettlement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.causeSettlementValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ccausafiniquito: query.result.recordset[i].CCAUSAFINIQUITO, xcausafiniquito: query.result.recordset[i].XCAUSAFINIQUITO });
    }
    return { status: true, list: jsonArray }
}

router.route('/settlement').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepSettlement(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepSettlement' } });
        });
    }
});

const operationValrepSettlement = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.settlementValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cfiniquito: query.result.recordset[i].CFINIQUITO, xcausafiniquito: query.result.recordset[i].XCAUSAFINIQUITO, xnombre: query.result.recordset[i].XNOMBRE, xapellido: query.result.recordset[i].XAPELLIDO });
    }
    return { status: true, list: jsonArray }
}

router.route('/provider-bill').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepProviderBillLoading(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepProviderBillLoading' } });
        });
    }
});

const operationValrepProviderBillLoading = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        cpais: requestBody.cpais
    }
    let query = await bd.providerQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cproveedor: query.result.recordset[i].CPROVEEDOR, xnombre: query.result.recordset[i].XNOMBRE });
    }
    return { status: true, list: jsonArray }
}

router.route('/takers').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepTakers(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepTakers' } });
        });
    }
});

const operationValrepTakers = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let query = await bd.takersValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ ctomador: query.result.recordset[i].CTOMADOR, xtomador: query.result.recordset[i].XTOMADOR });
    }
    return { status: true, list: jsonArray }
}

router.route('/search-service').post((req, res) => {
    if(!req.header('Authorization')){ 
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepSearchService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepSearchService' } });
        });
    }
});

const operationValrepSearchService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais', 'ccompania', 'ctiposervicio'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        ctiposervicio: requestBody.ctiposervicio
    };
    let query = await bd.serviceValrepQuery(searchData).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cservicio: query.result.recordset[i].CSERVICIO, xservicio: query.result.recordset[i].XSERVICIO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

module.exports = router;