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
        fhasta: requestBody.fhasta
    }
    let searchPendingPayments = await bd.searchPendingPaymentsQuery(searchData).then((res) => res);
    if(searchPendingPayments.error){ return  { status: false, code: 500, message: searchPendingPayments.error }; }
    receipts = [];
    if(searchPendingPayments.result.recordset.length > 0){
        for(let i = 0; i < searchPendingPayments.result.recordset.length; i++){
            let rangotreinta = null;       // 1 - 29
            let rangosesenta = null;       //30 - 59
            let rangonoventa = null;       //60 - 89
            let rangomayornoventa = null;  //+90
            let diferenciaEnTiempo = new Date(searchData.fhasta).getTime() - searchPendingPayments.result.recordset[i].FDESDE_REC.getTime();
            let diferenciaEnDias = diferenciaEnTiempo / (1000 * 3600 * 24);
            if (diferenciaEnDias < 30){
                rangotreinta = searchPendingPayments.result.recordset[i].MPRIMA_ANUAL;
            }
            else if (diferenciaEnDias < 60 && diferenciaEnDias >= 30) {
                rangosesenta = searchPendingPayments.result.recordset[i].MPRIMA_ANUAL;
            }
            else if (diferenciaEnDias < 90 && diferenciaEnDias >= 60) {
                rangonoventa = searchPendingPayments.result.recordset[i].MPRIMA_ANUAL;
            }
            else if (diferenciaEnDias > 90) {
                rangomayornoventa = searchPendingPayments.result.recordset[i].MPRIMA_ANUAL;
            }
            let dateFormatDesde = searchPendingPayments.result.recordset[i].FDESDE_REC.toJSON().slice(0,10).split('-');
            let femision = dateFormatDesde[2] + '/' + dateFormatDesde[1] + '/' + dateFormatDesde[0];
            receipt = {
                xproducto: 'Póliza Vehículo',
                xpoliza: searchPendingPayments.result.recordset[i].xpoliza,
                ccontratoflota: searchPendingPayments.result.recordset[i].CCONTRATOFLOTA,
                xnombre: searchPendingPayments.result.recordset[i].XNOMBRE + ' ' + searchPendingPayments.result.recordset[i].XAPELLIDO,
                xsucursalemision: searchPendingPayments.result.recordset[i].XSUCURSALEMISION,
                ccorredor: searchPendingPayments.result.recordset[i].CCORREDOR,
                xcorredor: searchPendingPayments.result.recordset[i].XCORREDOR,
                nrecibo: searchPendingPayments.result.recordset[i].XRECIBO + '-' + searchPendingPayments.result.recordset[i].NCONSECUTIVO,
                xmoneda: searchPendingPayments.result.recordset[i].xmoneda,
                femision: femision,
                fdesde_rec: searchPendingPayments.result.recordset[i].FDESDE_REC,
                fhasta_rec: searchPendingPayments.result.recordset[i].FHASTA_REC,
                rangotreinta: rangotreinta,
                rangosesenta: rangosesenta,
                rangonoventa: rangonoventa,
                rangomayornoventa: rangomayornoventa,
                ndias: diferenciaEnDias
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