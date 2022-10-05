const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchPlanRcv(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchPlanRcv' } });
        });
    }
});

const operationSearchPlanRcv = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let cplan_rc = requestBody.cplan_rc ? requestBody.cplan_rc : undefined
    
    let searchPlanRcv = await bd.searchPlanRcvQuery(cplan_rc).then((res) => res);
    if(searchPlanRcv.error){ return  { status: false, code: 500, message: searchPlanRcv.error }; }
    if(searchPlanRcv.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchPlanRcv.result.recordset.length; i++){
            jsonList.push({
                cplan_rc: searchPlanRcv.result.recordset[i].CPLAN_RC,
                ctarifa: searchPlanRcv.result.recordset[i].CTARIFA,
                xclase: searchPlanRcv.result.recordset[i].XCLASE,
                xtipo: searchPlanRcv.result.recordset[i].XTIPO,
                xgrupo: searchPlanRcv.result.recordset[i].XGRUPO,
                msuma_cosas_rc: searchPlanRcv.result.recordset[i].MSUMA_COSAS_RC,
                mprima_rc: searchPlanRcv.result.recordset[i].MPRIMA_RC,
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Plan Type not found.' }; }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailPlanRcv(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPlanRcv' } });
        });
    }
});

const operationDetailPlanRcv = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cplan_rc: requestBody.cplan_rc,
        ctarifa: requestBody.ctarifa
    }
    
    let detailPlanRcv = await bd.detailPlanRcvQuery(searchData).then((res) => res);
    if(detailPlanRcv.error){ return  { status: false, code: 500, message: detailPlanRcv.error }; }
    if(detailPlanRcv.result.rowsAffected > 0){
        return  { 
                    status: true,
                    cplan_rc: detailPlanRcv.result.recordset[0].CPLAN_RC, 
                    xplan_rc: detailPlanRcv.result.recordset[0].XPLAN_RC, 
                    ctarifa: detailPlanRcv.result.recordset[0].CTARIFA, 
                    xclase: detailPlanRcv.result.recordset[0].XCLASE, 
                    xtipo: detailPlanRcv.result.recordset[0].XTIPO, 
                    xgrupo: detailPlanRcv.result.recordset[0].XGRUPO, 
                    msuma_cosas_rc: detailPlanRcv.result.recordset[0].MSUMA_COSAS_RC, 
                    msuma_personas_rc: detailPlanRcv.result.recordset[0].MSUMA_PERSONAS_RC, 
                    mprima_rc: detailPlanRcv.result.recordset[0].MPRIMA_RC, 
                    msuma_defensa_per: detailPlanRcv.result.recordset[0].MSUMA_DEFENSA_PER, 
                    mprima_defensa_per: detailPlanRcv.result.recordset[0].MPRIMA_DEFENSA_PER, 
                    msuma_limite_ind: detailPlanRcv.result.recordset[0].MSUMA_LIMITE_IND, 
                    mprima_limite_ind: detailPlanRcv.result.recordset[0].MPRIMA_LIMITE_IND, 
                    msuma_apov_mu: detailPlanRcv.result.recordset[0].MSUMA_APOV_MU, 
                    mapov_mu: detailPlanRcv.result.recordset[0].MAPOV_MU, 
                    msuma_apov_in: detailPlanRcv.result.recordset[0].MSUMA_APOV_IN, 
                    mapov_in: detailPlanRcv.result.recordset[0].MAPOV_IN, 
                    msuma_apov_ga: detailPlanRcv.result.recordset[0].MSUMA_APOV_GA, 
                    mapov_ga: detailPlanRcv.result.recordset[0].MAPOV_GA, 
                    msuma_apov_fu: detailPlanRcv.result.recordset[0].MSUMA_APOV_FU, 
                    mapov_fu: detailPlanRcv.result.recordset[0].MAPOV_FU
                };

    }else{ return { status: false, code: 404, message: 'Plan Type not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdatePlanRcv(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdatePlanRcv' } });
        });
    }
});

const operationUpdatePlanRcv = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let dataPlanRcv = {
        cusuario: requestBody.cusuario,
        cplan_rc: requestBody.cplan_rc,
        xplan_rc: requestBody.xplan_rc,
        ctarifa: requestBody.ctarifa,
        xclase: requestBody.xclase,
        xtipo: requestBody.xtipo,
        xgrupo: requestBody.xgrupo,
        msuma_cosas_rc: requestBody.msuma_cosas_rc,
        msuma_personas_rc: requestBody.msuma_personas_rc,
        mprima_rc: requestBody.mprima_rc,
        msuma_defensa_per: requestBody.msuma_defensa_per,
        mprima_defensa_per: requestBody.mprima_defensa_per,
        msuma_limite_ind: requestBody.msuma_limite_ind,
        mprima_limite_ind: requestBody.mprima_limite_ind,
        msuma_apov_mu: requestBody.msuma_apov_mu,
        mapov_mu: requestBody.mapov_mu,
        msuma_apov_in: requestBody.msuma_apov_in,
        mapov_in: requestBody.mapov_in,
        msuma_apov_ga: requestBody.msuma_apov_ga,
        mapov_ga: requestBody.mapov_ga,
        msuma_apov_fu: requestBody.msuma_apov_fu,
        mapov_fu: requestBody.mapov_fu
    }
    let updatePlanRcvDetail = await bd.updatePlanRcvQuery(dataPlanRcv).then((res) => res);
    if(updatePlanRcvDetail.error){ return { status: false, code: 500, message: updatePlanRcvDetail.error }; }
    if(updatePlanRcvDetail.result.rowsAffected > 0){ return { status: true, cplan_rc: dataPlanRcv.cplan_rc }; }
    else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
}

module.exports = router;