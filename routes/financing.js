const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

router.route('/info-propietary').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchInfoPropietary(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchInfoPropietary' } });
        });
    }
});

const operationSearchInfoPropietary = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpropietario: requestBody.cpropietario,
        cvehiculopropietario: requestBody.cvehiculopropietario
    };
    let searchInfoPropietary = await bd.searchInfoPropietaryQuery(searchData).then((res) => res);
    if(searchInfoPropietary.error){ return  { status: false, code: 500, message: searchInfoPropietary.error }; }
    if(searchInfoPropietary.result.rowsAffected > 0){
        return { 
            status: true, 
            xdocidentidad: searchInfoPropietary.result.recordset[0].XDOCIDENTIDAD,
            xtelefono: searchInfoPropietary.result.recordset[0].XTELEFONOCASA,
            xemail: searchInfoPropietary.result.recordset[0].XEMAIL,
            xmodelo: searchInfoPropietary.result.recordset[0].XMODELO + ' ' + searchInfoPropietary.result.recordset[0].XVERSION
        };
    }
}

router.route('/provider-financing').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchProvider(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchProvider' } });
        });
    }
});

const operationSearchProvider = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cservicio: requestBody.cservicio,
        cestado: requestBody.cestado,
    };
    let searchProvider = await bd.searchProviderFinancingQuery(searchData).then((res) => res);
    if(searchProvider.error){ return  { status: false, code: 500, message: searchProvider.error }; }
    if(searchProvider.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchProvider.result.recordset.length; i++){
            jsonList.push({
                cproveedor: searchProvider.result.recordset[i].CPROVEEDOR,
                xproveedor: searchProvider.result.recordset[i].XNOMBRE,
                xtelefono: searchProvider.result.recordset[i].XTELEFONO,
                cservicio: searchProvider.result.recordset[i].CSERVICIO,
                xservicio: searchProvider.result.recordset[i].XSERVICIO,
            })
        }
        return { status: true, list: jsonList };
    }else{ return {status: false, code: 404, message: "No se encontraron proveedores para el servicio seleccionado"} }
}

router.route('/create-financing').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCreateFinancing(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCreateFinancing' } });
        });
    }
});

const operationCreateFinancing = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let financing = {
        cpropietario: requestBody.cpropietario,
        xvehiculo: requestBody.xvehiculo,
        cvehiculopropietario: requestBody.cvehiculopropietario,
        mmonto_cartera: requestBody.mmonto_cartera,
        cestado: requestBody.cestado,
        cservicio: requestBody.cservicio,
        cusuario: requestBody.cusuario,
    };
    let cfinanciamiento = 0;
    let createFinancing = await bd.createFinancingQuery(financing).then((res) => res);
    if(createFinancing.error){ return  { status: false, code: 500, message: createFinancing.error }; }
    if(createFinancing.result.rowsAffected > 0){
        let searchCodeFinancing = await bd.searchCodeFinancingQuery().then((res) => res);
        if(searchCodeFinancing.result.rowsAffected > 0){
            cfinanciamiento = searchCodeFinancing.result.recordset[0].CFINANCIAMIENTO
            if(requestBody.proveedores){
                let insertProviderFinancing = await bd.insertProviderFinancingQuery(cfinanciamiento, requestBody.proveedores, financing).then((res) => res);
                if(insertProviderFinancing.error){ return  { status: false, code: 500, message: insertProviderFinancing.error }; }
            }
            if (requestBody.financiamiento) {
                for (let i = 0; i < requestBody.financiamiento.length; i++) {
                    const fechaCuota = requestBody.financiamiento[i].fechaCuota;
                    const partesFecha = fechaCuota.split('/');
                    const fechaDatetime = new Date(
                        partesFecha[2], 
                        partesFecha[1] - 1, 
                        partesFecha[0]
                    );
                    requestBody.financiamiento[i].fechaCuota = fechaDatetime;
                    
                    const xmonto_financiado = parseFloat(requestBody.financiamiento[i].xmonto_financiado);
                    requestBody.financiamiento[i].xmonto_financiado = xmonto_financiado;
                }

                let insertFinancingCuotes = await bd.insertFinancingCuotesQuery(cfinanciamiento, requestBody.financiamiento, financing).then((res) => res);
                if (insertFinancingCuotes.error) {return { status: false, code: 500, message: insertFinancingCuotes.error }}
                return { status: true, code: 200, message: "El financiamiento ha sido exitosamente creado y registrado en el sistema. " };
            }
        }
    }else{ return {status: false, code: 404, message: "No se encontraron proveedores para el servicio seleccionado"} }
}

router.route('/propietary-bangente').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationPropietarySendExcel(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationPropietarySendExcel' } });
        });
    }
});

const operationPropietarySendExcel = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
     let cpropietario = requestBody.cpropietario
     let propietaryObject = {};
    let searchPropietary = await bd.searchPropietaryFromExcelQuery(cpropietario).then((res) => res);
    if(searchPropietary.error){ return  { status: false, code: 500, message: searchPropietary.error }; }
    if(searchPropietary.result.rowsAffected > 0){
        for(let i = 0; i < searchPropietary.result.recordset.length; i++){
            propietaryObject = {
                cpropietario: searchPropietary.result.recordset[i].CPROPIETARIO,
                xnombre: searchPropietary.result.recordset[i].XNOMBRE,
                xapellido: searchPropietary.result.recordset[i].XAPELLIDO,
                xdocidentidad: searchPropietary.result.recordset[i].XDOCIDENTIDAD,
                xdireccion: searchPropietary.result.recordset[i].XDIRECCION,
                xtelefono: searchPropietary.result.recordset[i].XTELEFONOCASA,
                xcorreo: searchPropietary.result.recordset[i].XEMAIL,
                xpais: searchPropietary.result.recordset[i].XPAIS,
                xestado: searchPropietary.result.recordset[i].XESTADO,
                xciudad: searchPropietary.result.recordset[i].XCIUDAD,
                icedula: searchPropietary.result.recordset[i].ICEDULA,
            }
        }
        const emailSent = await sendEmailWithAttachment(propietaryObject);
        if (emailSent) {
            return { status: true, code: 200 };
          } else {
            return { status: false, code: 500, message: 'Error al enviar el correo' };
        }
    }
}

const sendEmailWithAttachment = async (propietaryObject) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'alenjhon9@gmail.com',
                  pass: 'nnvwygxnvdpjegbj'
                }
            });
      
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Datos de Propietario');
            
            worksheet.columns = [
              { header: 'Código de Propietario', key: 'cpropietario' },
              { header: 'Nombre', key: 'xnombre' },
              { header: 'Apellido', key: 'xapellido' },
              { header: 'Doc. Identidad', key: 'icedula' },
              { header: 'Cédula', key: 'xdocidentidad' },
              { header: 'Dirección', key: 'xdireccion' },
              { header: 'Teléfono', key: 'xtelefono' },
              { header: 'Correo', key: 'xcorreo' },
              { header: 'Pais', key: 'xpais' },
              { header: 'Estado', key: 'xestado' },
              { header: 'Ciudad', key: 'xciudad' },
            ];
        
            worksheet.addRow(propietaryObject);
        
            const buffer = await workbook.xlsx.writeBuffer();
      
            const mailOptions = {
              from: 'alenjhon9@gmail.com',
              to: 'alenjhon9@gmail.com',
              subject: 'Datos de Propietario',
              text: 'Un cordial saludo.\n\n' +
              `Nos complace informarle que los datos del propietario ${propietaryObject.xnombre} ${propietaryObject.xapellido} de La Mundial de Seguros han sido preparados para la apertura de una cuenta corriente en Bangente. Adjuntamos el archivo Excel con la información detallada.\n\n` +
              'Si necesita alguna aclaración adicional o asistencia, no dude en ponerse en contacto con nuestro equipo de atención al cliente. Estamos aquí para brindarle el mejor servicio y apoyo.\n\n' +
              'Agradecemos su confianza en nuestros servicios y esperamos que esta iniciativa sea el comienzo de una fructífera colaboración.\n\n' +
              'Atentamente\n\n' + 
              'La Mundial de Seguros',
              attachments: [
                {
                  filename: 'Propietario La Mundial de Seguros.xlsx',
                  content: buffer,
                },
              ],
            };
        
            transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {
                console.log('Error al enviar el correo electrónico:', error);
                reject(error); // Rechazar la promesa en caso de error
              } else {
                console.log('Correo electrónico enviado:', info.response);
                // Aquí notificamos al frontend que el correo se envió exitosamente
                resolve(true); // Resolvemos la promesa en caso de éxito
              }
            });
          } catch (error) {
              console.error('Error al crear el archivo Excel:', error);
              reject(error); // Rechazar la promesa en caso de error
        }
    })
}

router.route('/search').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationSearchBeneficiary(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchBeneficiary' } });
        });
    }
});

const operationSearchBeneficiary = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpropietario: requestBody.cpropietario,
    };
    console.log(searchData)
    let nombre;
    let mcuotas;
    let xvehiculo;
    let searchBeneficiary = await bd.searchBeneficiaryFinancingQuery(searchData).then((res) => res);
    if(searchBeneficiary.error){ return  { status: false, code: 500, message: searchBeneficiary.error }; }
    if(searchBeneficiary.result.rowsAffected > 0){
        let jsonList = [];
        for(let i = 0; i < searchBeneficiary.result.recordset.length; i++){
            if(searchBeneficiary.result.recordset[i].XNOMBRE && searchBeneficiary.result.recordset[i].XAPELLIDO){
                nombre = searchBeneficiary.result.recordset[i].XNOMBRE + ' ' + searchBeneficiary.result.recordset[i].XAPELLIDO;
            }else{
                nombre = searchBeneficiary.result.recordset[i].XNOMBRE;
            }

            if(searchBeneficiary.result.recordset[i].MMONTO_CUOTA){
                mcuotas = searchBeneficiary.result.recordset[i].MMONTO_CUOTA + '$' + ' c/u';
            }

            if(searchBeneficiary.result.recordset[i].XMARCA && searchBeneficiary.result.recordset[i].XMODELO && searchBeneficiary.result.recordset[i].XVERSION){
                xvehiculo = searchBeneficiary.result.recordset[i].XMARCA + ' ' + searchBeneficiary.result.recordset[i].XMODELO + ' ' + searchBeneficiary.result.recordset[i].XVERSION;
            }
            else if(searchBeneficiary.result.recordset[i].XMARCA && searchBeneficiary.result.recordset[i].XMODELO){
                xvehiculo = searchBeneficiary.result.recordset[i].XMARCA + ' ' + searchBeneficiary.result.recordset[i].XMODELO
            }
            else{
                xvehiculo = searchBeneficiary.result.recordset[i].XMARCA
            }

            jsonList.push({
                cfinanciamiento: searchBeneficiary.result.recordset[i].CFINANCIAMIENTO,
                xnombre: nombre,
                xvehiculo: xvehiculo,
                ncuotas: searchBeneficiary.result.recordset[i].NCUOTAS,
                mmonto: mcuotas,
            })
        }
        return { status: true, list: jsonList };
    }else{ return {status: false, code: 404, message: "No se encontraron proveedores para el servicio seleccionado"} }
}

router.route('/detail').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailFinancing(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailFinancing' } });
        });
    }
});

const operationDetailFinancing = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cfinanciamiento: requestBody.cfinanciamiento,
    };
    let detailFinancing = await bd.detailFinancingQuery(searchData).then((res) => res);
    if(detailFinancing.error){ return  { status: false, code: 500, message: detailFinancing.error }; }
    if(detailFinancing.result.rowsAffected > 0){
        const marca = detailFinancing.result.recordset[0].XMARCA.charAt(0).toUpperCase() + detailFinancing.result.recordset[0].XMARCA.slice(1).toLowerCase();
        const modelo = detailFinancing.result.recordset[0].XMODELO.charAt(0).toUpperCase() + detailFinancing.result.recordset[0].XMODELO.slice(1).toLowerCase();
        const version = detailFinancing.result.recordset[0].XVERSION.charAt(0).toUpperCase() + detailFinancing.result.recordset[0].XVERSION.slice(1).toLowerCase();
        let nombreCompleto;
        let xvehiculo;
        let xcedula;
        let jsonList = [];
        for(let i = 0; i < detailFinancing.result.recordset.length; i++){
            let dateFormatVenci = detailFinancing.result.recordset[i].FVENCIMIENTO.toJSON().slice(0,10).split('-');
            let fvencimiento = dateFormatVenci[2] + '/' + dateFormatVenci[1] + '/' + dateFormatVenci[0];
            jsonList.push({
                cuotas: 'Cuota N°' + detailFinancing.result.recordset[i].NCUOTAS,
                ncuotas: detailFinancing.result.recordset[i].NCUOTAS,
                fvencimiento: fvencimiento,
                mmonto_cuota: detailFinancing.result.recordset[i].MMONTO_CUOTA,
            })
        }
        if(detailFinancing.result.recordset[0].XNOMBRE && detailFinancing.result.recordset[0].XAPELLIDO){
            const nombre = detailFinancing.result.recordset[0].XNOMBRE.charAt(0).toUpperCase() + detailFinancing.result.recordset[0].XNOMBRE.slice(1).toLowerCase();
            const apellido = detailFinancing.result.recordset[0].XAPELLIDO.charAt(0).toUpperCase() + detailFinancing.result.recordset[0].XAPELLIDO.slice(1).toLowerCase();
            nombreCompleto = nombre + ' ' + apellido;;
        }else{
            nombreCompleto = detailFinancing.result.recordset[0].XNOMBRE;
        }

        if(detailFinancing.result.recordset[0].XMARCA && detailFinancing.result.recordset[0].XMODELO && detailFinancing.result.recordset[0].XVERSION){
            xvehiculo = marca + ' ' + modelo + ' ' + version
        }
        else if(detailFinancing.result.recordset[0].XMARCA && detailFinancing.result.recordset[0].XMODELO){
            xvehiculo = marca + ' ' + modelo
        }
        else{
            xvehiculo = marca
        }

        if(detailFinancing.result.recordset[0].ICEDULA && detailFinancing.result.recordset[0].XDOCIDENTIDAD){
            xcedula = detailFinancing.result.recordset[0].ICEDULA + '-' + detailFinancing.result.recordset[0].XDOCIDENTIDAD
        }

        return { status: true, 
                 list: jsonList,
                 beneficiario: nombreCompleto,
                 cedula: xcedula,
                 telefono: detailFinancing.result.recordset[0].XTELEFONOCASA,
                 correo: detailFinancing.result.recordset[0].XEMAIL,
                 tipo: detailFinancing.result.recordset[0].XVEHICULO,
                 vehiculo: xvehiculo,
                 placa: detailFinancing.result.recordset[0].XPLACA,
                };
    }else{ return {status: false, code: 404, message: "No se encontraron proveedores para el servicio seleccionado"} }
}

router.route('/detail-provider').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationDetailProviderFinancing(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationDetailProviderFinancing' } });
        });
    }
});

const operationDetailProviderFinancing = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cfinanciamiento: requestBody.cfinanciamiento,
    };
    let detailProvider = await bd.detailProviderFinancingQuery(searchData).then((res) => res);
    if(detailProvider.error){ return  { status: false, code: 500, message: detailProvider.error }; }
    if(detailProvider.result.rowsAffected > 0){
        let repuesto;
        let jsonList = [];
        for(let i = 0; i < detailProvider.result.recordset.length; i++){
            const Proveedor = detailProvider.result.recordset[0].XNOMBRE.charAt(0).toUpperCase() + detailProvider.result.recordset[0].XNOMBRE.slice(1).toLowerCase();

            if(detailProvider.result.recordset[i].XREPUESTO){
                repuesto = detailProvider.result.recordset[i].XREPUESTO;
            }else{
                repuesto = 'Sin Repuestos';
            }

            jsonList.push({
                xproveedor: Proveedor,
                xestado: detailProvider.result.recordset[i].XESTADO,
                mprecio: detailProvider.result.recordset[i].MPRECIO,
                xservicio: detailProvider.result.recordset[i].XSERVICIO,
                xrepuesto: repuesto,
                ncantidad: detailProvider.result.recordset[i].NCANTIDAD,
            })
        }
        return { status: true, list: jsonList };
    }else{ return {status: false, code: 404, message: "No se encontraron proveedores para el servicio seleccionado"} }
}

router.route('/coutes').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }else{
        operationCuotesFinancing(req.header('Authorization'), req.body).then((result) => {
            if(!result.status){
                res.status(result.code).json({ data: result });
                return;
            }
            res.json({ data: result });
        }).catch((err) => {
            console.log(err.message)
            res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationCuotesFinancing' } });
        });
    }
});

const operationCuotesFinancing = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        ncuota: requestBody.ncuota,
        cfinanciamiento: requestBody.cfinanciamiento,
    };
    console.log(searchData)
    let updateCuotes = await bd.updateCuotesFinancingQuery(searchData).then((res) => res);
    if(updateCuotes.error){ return  { status: false, code: 500, message: updateCuotes.error }; }
    if(updateCuotes.result.rowsAffected > 0){ return { status: true, code: 200 };
    }
}

module.exports = router;