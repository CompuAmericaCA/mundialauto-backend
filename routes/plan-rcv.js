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
                xplan_rc: searchPlanRcv.result.recordset[i].XPLAN_RC,
                msuma_dc: searchPlanRcv.result.recordset[i].MSUMA_DC,
                msuma_personas: searchPlanRcv.result.recordset[i].MSUMA_PERSONAS,
                msuma_exceso: searchPlanRcv.result.recordset[i].MSUMA_EXCESO,
                msuma_dp: searchPlanRcv.result.recordset[i].MSUMA_DP,
                msuma_muerte: searchPlanRcv.result.recordset[i].MSUMA_MUERTE,
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
        cplan_rc: requestBody.cplan_rc
    }
    let ratesList = [];
    let detailPlanRcv = await bd.detailPlanRcvQuery(searchData).then((res) => res);
    if(detailPlanRcv.error){ return  { status: false, code: 500, message: detailPlanRcv.error }; }
    if(detailPlanRcv.result.rowsAffected > 0){
        let detailPlanRcvDetail = await bd.detailPlanRcvDetailQuery(searchData).then((res) => res);
        if(detailPlanRcvDetail.error){ return  { status: false, code: 500, message: detailPlanRcvDetail.error }; }
        if(detailPlanRcvDetail.result.rowsAffected > 0){
            for(let i = 0; i < detailPlanRcvDetail.result.recordset.length; i++){
                ratesList.push({
                    xclase: detailPlanRcvDetail.result.recordset[i].XCLASE,
                    xtipo: detailPlanRcvDetail.result.recordset[i].XTIPO,
                    xgrupo: detailPlanRcvDetail.result.recordset[i].XGRUPO,
                    mgrua: detailPlanRcvDetail.result.recordset[i].MGRUA,
                    mut_cosas_rc: detailPlanRcvDetail.result.recordset[i].MUT_COSAS_RC,
                    msuma_cosas_rc: detailPlanRcvDetail.result.recordset[i].MSUMA_COSAS_RC,
                    mut_personas_rc: detailPlanRcvDetail.result.recordset[i].MUT_PERSONAS_RC,
                    msuma_personas_rc: detailPlanRcvDetail.result.recordset[i].MSUMA_PERSONAS_RC,
                    mut_prima_rc: detailPlanRcvDetail.result.recordset[i].MUT_PRIMA_RC,
                    mprima_rc: detailPlanRcvDetail.result.recordset[i].MPRIMA_RC,
                    mexceso_limite: detailPlanRcvDetail.result.recordset[i].MEXCESO_LIMITE,
                    mgastos_cat: detailPlanRcvDetail.result.recordset[i].MGASTOS_CAT,
                    mrecuperacion: detailPlanRcvDetail.result.recordset[i].MRECUPERACION,
                    msuma_defensa_per: detailPlanRcvDetail.result.recordset[i].MSUMA_DEFENSA_PER,
                    mprima_defensa_per: detailPlanRcvDetail.result.recordset[i].MPRIMA_DEFENSA_PER,
                    msuma_limite_ind: detailPlanRcvDetail.result.recordset[i].MSUMA_LIMITE_IND,
                    mprima_limite_ind: detailPlanRcvDetail.result.recordset[i].MPRIMA_LIMITE_IND,
                    msuma_apov_ga: detailPlanRcvDetail.result.recordset[i].MSUMA_APOV_GA,
                    msuma_apov_mu: detailPlanRcvDetail.result.recordset[i].MSUMA_APOV_MU,
                    mapov_mu: detailPlanRcvDetail.result.recordset[i].MAPOV_MU,
                    msuma_apov_in: detailPlanRcvDetail.result.recordset[i].MSUMA_APOV_IN,
                    mapov_in: detailPlanRcvDetail.result.recordset[i].MAPOV_IN,
                    mapov_ga: detailPlanRcvDetail.result.recordset[i].MAPOV_GA,
                    msuma_apov_fu: detailPlanRcvDetail.result.recordset[i].MSUMA_APOV_FU,
                    mapov_fu: detailPlanRcvDetail.result.recordset[i].MAPOV_FU
                })
            }
        }
        return  { 
                    status: true,
                    cplan_rc: detailPlanRcv.result.recordset[0].CPLAN_RC, 
                    xplan_rc: detailPlanRcv.result.recordset[0].XPLAN_RC, 
                    msuma_dc: detailPlanRcv.result.recordset[0].MSUMA_DC, 
                    msuma_personas: detailPlanRcv.result.recordset[0].MSUMA_PERSONAS, 
                    msuma_exceso: detailPlanRcv.result.recordset[0].MSUMA_EXCESO, 
                    msuma_dp: detailPlanRcv.result.recordset[0].MSUMA_DP, 
                    msuma_muerte: detailPlanRcv.result.recordset[0].MSUMA_MUERTE, 
                    msuma_invalidez: detailPlanRcv.result.recordset[0].MSUMA_INVALIDEZ, 
                    msuma_gm: detailPlanRcv.result.recordset[0].MSUMA_GM, 
                    msuma_gf: detailPlanRcv.result.recordset[0].MSUMA_GF, 
                    rates: ratesList
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
        msuma_dc: requestBody.msuma_dc,
        msuma_personas: requestBody.msuma_personas,
        msuma_exceso: requestBody.msuma_exceso,
        msuma_dp: requestBody.msuma_dp,
        msuma_muerte: requestBody.msuma_muerte,
        msuma_invalidez: requestBody.msuma_invalidez,
        msuma_gm: requestBody.msuma_gm,
        msuma_gf: requestBody.msuma_gf,
    }
    let updatePlanRcvDetail = await bd.updatePlanRcvQuery(dataPlanRcv).then((res) => res);
    if(updatePlanRcvDetail.error){ return { status: false, code: 500, message: updatePlanRcvDetail.error }; }
    let createRatesList = [];
    let updateRatesList = [];
    if(requestBody.rates){
       if(requestBody.rates.create){
          for(let i = 0; i < requestBody.rates.create.length; i++){
            createRatesList.push({
              ctarifa: requestBody.rates.create[i].ctarifa,
              xclase: requestBody.rates.create[i].xclase,
              xtipo: requestBody.rates.create[i].xtipo,
              xgrupo: requestBody.rates.create[i].xgrupo,
              mgrua: requestBody.rates.create[i].mgrua,
              mut_cosas_rc: requestBody.rates.create[i].mut_cosas_rc,
              msuma_cosas_rc: requestBody.rates.create[i].msuma_cosas_rc,
              mut_personas_rc: requestBody.rates.create[i].mut_personas_rc,
              msuma_personas_rc: requestBody.rates.create[i].msuma_personas_rc,
              mut_prima_rc: requestBody.rates.create[i].mut_prima_rc,
              mprima_rc: requestBody.rates.create[i].mprima_rc,
              mexceso_limite: requestBody.rates.create[i].mprima_rc,
              mgastos_cat: requestBody.rates.create[i].mgastos_cat,
              mrecuperacion: requestBody.rates.create[i].mrecuperacion,
              msuma_defensa_per: requestBody.rates.create[i].msuma_defensa_per,
              mprima_defensa_per: requestBody.rates.create[i].mprima_defensa_per,
              msuma_limite_ind: requestBody.rates.create[i].msuma_limite_ind,
              mprima_limite_ind: requestBody.rates.create[i].mprima_limite_ind,
              msuma_apov_mu: requestBody.rates.create[i].msuma_apov_mu,
              mapov_mu: requestBody.rates.create[i].mapov_mu,
              msuma_apov_in: requestBody.rates.create[i].msuma_apov_in,
              mapov_in: requestBody.rates.create[i].mapov_in,
              msuma_apov_ga: requestBody.rates.create[i].msuma_apov_ga,
              mapov_ga: requestBody.rates.create[i].mapov_ga,
              msuma_apov_fu: requestBody.rates.create[i].msuma_apov_fu,
              mapov_fu: requestBody.rates.create[i].mapov_fu
            })
          }
          let createRatesPlanRcv = await bd.createRatesPlanRcvQuery(dataPlanRcv, createRatesList).then((res) => res);
          if(createRatesPlanRcv.error){ return { status: false, code: 500, message: createRatesPlanRcv.error }; }
       }

       if(requestBody.rates.update){
        for(let i = 0; i < requestBody.rates.update.length; i++){
            updateRatesList.push({
              ctarifa: requestBody.rates.update[i].ctarifa,
              xclase: requestBody.rates.update[i].xclase,
              xtipo: requestBody.rates.update[i].xtipo,
              xgrupo: requestBody.rates.update[i].xgrupo,
              mgrua: requestBody.rates.update[i].mgrua,
              mut_cosas_rc: requestBody.rates.update[i].mut_cosas_rc,
              msuma_cosas_rc: requestBody.rates.update[i].msuma_cosas_rc,
              mut_personas_rc: requestBody.rates.update[i].mut_personas_rc,
              msuma_personas_rc: requestBody.rates.update[i].msuma_personas_rc,
              mut_prima_rc: requestBody.rates.update[i].mut_prima_rc,
              mprima_rc: requestBody.rates.update[i].mprima_rc,
              mexceso_limite: requestBody.rates.update[i].mprima_rc,
              mgastos_cat: requestBody.rates.update[i].mgastos_cat,
              mrecuperacion: requestBody.rates.update[i].mrecuperacion,
              msuma_defensa_per: requestBody.rates.update[i].msuma_defensa_per,
              mprima_defensa_per: requestBody.rates.update[i].mprima_defensa_per,
              msuma_limite_ind: requestBody.rates.update[i].msuma_limite_ind,
              mprima_limite_ind: requestBody.rates.update[i].mprima_limite_ind,
              msuma_apov_mu: requestBody.rates.update[i].msuma_apov_mu,
              mapov_mu: requestBody.rates.update[i].mapov_mu,
              msuma_apov_in: requestBody.rates.update[i].msuma_apov_in,
              mapov_in: requestBody.rates.update[i].mapov_in,
              msuma_apov_ga: requestBody.rates.update[i].msuma_apov_ga,
              mapov_ga: requestBody.rates.update[i].mapov_ga,
              msuma_apov_fu: requestBody.rates.update[i].msuma_apov_fu,
              mapov_fu: requestBody.rates.update[i].mapov_fu
            })
          }
          console.log(updateRatesList)
          let updateRatesPlanRcv = await bd.updateRatesPlanRcvQuery(dataPlanRcv, updateRatesList).then((res) => res);
          if(updateRatesPlanRcv.error){ return { status: false, code: 500, message: updateRatesPlanRcv.error }; }
       }
    }
    if(updatePlanRcvDetail.result.rowsAffected > 0){ return { status: true, cplan_rc: dataPlanRcv.cplan_rc }; }
    else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreatePlanRcv(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreatePlanRcv' } });
        });
    }
});

const operationCreatePlanRcv = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let dataPlanRcv = {
        cusuario: requestBody.cusuario,
        xplan_rc: requestBody.xplan_rc,
        msuma_dc: requestBody.msuma_dc,
        msuma_personas: requestBody.msuma_personas,
        msuma_exceso: requestBody.msuma_exceso,
        msuma_dp: requestBody.msuma_dp,
        msuma_muerte: requestBody.msuma_muerte,
        msuma_invalidez: requestBody.msuma_invalidez,
        msuma_gm: requestBody.msuma_gm,
        msuma_gf: requestBody.msuma_gf,
    }
    let cplan_rc = 0;
    let codePlanRcv = await bd.codePlanRcvQuery(dataPlanRcv).then((res) => res);
    if(codePlanRcv.error){ return { status: false, code: 500, message: codePlanRcv.error }; }
    if(codePlanRcv.result.rowsAffected > 0){
        cplan_rc = codePlanRcv.result.recordset[0].CPLAN_RC + 1
        let createPlanRcv = await bd.createPlanRcvQuery(dataPlanRcv, cplan_rc).then((res) => res);
        if(createPlanRcv.error){ return { status: false, code: 500, message: createPlanRcv.error }; }
        if(createPlanRcv.result.rowsAffected > 0){ return { status: true, cplan_rc: cplan_rc }; }
    }
    else{ return { status: false, code: 404, message: 'Plan RCV not found.' }; }
}

module.exports = router;