const router = require('express').Router();
const helper = require('../../../helpers/helper');
const db = require('../../../data/db');

router.route('/api/search/club-permission').post((req, res) => {
    if(!req.header('Authorization')){
        res.status(400).json({ data: { status: false, code: 400, message: 'Required authorization header not found.' } });
        return;
    }
    let validateSchema = helper.validateSchema('api', 'permission', req.body, 'searchSecurityApiClubPermissionSchema');
    if(validateSchema.error){ 
        res.status(400).json({ data: { status: false, code: 400, message: validateSchema.error.details[0].message } });
        return;
    }
    operationSearchClubPermission(req.header('Authorization'), req.body).then((result) => {
        if(!result.status){
            res.status(result.code).json({ data: result });
            return;
        }
        res.json({ data: result });
    }).catch((err) => {
        res.status(500).json({ data: { status: false, code: 500, message: err.message, hint: 'operationSearchClubPermission' } });
    });
});

const operationSearchClubPermission = async(authHeader, requestBody) => {
    if(!helper.validateAuthorizationToken(authHeader)){ return { status: false, code: 401, condition: 'token-expired', expired: true }; }
    let searchData = {
        cpais: requestBody.cpais,
        ccompania: requestBody.ccompania,
        crolclub: requestBody.crolclub,
    }
    let searchClubPermission = await db.searchClubPermissionQuery(searchData).then((res) => res);
    if(searchClubPermission.error){ return { status: false, code: 500, message: searchClubPermission.error }; }
    if(searchClubPermission.result.rowsAffected == 0){ return { status: false, code: 404, message: 'Club Permission not found.' }; }
    let jsonList = [];
    for(let i = 0; i < searchClubPermission.result.recordset.length; i++){
        let submenus = [];
        let getSubMenusData = await db.getClubMenuSubMenusDataQuery(searchClubPermission.result.recordset[i].CMENUCLUB).then((res) => res);
        if(getSubMenusData.error){ return { status: false, code: 500, message: getSubMenusData.error }; }
        if(getSubMenusData.result.rowsAffected > 0){
            for(let i = 0; i < getSubMenusData.result.recordset.length; i++){
                let submenu = {
                    csubmenuclub: getSubMenusData.result.recordset[i].CSUBMENUCLUB,
                    xsubmenuclub: getSubMenusData.result.recordset[i].XSUBMENUCLUB,
                    xcomponente: getSubMenusData.result.recordset[i].XCOMPONENTE,
                    xcontenido: getSubMenusData.result.recordset[i].XCONTENIDO,
                    bactivo: getSubMenusData.result.recordset[i].BACTIVO
                }
                submenus.push(submenu);
            }
        } 
        jsonList.push({
            cmenuclub: searchClubPermission.result.recordset[i].CMENUCLUB,
            xmenuclub: searchClubPermission.result.recordset[i].XMENUCLUB,
            xcomponente: searchClubPermission.result.recordset[i].XCOMPONENTE,
            xcontenido: searchClubPermission.result.recordset[i].XCONTENIDO,
            bsubmenu: searchClubPermission.result.recordset[i].BSUBMENU,
            bactivo: searchClubPermission.result.recordset[i].BACTIVO,
            submenus: submenus
        });
    }
    return { status: true, list: jsonList };
}

module.exports = router;