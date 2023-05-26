const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/Search').post((req, res) => {
    operationSearchRates(req.body).then((result) => {
        if(!result.status){ 
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchRates' } });
    });
});

const operationSearchRates = async() => {
    let Rates = await bd.SearchRates().then((res) => res);
    if(Rates.error){ return { status: false, code: 500, message: Rates.error }; }
    if(Rates.result.rowsAffected > 0){
        let ListRates = [];
        for(let i = 0; i < Rates.result.recordset.length; i++){
            ListRates.push({ 
                ctarifa_exceso: Rates.result.recordset[i].CTARIFA_EXCESO, 
                xclase: Rates.result.recordset[i].XCLASE, 
                xgrupo: Rates.result.recordset[i].XGRUPO, 
                ptasa_exceso: Rates.result.recordset[i].PTASA_EXCESO, 
                mgrua: Rates.result.recordset[i].MGRUA, 
            });
        }  
        return {         
        status: true, 
        list: ListRates 
        }; 
    }
}

router.route('/Update').post((req, res) => {
    operationUpdateRates(req.body).then((result) => {
        if(!result.status){ 
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateRates' } });
    });
});

const operationUpdateRates = async(requestBody) => {
    let cpais = requestBody.cpais;
    let query = await bd.stateValrepQuery(cpais).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cestado: query.result.recordset[i].CESTADO, xestado: query.result.recordset[i].XESTADO, bactivo: query.result.recordset[i].BACTIVO });
    }
    return { status: true, list: jsonArray }
}

module.exports = router;