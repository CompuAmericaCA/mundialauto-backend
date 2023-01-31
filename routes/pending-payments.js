const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const db = require('../data/db');
const { format } = require('express/lib/response');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchPendingPayments(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message);
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationPendingPayments' } });
        });
    }
});

const operationSearchPendingPayments = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        fdesde: requestBody.fdesde,
        fhasta: requestBody.fhasta
    }
    let searchPendingPayments = await bd.searchPendingPaymentsQuery(searchData).then((res) => res);
    if(searchPendingPayments.error){ return  { status: false, code: 500, message: searchPendingPayments.error }; }
    receipts = [];
    if(searchPendingPayments.result.recordset.length > 0){
        for(let i = 0; i < searchPendingPayments.result.recordset.length; i++){
            receipt = {
                xpoliza: searchPendingPayments.result.recordset[i].xpoliza,
                ccontratoflota: searchPendingPayments.result.recordset[i].CCONTRATOFLOTA,
                xnombre: searchPendingPayments.result.recordset[i].XNOMBRE + ' ' + searchPendingPayments.result.recordset[i].XAPELLIDO,
                xsucursalemision: searchPendingPayments.result.recordset[i].XSUCURSALEMISION,
                ccorredor: searchPendingPayments.result.recordset[i].CCORREDOR,
                xcorredor: searchPendingPayments.result.recordset[i].XCORREDOR,
                nrecibo: searchPendingPayments.result.recordset[i].XRECIBO + '-' + searchPendingPayments.result.recordset[i].NCONSECUTIVO,
                xmoneda: searchPendingPayments.result.recordset[i].xmoneda,
                femision: searchPendingPayments.result.recordset[i].FEMISION,
                fdesde_rec: searchPendingPayments.result.recordset[i].FDESDE_REC,
                fhasta_rec: searchPendingPayments.result.recordset[i].FHASTA_REC
            }
            receipts.push(receipt);
        }
    }
    return {
        status: true,
        receipts: receipts
    }
}

module.exports = router;