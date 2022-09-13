const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCoin(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCoin' } });
        });
    }
});

const operationSearchCoin = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cmoneda'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        cpais: requestBody.cpais,
        cmoneda: requestBody.cmoneda,
        xmoneda: requestBody.xmoneda ? requestBody.xmoneda.toUpperCase() : undefined,
        xdescripcion: requestBody.xdescripcion ? requestBody.xdescripcion.toUpperCase() : undefined
    }
    let searchCoin = await bd.searchCoinQuery(searchData).then((res) => res);
    if(searchCoin.error){ return { status: false, code: 500, message: searchCoin.error }; }
    if(searchCoin.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCoin.result.recordset.length; i++){
            jsonList.push({
                cmoneda: searchCoin.result.recordset[i].CMONEDA,
                xmoneda: searchCoin.result.recordset[i].XMONEDA,
                xdescripcion: searchCoin.result.recordset[i].XDESCRIPCION
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailCoin(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailCoin' } })
        });
    }
});

const operationDetailCoin = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cmoneda', 'xmoneda', 'xdescripcion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceData = {
        cmoneda: requestBody.cmoneda,
        xmoneda: requestBody.xmoneda,
        xdescripcion: requestBody.xdescripcion
    };
    let getCoinData = await bd.getCoinDataQuery(serviceData).then((res) => res);
    if(getCoinData.error){ return { status: false, code: 500, message: getCoinData.error }; }
    if(getCoinData.result.rowsAffected > 0){
        return { 
            status: true,
            cmoneda: getCoinData.result.recordset[0].CMONEDA,
            xmoneda: getCoinData.result.recordset[0].XMONEDA,
            xdescripcion: getCoinData.result.recordset[0].XDESCRIPCION
        }
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

module.exports = router;