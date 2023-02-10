const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchSubscriptionReport(req.header('Authorization'), req.body).then((result) => {
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

const operationSearchSubscriptionReport = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        fdesde: requestBody.fdesde,
        fhasta: requestBody.fhasta
    }
    let searchSubscriptions = await bd.searchSubscriptionsQuery(searchData).then((res) => res);
    if(searchSubscriptions.error){ return  { status: false, code: 500, message: searchSubscriptions.error }; }
    let subscriptions = [];
    if(searchSubscriptions.result.recordset.length > 0){
        for (let i = 0; i < searchSubscriptions.result.recordset.length; i++) {
            subscriptions.push({
               ccontratoflota:  searchSubscriptions.result.recordset[i].CCONTRATOFLOTA,
               xnombrepropietario: searchSubscriptions.result.recordset[i].XNOMBRE + ' ' + searchSubscriptions.result.recordset[i].XAPELLIDO,
               xmarca: searchSubscriptions.result.recordset[i].XMARCA,
               xmodelo: searchSubscriptions.result.recordset[i].XMODELO,
               xversion: searchSubscriptions.result.recordset[i].XVERSION,
               fano: searchSubscriptions.result.recordset[i].FANO,
               xtipovehiculo: searchSubscriptions.result.recordset[i].XTIPOVEHICULO,
               npasajero: searchSubscriptions.result.recordset[i].NPASAJERO,
               xplaca: searchSubscriptions.result.recordset[i].XPLACA,
               xcolor: searchSubscriptions.result.recordset[i].XCOLOR,
               xserialcarroceria: searchSubscriptions.result.recordset[i].XSERIALCARROCERIA,
               xserialmotor: searchSubscriptions.result.recordset[i].XSERIALMOTOR,
               ccarga: searchSubscriptions.result.recordset[i].ccarga,
               mvalor: searchSubscriptions.result.recordset[i].MVALOR
            });
        }
    }
    return {
        status: true,
        code: 200,
        message: 'OK',
        subscriptions: subscriptions
    }
}

module.exports = router;