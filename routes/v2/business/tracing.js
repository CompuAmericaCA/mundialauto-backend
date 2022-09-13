const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');
const validator = require('../../../helpers/validator');

router.route('/production/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    /*let validateSchema = helper.validateSchema('production', 'tracing', req.body, 'searchBusinessProductionTrancingSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }*/
    validator.operationVerifyProductionModulePermission(req.body.permissionData, 'BINDICE').then((response) => {
        if(response.error){ 
            res.status(401).json({ status: false, code: 401, condition: 'user-dont-hvea-permissions', expired: false });
            return;
        }
        operationSearchTracing(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchTracing' } });
        });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationVerifyApiModulePermission' } });
    });
});

const operationSearchTracing = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        //cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        btodos: requestBody.btodos ? requestBody.btodos : undefined,
        cusuario: requestBody.cusuario ? requestBody.cusuario : undefined
    }
    console.log(searchData);
    let searchFleetNotificationTracing = await db.searchFleetNotificationTracingQuery(searchData).then((res) => res);
    if(searchFleetNotificationTracing.error){ return { status: false, code: 500, message: searchFleetNotificationTracing.error }; }
    let fleetNotificationTracings = [];
    if(searchFleetNotificationTracing.result.rowsAffected > 0){
        for(let i = 0; i < searchFleetNotificationTracing.result.recordset.length; i++){
            let tracing = {
                cnotificacion: searchFleetNotificationTracing.result.recordset[i].CNOTIFICACION,
                cseguimientonotificacion: searchFleetNotificationTracing.result.recordset[i].CSEGUIMIENTONOTIFICACION,
                xtiposeguimiento: searchFleetNotificationTracing.result.recordset[i].XTIPOSEGUIMIENTO,
                xmotivoseguimiento: searchFleetNotificationTracing.result.recordset[i].XMOTIVOSEGUIMIENTO,
                fseguimientonotificacion: searchFleetNotificationTracing.result.recordset[i].FSEGUIMIENTONOTIFICACION,
                bcerrado: searchFleetNotificationTracing.result.recordset[i].BCERRADO
            }
            fleetNotificationTracings.push(tracing);
        }
    }
    let searchFleetNotificationThirdpartyTracing = await db.searchFleetNotificationThirdpartyTracingQuery(searchData).then((res) => res);
    if(searchFleetNotificationThirdpartyTracing.error){ return { status: false, code: 500, message: searchFleetNotificationThirdpartyTracing.error }; }
    let fleetNotificationThirdpartyTracings = [];
    if(searchFleetNotificationThirdpartyTracing.result.rowsAffected > 0){
        for(let i = 0; i < searchFleetNotificationThirdpartyTracing.result.recordset.length; i++){
            let tracing = {
                cnotificacion: searchFleetNotificationThirdpartyTracing.result.recordset[i].CNOTIFICACION,
                cseguimientotercero: searchFleetNotificationThirdpartyTracing.result.recordset[i].CSEGUIMIENTOTERCERO,
                xnombre: helper.decrypt(searchFleetNotificationThirdpartyTracing.result.recordset[i].XNOMBRE),
                xapellido: helper.decrypt(searchFleetNotificationThirdpartyTracing.result.recordset[i].XAPELLIDO),
                xtiposeguimiento: searchFleetNotificationThirdpartyTracing.result.recordset[i].XTIPOSEGUIMIENTO,
                xmotivoseguimiento: searchFleetNotificationThirdpartyTracing.result.recordset[i].XMOTIVOSEGUIMIENTO,
                fseguimientotercero: searchFleetNotificationThirdpartyTracing.result.recordset[i].FSEGUIMIENTOTERCERO,
                bcerrado: searchFleetNotificationThirdpartyTracing.result.recordset[i].BCERRADO
            }
            fleetNotificationThirdpartyTracings.push(tracing);
        }
    }
    let searchClubServiceRequestTracing = await db.searchClubServiceRequestTracingQuery(searchData).then((res) => res);
    if(searchClubServiceRequestTracing.error){ return { status: false, code: 500, message: searchClubServiceRequestTracing.error }; }
    let clubServiceRequestTracings = [];
    if(searchClubServiceRequestTracing.result.rowsAffected > 0){
        for(let i = 0; i < searchClubServiceRequestTracing.result.recordset.length; i++){
            let tracing = {
                csolicitudservicio: searchClubServiceRequestTracing.result.recordset[i].CSOLICITUDSERVICIO,
                cseguimientosolicitudservicio: searchClubServiceRequestTracing.result.recordset[i].CSEGUIMIENTOSOLICITUDSERVICIO,
                xtiposeguimiento: searchClubServiceRequestTracing.result.recordset[i].XTIPOSEGUIMIENTO,
                xmotivoseguimiento: searchClubServiceRequestTracing.result.recordset[i].XMOTIVOSEGUIMIENTO,
                fseguimientosolicitudservicio: searchClubServiceRequestTracing.result.recordset[i].FSEGUIMIENTOSOLICITUDSERVICIO,
                bcerrado: searchClubServiceRequestTracing.result.recordset[i].BCERRADO
            }
            clubServiceRequestTracings.push(tracing);
        }
    }
    if(fleetNotificationTracings.length == 0 && fleetNotificationThirdpartyTracings.length == 0 && clubServiceRequestTracings.length == 0){ return { status: false, code: 404, message: 'Tracing not found.' }; }
    return {
        status: true,
        fleetNotificationTracings: fleetNotificationTracings,
        fleetNotificationThirdpartyTracings: fleetNotificationThirdpartyTracings,
        clubServiceRequestTracings: clubServiceRequestTracings
    }
}

module.exports = router;