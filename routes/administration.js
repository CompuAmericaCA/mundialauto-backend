const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const emailer = require('../src/emailer')

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchAdministrationPaymentRecord(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchAdministrationPaymentRecord' } });
        });
    }
});

const operationSearchAdministrationPaymentRecord = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        corden: requestBody.corden,
        cfiniquito: requestBody.cfiniquito,
        ccompania: requestBody.ccompania
    }
    console.log(searchData)
    let searchAdministrationPaymentRecord = await bd.searchAdministrationPaymentRecordQuery(searchData).then((res) => res);
    if(searchAdministrationPaymentRecord.error){ return { status: false, code: 500, message: searchAdministrationPaymentRecord.error }; }
    if(searchAdministrationPaymentRecord.result.rowsAffected > 0){
        let searchSettlementAdministrationPaymentRecord = await bd.searchSettlementAdministrationPaymentRecordQuery(searchData).then((res) => res);
        if(searchSettlementAdministrationPaymentRecord.error){ return { status: false, code: 500, message: searchSettlementAdministrationPaymentRecord.error }; }
        let jsonListSettlement = [];
        for(let i = 0; i < searchSettlementAdministrationPaymentRecord.result.recordset.length; i++){
            jsonListSettlement.push({
                cfiniquito: searchSettlementAdministrationPaymentRecord.result.recordset[i].CFINIQUITO,
                xobservacion: searchSettlementAdministrationPaymentRecord.result.recordset[i].XOBSERVACION,
                xdanos: searchSettlementAdministrationPaymentRecord.result.recordset[i].XDANOS,
                mmontofiniquito: searchSettlementAdministrationPaymentRecord.result.recordset[i].MMONTOFINIQUITO,
                xcausafiniquito: searchSettlementAdministrationPaymentRecord.result.recordset[i].XCAUSAFINIQUITO,
                xmoneda: searchSettlementAdministrationPaymentRecord.result.recordset[i].xmoneda
            });
        }
        let jsonList = [];
        for(let i = 0; i < searchAdministrationPaymentRecord.result.recordset.length; i++){
            jsonList.push({
                corden: searchAdministrationPaymentRecord.result.recordset[i].CORDEN,
                xobservacion: searchAdministrationPaymentRecord.result.recordset[i].XOBSERVACION,
                xdanos: searchAdministrationPaymentRecord.result.recordset[i].XDANOS,
                xservicio: searchAdministrationPaymentRecord.result.recordset[i].XSERVICIO,
                xservicioadicional: searchAdministrationPaymentRecord.result.recordset[i].XSERVICIOADICIONAL,
                mmontototal: searchAdministrationPaymentRecord.result.recordset[i].MMONTOTOTAL,
                mtotal: searchAdministrationPaymentRecord.result.recordset[i].MTOTAL,
                xmoneda: searchAdministrationPaymentRecord.result.recordset[i].xmoneda,
                xmonedacotizacion: searchAdministrationPaymentRecord.result.recordset[i].XMONEDACOTIZACION
            });
        }
        return { status: true, list: jsonList, settlementList: jsonListSettlement };
    }else{ return { status: false, code: 404, message: 'Coin not found.' }; }
}

module.exports = router;