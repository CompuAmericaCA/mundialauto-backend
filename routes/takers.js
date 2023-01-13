const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const emailer = require('../src/emailer')

router.route('/search').post((req, res) => {
    console.log('hola')
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
        xtomador: requestBody.xtomador,
        xprofesion: requestBody.xprofesion,
        xrif: requestBody.xrif,
        xdomicilio: requestBody.xdomicilio,
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
    if(createTakers.result.rowsAffected > 0){ return { status: true, ctomador: createTakers.result.recordset[0].CTOMADOR }; }
    else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createTakers' };  }
}

module.exports = router;