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
            let getContractCoverages = await bd.getContractCoverages(searchSubscriptions.result.recordset[i].CCONTRATOFLOTA);
            if(getContractCoverages.error){ console.log(getContractCoverages.error); return { status: false, code: 500, message: getFleetContractOwnerData.error }; }
            if(getContractCoverages.result.rowsAffected < 0){ return { status: false, code: 404, message: 'Fleet Contract Plan Coverages not found.' }; }
            let mdanosacosas = 0;
            let mdanosapersonas = 0;
            let mmuerte = 0;
            let minvalidez = 0;
            let mgastosmedicos = 0;
            let mgastosfunerarios = 0;
            let mcoberturaamplia = 0;
            let mperdidatotal = 0;
            let mblindaje = 0;
            let maccesorios = 0;
            let mvaloraseguradoaccesorios = 0;
            let ptasaasegurada = 0;
            let mprimacasco = 0;
            let mriesgocatastrofico = 0;
            let mbasicarcv = 0;
            let mexcesodelimite = 0;
            let mdefensapenal = 0;
            let mapov = 0;
            let mmotin = 0;
            let mtotalprimarcv = 0;
            let mserviciogrua = 0;
            let mprimatotal = 0;
            for (let i = 0; i < getContractCoverages.result.recordset.length; i++) { 
                switch (getContractCoverages.result.recordset[i].CCOBERTURA) {
                    case 2:
                        mdanosacosas = getContractCoverages.result.recordset[i].mprima;
                        mbasicarcv = mbasicarcv + mdanosacosas;
                        break;
                    case 3:
                        mdanosapersonas = getContractCoverages.result.recordset[i].mprima;
                        mbasicarcv = mbasicarcv + mdanosapersonas;
                        break;
                    case 5:
                        mdefensapenal = getContractCoverages.result.recordset[i].mprima;
                        mtotalprimarcv = mtotalprimarcv + mdefensapenal;
                        break;
                    case 7:
                        mexcesodelimite = getContractCoverages.result.recordset[i].mprima;
                        mtotalprimarcv = mtotalprimarcv + mexcesodelimite;
                        break;
                    case 9:
                        mmuerte = getContractCoverages.result.recordset[i].mprima;
                        mapov = mapov + mmuerte;
                        break;
                    case 10:
                        minvalidez = getContractCoverages.result.recordset[i].mprima;
                        mapov = mapov + minvalidez;
                        break;
                    case 11:
                        mgastosmedicos = getContractCoverages.result.recordset[i].mprima;
                        mapov = mapov + mgastosmedicos;
                        break;
                    case 12:
                        mgastosfunerarios = getContractCoverages.result.recordset[i].mprima;
                        mapov = mapov + mgastosfunerarios;
                        break;
                    case 14:
                        mcoberturaamplia = getContractCoverages.result.recordset[i].mprima;
                        mprimacasco = mprimacasco + mcoberturaamplia;
                        break;
                    case 16:
                        mperdidatotal = getContractCoverages.result.recordset[i].mprima;
                        mprimacasco = mprimacasco + mperdidatotal;
                        break;
                    case 17:
                        mriesgocatastrofico = getContractCoverages.result.recordset[i].mprima;
                        break;
                    case 18:
                        mblindaje = getContractCoverages.result.recordset[i].mprima;
                        mprimacasco = mprimacasco + mblindaje;
                        break;
                    case 19:
                        maccesorios = getContractCoverages.result.recordset[i].mprima;
                        mvaloraseguradoaccesorios = getContractCoverages.result.recordset[i].msuma_aseg;
                        mprimacasco = mprimacasco + maccesorios;
                        break;
                    case 20:
                        mmotin = getContractCoverages.result.recordset[i].mprima;
                        break;
                    case 22:
                        mserviciogrua = getContractCoverages.result.recordset[i].mprima;
                        break;
                }
            }
            mtotalrcv = mdefensapenal + mexcesodelimite + mapov;
            mprimatotal = mprimacasco + mriesgocatastrofico + mmotin + mtotalprimarcv + mserviciogrua;
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
                mvalor: searchSubscriptions.result.recordset[i].MVALOR,
                mvaloraseguradoaccesorios: mvaloraseguradoaccesorios,
                ptasaasegurada: ptasaasegurada,
                mprimacasco: mprimacasco,
                mriesgocatastrofico: mriesgocatastrofico,
                mbasicarcv: mbasicarcv,
                mexcesodelimite: mexcesodelimite,
                mdefensapenal: mdefensapenal,
                mapov: mapov,
                mmotin: mmotin,
                mtotalprimarcv: mtotalprimarcv,
                mserviciogrua: mserviciogrua,
                mprimatotal: mprimatotal
            });
        }
        console.log(subscriptions);
    }
    return {
        status: true,
        code: 200,
        message: 'OK',
        subscriptions: subscriptions
    }
}

module.exports = router;