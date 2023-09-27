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
  };

module.exports = router;