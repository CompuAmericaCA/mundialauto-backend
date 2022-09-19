const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchCollection(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchCollection' } });
        });
    }
});

const operationSearchCollection = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ccompania: requestBody.ccompania,
        xplaca: requestBody.xplaca ? requestBody.xplaca.toUpperCase() : undefined
    }
    console.log(searchData)
    let searchCollection = await bd.searchCollectionQuery(searchData).then((res) => res);
    if(searchCollection.error){ return { status: false, code: 500, message: searchCollection.error }; }
    if(searchCollection.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchCollection.result.recordset.length; i++){
            jsonList.push({
                crecibo: searchCollection.result.recordset[i].CRECIBO,
                clote: searchCollection.result.recordset[i].CLOTE,
                fdesde_pol: searchCollection.result.recordset[i].FDESDE_POL,
                fhasta_pol: searchCollection.result.recordset[i].FHASTA_POL,
                xnombrepropietario: searchCollection.result.recordset[i].XNOMBREPROPIETARIO,
                cestatusgeneral: searchCollection.result.recordset[i].CESTATUSGENERAL,
                xestatusgeneral: searchCollection.result.recordset[i].XESTATUSGENERAL
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

module.exports = router;