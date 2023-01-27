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
    if(searchPendingPayments.result.recordset.length > 0){
        for(let i = 0; i < query.result.recordset.length; i++){
            
        }
    }
}