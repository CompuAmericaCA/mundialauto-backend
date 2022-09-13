const db = require('../data/db');

module.exports = {
    operationVerifyApiModulePermission: async(permissionData, permissionName) => {
        let validationData = {
            cconsumidor: permissionData.cconsumidor,
            cmodulo: permissionData.cmodulo,
            permissionName: permissionName
        };
        let validateApiModulePermission = await db.validateApiModulePermissionQuery(validationData).then((res) => res);
        if(validateApiModulePermission.error){ return { status: false, code: 500, message: validateApiModulePermission.error }; }
        if(validateApiModulePermission.result.rowsAffected > 0){
            if(validateApiModulePermission.result.recordset[0][validationData.permissionName] == true){ return { error: false }; }
            return { error: true };
        }else{ return { error: true }; }
    },
    operationVerifyProductionModulePermission: async(permissionData, permissionName) => {
        let validationData = {
            cusuario: permissionData.cusuario,
            cmodulo: permissionData.cmodulo,
            permissionName: permissionName
        };
        let validateModulePermission = await db.validateModulePermissionQuery(validationData).then((res) => res);
        if(validateModulePermission.error){ return { status: false, code: 500, message: validateModulePermission.error }; }
        if(validateModulePermission.result.rowsAffected > 0){
            if(validateModulePermission.result.recordset[0][validationData.permissionName] == true){ return { error: false }; }
            return { error: true };
        }else{ return { error: true }; }
    }
}