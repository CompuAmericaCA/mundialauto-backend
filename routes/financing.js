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
        sendEmailWithAttachment(propietaryObject);
    }
}

const sendEmailWithAttachment = async (propietaryObject) => {
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
        text: 'Adjuntamos los datos del propietario en formato Excel.',
        attachments: [
          {
            filename: 'propietario.xlsx',
            content: buffer,
          },
        ],
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo electrónico enviado:', info.response);
          return { status: true, code: 200 }
        }
      });
    } catch (error) {
      console.error('Error al crear el archivo Excel:', error);
    }
  };

module.exports = router;