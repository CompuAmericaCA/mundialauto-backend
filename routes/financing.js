const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

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

module.exports = router;