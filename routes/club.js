const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/city').post((req, res) => {
    operationValrepCity(req.body).then((result) => {
        if(!result.status){ 
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepCity' } });
    });
});

const operationValrepCity = async(requestBody) => {
    let searchData = {
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

router.route('/state').post((req, res) => {
    operationValrepState(req.body).then((result) => {
        if(!result.status){ 
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepState' } });
    });
});

const operationValrepState = async(requestBody) => {
    let cpais = requestBody.cpais;
    let query = await bd.stateValrepQuery(cpais).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestado: query.result.recordset[i].CESTADO, xestado: query.result.recordset[i].XESTADO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

router.route('/sex').post((req, res) => {
    operationValrepSex(req.body).then((result) => {
        if(!result.status){ 
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepSex' } });
    });
});

const operationValrepSex = async(requestBody) => {
    let query = await bd.sexValrepQuery().then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ csexo: query.result.recordset[i].CSEXO, xsexo: query.result.recordset[i].XSEXO });
    }
    return { status: true, list: jsonArray }
}

router.route('/create-user-club').post((req, res) => {
    operationCreateCity(req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        console.log(err.message)
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateCity' } });
    });
});

const operationCreateCity = async(requestBody) => {
    let userData = {
        xnombre: requestBody.xnombre.toUpperCase(),
        xapellido: requestBody.xapellido,
        csexo: requestBody.csexo,
        fnacimiento: requestBody.fnacimiento,
        xemail: requestBody.xemail,
        xcontrasena: requestBody.xcontrasena,
        cciudad: requestBody.cciudad,
        cestado: requestBody.cestado,
        xdireccion: requestBody.xdireccion,
        xdocidentidad: requestBody.xdocidentidad,
        xtelefonocelular: requestBody.xtelefonocelular,
    };
    let createUserClub = await bd.createUserClubQuery(userData).then((res) => res);
    if(createUserClub.error){ return { status: false, code: 500, message: createUserClub.error }; }
    if(createUserClub.result.rowsAffected > 0){ return { status: true, id: createUserClub.result.recordset[0].ID }; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createCity' }; }
}


module.exports = router;