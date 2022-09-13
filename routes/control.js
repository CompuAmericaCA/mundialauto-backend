const router = require('express').Router();
const helper = require('../src/helper');
const bd = require('../src/bd');

router.route('/change-password-token-verification').post((req, res) => {
    operationChangePasswordTokenVerification(req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationChangePasswordTokenVerification' } });
    });
});

const operationChangePasswordTokenVerification = async(requestBody) => {
    if(!helper.validateRequestObj(requestBody, ['token'])){ return { status: false, code: 400, message: 'Required params not found.' }; }
    let token = requestBody.token;
    let query = await bd.verifyChangePasswordTokenQuery(token).then((res) => res);
    if(query.error){ return { status: false, code: 500, message: query.error }; }
    if(query.result.rowsAffected > 0){ return { status: true, cusuario: query.result.recordset[0].CUSUARIO }; }
    else{ return { status: false, code: 200 }; }
}

module.exports = router;