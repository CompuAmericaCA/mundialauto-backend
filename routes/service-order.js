const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const emailer = require('../src/emailer')

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchServiceOrder' } });
        });
    }
});

const operationSearchServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['corden'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let searchData = {
        corden: requestBody.corden ? requestBody.corden: undefined
    }
    let searchServiceOrder = await bd.searchServiceOrderQuery(searchData).then((res) => res);
    if(searchServiceOrder.error){ return { status: false, code: 500, message: searchServiceOrder.error }; }
    if(searchServiceOrder.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchServiceOrder.result.recordset.length; i++){
            jsonList.push({
                corden: searchServiceOrder.result.recordset[i].CORDEN,
                cservicio: searchServiceOrder.result.recordset[i].CSERVICIO,
                xservicio: searchServiceOrder.result.recordset[i].XSERVICIO,
                cnotificacion: searchServiceOrder.result.recordset[i].CNOTIFICACION,
                ccontratoflota: searchServiceOrder.result.recordset[i].CCONTRATOFLOTA,
                xnombre: searchServiceOrder.result.recordset[i].XNOMBRE,
                xapellido: searchServiceOrder.result.recordset[i].XAPELLIDO,
                xnombrealternativo: searchServiceOrder.result.recordset[i].XNOMBREALTERNATIVO,
                xapellidoalternativo: searchServiceOrder.result.recordset[i].XAPELLIDOALTERNATIVO,
                xdireccion: searchServiceOrder.result.recordset[i].XDIRECCION,
                xobservacion: searchServiceOrder.result.recordset[i].XOBSERVACION,
                xcliente: searchServiceOrder.result.recordset[i].XCLIENTE,
                fcreacion: searchServiceOrder.result.recordset[i].FCREACION
            });
        }
        return { status: true, list: jsonList };
    }else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
}

router.route('/create').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateServiceOrder' } });
        });
    }
});

const operationCreateServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cservicio', 'cnotificacion', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceOrderData = {
        cnotificacion: parseInt(requestBody.cnotificacion, 10),
        xobservacion: requestBody.xobservacion,
        xdanos: requestBody.xdanos,
        fajuste: requestBody.fajuste,
        xfecha: requestBody.xfecha,
        cservicio: parseInt(requestBody.cservicio, 10),
        cservicioadicional: parseInt(requestBody.cservicioadicional, 10),
        //cproveedor: parseInt(requestBody.cproveedor, 10)
    };
    //let verifyServiceOrderName = await bd.verifyServiceOrderNameToCreateQuery(serviceOrderData).then((res) => res);
    //if(verifyServiceOrderName.error){ return { status: false, code: 500, message: verifyServiceOrderName.error }; }
    let createServiceOrder = await bd.createServiceOrderQuery(serviceOrderData).then((res) => res);
    if(createServiceOrder.error){ return { status: false, code: 500, message: createServiceOrder.error }; }
    if(createServiceOrder.result.rowsAffected > 0){ return { status: true, corden: createServiceOrder.result.recordset[0].CORDEN }; }
    //else{ return { status: false, code: 500, message: 'Server Internal Error.', hint: 'createServiceOrder' };  }
    
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailServiceOrder' } })
        });
    }
});

const operationDetailServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['corden'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceOrderData = {
        corden: requestBody.corden
    };
    let getServiceOrderData = await bd.getServiceOrderDataQuery(serviceOrderData).then((res) => res);
    if(getServiceOrderData.error){ return { status: false, code: 500, message: getServiceOrderData.error }; }
    if(getServiceOrderData.result.rowsAffected > 0){
        return { 
            status: true,
            corden: getServiceOrderData.result.recordset[0].CORDEN,
            cservicio: getServiceOrderData.result.recordset[0].CSERVICIO,
            xservicio: getServiceOrderData.result.recordset[0].XSERVICIO,
            cservicioadicional: getServiceOrderData.result.recordset[0].CSERVICIOADICIONAL,
            xservicioadicional: getServiceOrderData.result.recordset[0].XSERVICIOADICIONAL,
            cproveedor: getServiceOrderData.result.recordset[0].CPROVEEDOR,
            xproveedor: getServiceOrderData.result.recordset[0].XNOMBREPROVEEDOR,
            xdireccionproveedor: getServiceOrderData.result.recordset[0].XDIRECCIONPROVEEDOR,
            xtelefonoproveedor: getServiceOrderData.result.recordset[0].XTELEFONOPROVEEDOR,
            cnotificacion: getServiceOrderData.result.recordset[0].CNOTIFICACION,
            fcreacion: getServiceOrderData.result.recordset[0].FCREACION,
            ccontratoflota: getServiceOrderData.result.recordset[0].CCONTRATOFLOTA,
            xdescripcionaccidente: getServiceOrderData.result.recordset[0].XDESCRIPCION,
            xdanos: getServiceOrderData.result.recordset[0].XDANOS,
            xfechadescripcion: getServiceOrderData.result.recordset[0].XFECHA,
            fajuste: getServiceOrderData.result.recordset[0].FAJUSTE,
            xnombre: getServiceOrderData.result.recordset[0].XNOMBRE,
            xapellido: getServiceOrderData.result.recordset[0].XAPELLIDO,
            xnombrealternativo: getServiceOrderData.result.recordset[0].XNOMBREALTERNATIVO,
            xapellidoalternativo: getServiceOrderData.result.recordset[0].XAPELLIDOALTERNATIVO,
            xobservacion: getServiceOrderData.result.recordset[0].XOBSERVACION,
            xcliente: getServiceOrderData.result.recordset[0].XCLIENTE,
            xnombrepropietario: getServiceOrderData.result.recordset[0].XNOMBREPROPIETARIO,
            xapellidopropietario: getServiceOrderData.result.recordset[0].XAPELLIDOPROPIETARIO,
            xdocidentidadpropietario: getServiceOrderData.result.recordset[0].XDOCIDENTIDAD,
            xtelefonocelularpropietario: getServiceOrderData.result.recordset[0].XTELEFONOCELULAR,
            xplaca: getServiceOrderData.result.recordset[0].XPLACA,
            fano: getServiceOrderData.result.recordset[0].FANO,
            xcolor: getServiceOrderData.result.recordset[0].XCOLOR,
            xmodelo: getServiceOrderData.result.recordset[0].XMODELO,
            xmarca: getServiceOrderData.result.recordset[0].XMARCA
        }
    }else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
}

router.route('/detail-popup').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailPopUpServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailPopUpServiceOrder' } })
        });
    }
});

const operationDetailPopUpServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceOrderData = {
        cnotificacion: requestBody.cnotificacion
    };
    let getServiceOrderData = await bd.getServiceOrderPopUpDataQuery(serviceOrderData).then((res) => res);
    if(getServiceOrderData.error){ return { status: false, code: 500, message: getServiceOrderData.error }; }
    if(getServiceOrderData.result.rowsAffected > 0){
        return { 
            status: true,
            corden: getServiceOrderData.result.recordset[0].CORDEN,
            cservicio: getServiceOrderData.result.recordset[0].CSERVICIO,
            xservicio: getServiceOrderData.result.recordset[0].XSERVICIO,
            cservicioadicional: getServiceOrderData.result.recordset[0].CSERVICIOADICIONAL,
            xservicioadicional: getServiceOrderData.result.recordset[0].XSERVICIOADICIONAL,
            cproveedor: getServiceOrderData.result.recordset[0].CPROVEEDOR,
            xproveedor: getServiceOrderData.result.recordset[0].XNOMBREPROVEEDOR,
            xdireccionproveedor: getServiceOrderData.result.recordset[0].XDIRECCIONPROVEEDOR,
            xtelefonoproveedor: getServiceOrderData.result.recordset[0].XTELEFONOPROVEEDOR,
            cnotificacion: getServiceOrderData.result.recordset[0].CNOTIFICACION,
            fcreacion: getServiceOrderData.result.recordset[0].FCREACION,
            ccontratoflota: getServiceOrderData.result.recordset[0].CCONTRATOFLOTA,
            xdescripcion: getServiceOrderData.result.recordset[0].XDESCRIPCION,
            xdanos: getServiceOrderData.result.recordset[0].XDANOS,
            xfecha: getServiceOrderData.result.recordset[0].XFECHA,
            fajuste: getServiceOrderData.result.recordset[0].FAJUSTE,
            xnombre: getServiceOrderData.result.recordset[0].XNOMBRE,
            xapellido: getServiceOrderData.result.recordset[0].XAPELLIDO,
            xnombrealternativo: getServiceOrderData.result.recordset[0].XNOMBREALTERNATIVO,
            xapellidoalternativo: getServiceOrderData.result.recordset[0].XAPELLIDOALTERNATIVO,
            xobservacion: getServiceOrderData.result.recordset[0].XOBSERVACION,
            xcliente: getServiceOrderData.result.recordset[0].XCLIENTE,
            xnombrepropietario: getServiceOrderData.result.recordset[0].XNOMBREPROPIETARIO,
            xapellidopropietario: getServiceOrderData.result.recordset[0].XAPELLIDOPROPIETARIO,
            xdocidentidad: getServiceOrderData.result.recordset[0].XDOCIDENTIDAD,
            xtelefonocelular: getServiceOrderData.result.recordset[0].XTELEFONOCELULAR,
            xplaca: getServiceOrderData.result.recordset[0].XPLACA,
            fano: getServiceOrderData.result.recordset[0].FANO,
            xcolor: getServiceOrderData.result.recordset[0].XCOLOR,
            xmodelo: getServiceOrderData.result.recordset[0].XMODELO,
            xmarca: getServiceOrderData.result.recordset[0].XMARCA
        }
    }else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
}

router.route('/update').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationUpdateService(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationUpdateService' } })
        });
    }
});

const operationUpdateService = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['corden', 'cservicio', 'cnotificacion', 'xobservacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let serviceOrderData = {
        corden: requestBody.corden,
        cservicio: requestBody.cservicio,
        cnotificacion: requestBody.cnotificacion,
        xobservacion: requestBody.xobservacion,
    };
    let verifyServiceOrderName = await bd.verifyServiceOrderNameToUpdateQuery(serviceOrderData).then((res) => res);
    if(verifyServiceOrderName.error){ return { status: false, code: 500, message: verifyServiceOrderName.error }; }
    if(verifyServiceOrderName.result.rowsAffected > 0){ return { status: false, code: 200, condition: 'service-order-name-already-exist'}; }
    else{
        let updateServiceOrder = await bd.updateServiceOrderQuery(serviceOrderData).then((res) => res);
        if(updateServiceOrder.error){ return { status: false, code: 500, message: updateServiceOrder.error }; }
        if(updateServiceOrder.result.rowsAffected > 0){ return { status: true, corden: serviceOrderData.corden }; }
        else{ return { status: false, code: 404, message: 'Service Order not found.' }; }
    }
}

router.route('/notification').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotification(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotification' } });
        });
    }
});

const operationValrepNotification = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cnotificacion = requestBody.cnotificacion;
    let query = await bd.notificationDetailQuery(cnotificacion).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    //for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ cnotificacion: query.result.recordset[0].CNOTIFICACION, ccontratoflota: query.result.recordset[0].CCONTRATOFLOTA, xnombre: query.result.recordset[0].XNOMBRE, xapellido: query.result.recordset[0].XAPELLIDO, xnombrealternativo: query.result.recordset[0].XNOMBREALTERNATIVO, xapellidoalternativo: query.result.recordset[0].XAPELLIDOALTERNATIVO, fcreacion: query.result.recordset[0].FCREACION, xmarca: query.result.recordset[0].XMARCA });
    //}
    return { status: true, list: jsonArray }
}

router.route('/notification-service-order').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationServiceOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotificationServiceOrder' } });
        });
    }
});

const operationValrepNotificationServiceOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cnotificacion', 'corden'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cnotificacion = requestBody.cnotificacion;
    let corden = requestBody.corden;
    let query = await bd.notificationServiceOrderDetailQuery(cnotificacion, corden).then((res) => res);
    if(query.error){ console.log(query.error);return { status: false, code: 500, message: query.error }; }
    let jsonArray = [];
    let auto;
    for(let i = 0; i < query.result.recordset.length; i++){
        if(query.result.recordset[0].XCOLOR){
            auto = query.result.recordset[0].XMARCA + ' ' + query.result.recordset[0].XMODELO + ' ' + query.result.recordset[0].XVERSION + ' ' + query.result.recordset[0].XCOLOR;
        }else{
            auto = query.result.recordset[0].XMARCA + ' ' + query.result.recordset[0].XMODELO + ' ' + query.result.recordset[0].XVERSION;
        }

        if(query.result.recordset[0].XAPELLIDOALTERNATIVO){
            let nombresalternativos;
            nombresalternativos = query.result.recordset[0].XNOMBREALTERNATIVO + ' ' + query.result.recordset[0].XAPELLIDOALTERNATIVO;
        }else if(query.result.recordset[0].XNOMBREALTERNATIVO){
            nombresalternativos = query.result.recordset[0].XNOMBREALTERNATIVO;
        }else{
            nombresalternativos = 'NO EXISTEN NOMBRES DE ALTERNATIVOS'
        }

        let nombres = query.result.recordset[0].XNOMBRE + ' ' + query.result.recordset[0].XAPELLIDO;
        
        if(query.result.recordset[0].XNOMBREPROPIETARIO == query.result.recordset[0].XAPELLIDOPROPIETARIO){
            let nombrespropietario
            nombrespropietario = query.result.recordset[0].XNOMBREPROPIETARIO
        }else{
            nombrespropietario = query.result.recordset[0].XNOMBREPROPIETARIO + ' ' + query.result.recordset[0].XAPELLIDOPROPIETARIO
        }

        jsonArray.push({ cnotificacion: query.result.recordset[0].CNOTIFICACION, 
                         ccontratoflota: query.result.recordset[0].CCONTRATOFLOTA, 
                         xnombre: query.result.recordset[0].XNOMBRE, 
                         xapellido: query.result.recordset[0].XAPELLIDO, 
                         xnombrealternativo: query.result.recordset[0].XNOMBREALTERNATIVO, 
                         xapellidoalternativo: query.result.recordset[0].XAPELLIDOALTERNATIVO, 
                         fcreacion: query.result.recordset[0].FCREACION, 
                         xobservacion: query.result.recordset[0].XOBSERVACION, 
                         xdanos: query.result.recordset[0].XDANOS, 
                         xfecha: query.result.recordset[0].XFECHA, 
                         fajuste: query.result.recordset[0].FAJUSTE, 
                         xmarca: query.result.recordset[0].XMARCA, 
                         xdescripcion: query.result.recordset[0].XDESCRIPCION, 
                         xnombrepropietario: query.result.recordset[0].XNOMBREPROPIETARIO, 
                         xapellidopropietario: query.result.recordset[0].XAPELLIDOPROPIETARIO, 
                         xdocidentidad: query.result.recordset[0].XDOCIDENTIDADPROPIETARIO, 
                         xtelefonocelular: query.result.recordset[0].XTELEFONOPROPIETARIO, 
                         xplaca: query.result.recordset[0].XPLACA, 
                         xcolor: query.result.recordset[0].XCOLOR, 
                         xmodelo: query.result.recordset[0].XMODELO, 
                         xcliente: query.result.recordset[0].XCLIENTE, 
                         fano: query.result.recordset[0].FANO, 
                         cservicio: query.result.recordset[0].CSERVICIO, 
                         corden: query.result.recordset[0].CORDEN, 
                         cproveedor: query.result.recordset[0].CPROVEEDOR, 
                         xdireccionproveedor: query.result.recordset[0].XDIRECCIONPROVEEDOR, 
                         xnombreproveedor: query.result.recordset[0].XNOMBREPROVEEDOR, 
                         cservicioadicional: query.result.recordset[0].CSERVICIOADICIONAL, 
                         xservicioadicional: query.result.recordset[0].XSERVICIOADICIONAL, 
                         xdocumentocliente: query.result.recordset[0].XDOCIDENTIDADCLIENTE, 
                         xdireccionfiscal: query.result.recordset[0].XDIRECCIONFISCAL, 
                         xtelefono: query.result.recordset[0].XTELEFONO, 
                         xtelefonoproveedor: query.result.recordset[0].XTELEFONOPROVEEDOR, 
                         xdocumentoproveedor: query.result.recordset[0].XDOCUMENTOPROVEEDOR, 
                         xservicio: query.result.recordset[0].XSERVICIO, 
                         xdesde: query.result.recordset[0].XDESDE, 
                         xhacia: query.result.recordset[0].XHACIA, 
                         mmonto: query.result.recordset[0].MMONTO, 
                         mmontototal: query.result.recordset[0].MMONTOTOTAL, 
                         pimpuesto: query.result.recordset[0].PIMPUESTO, 
                         mmontototaliva: query.result.recordset[0].MMONTOTOTALIVA,
                         mmontototaliva: query.result.recordset[0].MMONTOTOTALIVA, 
                         cmoneda: query.result.recordset[0].CMONEDA ,
                         xmoneda: query.result.recordset[0].xmoneda, 
                         bactivo: query.result.recordset[0].BACTIVO, 
                         cestatusgeneral: query.result.recordset[0].CESTATUSGENERAL, 
                         xestatusgeneral: query.result.recordset[0].XESTATUSGENERAL, 
                         ccausaanulacion: query.result.recordset[0].CCAUSAANULACION, 
                         xcausaanulacion: query.result.recordset[0].XCAUSAANULACION,
                         xauto: auto,
                         xnombres: nombres,
                         xnombresalternativos: nombresalternativos,
                         xnombrespropietario: nombrespropietario});
    }
    return { status: true, list: jsonArray }
}

router.route('/notification-order').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } })
        return;
    }else{
        operationValrepNotificationOrder(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){ 
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationValrepNotificationOrder' } });
        });
    }
});

const operationValrepNotificationOrder = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    if(!helper.validateRequestObj(requestBody, ['cnotificacion'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let cnotificacion = requestBody.cnotificacion;
    let query = await bd.notificationOrderDetailQuery(cnotificacion).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }

    if(query.result.recordset[0].XCOLOR){
        let auto;
        auto = query.result.recordset[0].XMARCA + ' ' + query.result.recordset[0].XMODELO + ' ' + query.result.recordset[0].XVERSION + ' ' + query.result.recordset[0].XCOLOR;
    }else{
        auto = query.result.recordset[0].XMARCA + ' ' + query.result.recordset[0].XMODELO + ' ' + query.result.recordset[0].XVERSION;
    }
    let nombresalternativos;
    if(query.result.recordset[0].XAPELLIDOALTERNATIVO){
        
        nombresalternativos = query.result.recordset[0].XNOMBREALTERNATIVO + ' ' + query.result.recordset[0].XAPELLIDOALTERNATIVO;
    }else if(query.result.recordset[0].XNOMBREALTERNATIVO){
        nombresalternativos = query.result.recordset[0].XNOMBREALTERNATIVO;
    }else{
        nombresalternativos = 'NO EXISTEN NOMBRES DE ALTERNATIVOS'
    }

    let nombres = query.result.recordset[0].XNOMBRE + ' ' + query.result.recordset[0].XAPELLIDO;
    
    if(query.result.recordset[0].XNOMBREPROPIETARIO == query.result.recordset[0].XAPELLIDOPROPIETARIO){
        let nombrespropietario
        nombrespropietario = query.result.recordset[0].XNOMBREPROPIETARIO
    }else{
        nombrespropietario = query.result.recordset[0].XNOMBREPROPIETARIO + ' ' + query.result.recordset[0].XAPELLIDOPROPIETARIO
    }
    let jsonArray = [];
    console.log(query.result.recordset[0].ccarga)
    //for(let i = 0; i < query.result.recordset.length; i++){
        jsonArray.push({ 
                        cnotificacion: query.result.recordset[0].CNOTIFICACION, 
                        ccontratoflota: query.result.recordset[0].CCONTRATOFLOTA, 
                        xnombre: query.result.recordset[0].XNOMBRE, 
                        xapellido: query.result.recordset[0].XAPELLIDO, 
                        xnombrealternativo: query.result.recordset[0].XNOMBREALTERNATIVO, 
                        xapellidoalternativo: query.result.recordset[0].XAPELLIDOALTERNATIVO, 
                        fcreacion: query.result.recordset[0].FCREACION, 
                        xmarca: query.result.recordset[0].XMARCA, 
                        xdescripcion: query.result.recordset[0].XDESCRIPCION, 
                        xfecha: query.result.recordset[0].XFECHA, 
                        xnombrepropietario: query.result.recordset[0].XNOMBREPROPIETARIO, 
                        xapellidopropietario: query.result.recordset[0].XAPELLIDOPROPIETARIO, 
                        xapellidopropietario: query.result.recordset[0].XAPELLIDOPROPIETARIO, 
                        xdocidentidad: query.result.recordset[0].XDOCIDENTIDADPROPIETARIO, 
                        xtelefonocelular: query.result.recordset[0].XTELEFONOCELULAR, 
                        xplaca: query.result.recordset[0].XPLACA, 
                        xcolor: query.result.recordset[0].XCOLOR, 
                        xmodelo: query.result.recordset[0].XMODELO, 
                        xcliente: query.result.recordset[0].XCLIENTE, 
                        fano: query.result.recordset[0].FANO, 
                        xdocumentocliente: query.result.recordset[0].XDOCIDENTIDADCLIENTE, 
                        xdireccionfiscal: query.result.recordset[0].XDIRECCIONFISCAL, 
                        xtelefono: query.result.recordset[0].XTELEFONO,
                        xauto: auto,
                        xnombres: nombres,
                        xnombresalternativos: nombresalternativos,
                        xnombrespropietario: nombrespropietario,
                        ccarga: query.result.recordset[0].ccarga });
    //}
    return { status: true, list: jsonArray }
}

router.route('/tax').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailTax(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailTax' } });
        });
    }
});

const operationDetailTax = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    //if(!helper.validateRequestObj(requestBody, ['cpais','cimpuesto'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    
    let cimpuesto = requestBody.cimpuesto;
    
    let getTaxData = await bd.getTaxDataQuery(cimpuesto).then((res) => res);
    if(getTaxData.error){ return { status: false, code: 500, message: getTaxData.error }; }
    if(getTaxData.result.rowsAffected > 0){
        getTaxConfigurationData = await bd.getTaxConfigurationDataQuery(cimpuesto).then((res) => res);
        if(getTaxConfigurationData.error){ return { status: false, code: 500, message: getTaxConfigurationData.error }; }
        if(getTaxConfigurationData.result.rowsAffected > 0){
            return {
                status: true,
                cimpuesto: getTaxData.result.recordset[0].CIMPUESTO,
                pimpuesto: getTaxConfigurationData.result.recordset[0].PIMPUESTO,
                bactivo: getTaxData.result.recordset[0].BACTIVO
            }
        }else{
            return {
                status: true,
                cimpuesto: getTaxData.result.recordset[0].CIMPUESTO,
                ximpuesto: getTaxData.result.recordset[0].XIMPUESTO,
                bactivo: getTaxData.result.recordset[0].BACTIVO
            }
        }
    }else{ return { status: false, code: 404, message: 'Tax not found.' }; }
}

module.exports = router;