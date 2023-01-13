const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const emailer = require('../src/emailer')

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchTakers(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTakers' } });
        });
    }
});

const operationSearchTakers = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        xrif: requestBody.xrif ? requestBody.xrif : undefined,
    };
   
    let searchtakers = await bd.searchtakersQuery(searchData).then((res) => res);
    if(searchtakers.error){ return  { status: false, code: 500, message: searchtakers.error }; }
    if(searchtakers.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchtakers.result.recordset.length; i++){
            jsonList.push({
                ctomador: searchtakers.result.recordset[i].CTOMADOR,
                xtomador: searchtakers.result.recordset[i].XTOMADOR,
                xrif: searchtakers.result.recordset[i].XRIF,
                xprofesion: searchtakers.result.recordset[i].XPROFESION,
                xdomicilio: searchtakers.result.recordset[i].XDOMICILIO,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Fleet Contract Management not found.' }; } 
} 

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateTakers(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateTakers' } });
        });
    }
});

const operationCreateTakers = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let createData = {
        xtomador: requestBody.xtomador.toUpperCase(),
        xprofesion: requestBody.xprofesion,
        xrif: requestBody.xrif,
        xdomicilio: requestBody.xdomicilio,
        cpais: requestBody.cpais,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xzona_postal: requestBody.xzona_postal,
        xtelefono: requestBody.xtelefono,
        cestatusgeneral: requestBody.cestatusgeneral,
        xcorreo: requestBody.xcorreo,
        cusuario: requestBody.cusuario,
    };
    let createTakers = await bd.createTakersQuery(createData).then((res) => res);
    if(createTakers.error){ return { status: false, code: 500, message: createTakers.error }; }
    if(createTakers.result.rowsAffected > 0){ return { status: true, create: true}; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTakers' };  }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailTakers(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailTakers' } });
        });
    }
});

const operationDetailTakers = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ctomador: requestBody.ctomador
    };
   
    let detailtakers = await bd.detailTakersQuery(searchData).then((res) => res);
    if(detailtakers.error){ return  { status: false, code: 500, message: detailtakers.error }; }
    if(detailtakers.result.rowsAffected > 0){

        return { 
                status: true,
                ctomador:  detailtakers.result.recordset[0].CTOMADOR,
                xtomador:  detailtakers.result.recordset[0].XTOMADOR,
                xprofesion:  detailtakers.result.recordset[0].XPROFESION,
                xrif:  detailtakers.result.recordset[0].XRIF,
                xdomicilio:  detailtakers.result.recordset[0].XDOMICILIO,
                xzona_postal:  detailtakers.result.recordset[0].XZONA_POSTAL,
                xtelefono:  detailtakers.result.recordset[0].XTELEFONO,
                xcorreo:  detailtakers.result.recordset[0].XCORREO,
                cpais:  detailtakers.result.recordset[0].CPAIS,
                cestado:  detailtakers.result.recordset[0].CESTADO,
                cciudad:  detailtakers.result.recordset[0].CCIUDAD,
                xpais:  detailtakers.result.recordset[0].XPAIS,
                xestado:  detailtakers.result.recordset[0].XESTADO,
                xciudad:  detailtakers.result.recordset[0].XCIUDAD,
                cestatusgeneral:  detailtakers.result.recordset[0].CESTATUSGENERAL,
                xestatusgeneral:  detailtakers.result.recordset[0].XESTATUSGENERAL,
            };
    }else{ return { status: false, code: 404, message: 'Fleet Contract Management not found.' }; } 
} 

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateTakers(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateTakers' } });
        });
    }
});

const operationUpdateTakers = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let createData = {
        ctomador: requestBody.ctomador,
        xtomador: requestBody.xtomador.toUpperCase(),
        xprofesion: requestBody.xprofesion,
        xrif: requestBody.xrif,
        xdomicilio: requestBody.xdomicilio,
        cpais: requestBody.cpais,
        cestado: requestBody.cestado,
        cciudad: requestBody.cciudad,
        xzona_postal: requestBody.xzona_postal,
        xtelefono: requestBody.xtelefono,
        cestatusgeneral: requestBody.cestatusgeneral,
        xcorreo: requestBody.xcorreo,
    };
    let updateTakers = await bd.updateTakersQuery(createData).then((res) => res);
    if(updateTakers.error){ return { status: false, code: 500, message: updateTakers.error }; }
    if(updateTakers.result.rowsAffected > 0){ return { status: true, update: true}; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'updateTakers' };  }
}

module.exports = router;