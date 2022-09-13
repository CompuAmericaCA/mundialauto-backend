const crypto = require('crypto');
const jwt = require('jwt-simple');
const moment = require('moment');
const algorithm = 'aes-256-cbc';
const key = process.env.KEY;
const jsonTokenSecret = process.env.JSONSECRET;


module.exports = {
    validateSchema: (type, module, reqObj, schemaName) => {
        let schema = require(`../data/schema/${ module }`);
        let validate = schema[type][schemaName].validate(reqObj);
        return validate;
    },
    encrypt: (data) => {/*
        let encrypted = '';
        if(data != null && data != ''){
            let cipher = crypto.createCipher(algorithm, key);
            encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
        }*/
        return data;
    },
    decrypt: (data) => {
        let decrypted = '';
        if(data != null && data != ''){
            let decipher = crypto.createDecipher(algorithm, key);
            decrypted = decipher.update(data, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }
        return decrypted;
    },
    validateAuthorizationToken: (authHeader) => {
        let authorizationData = authHeader.split(" ");
        if(authorizationData[0] == "Bearer"){
            try{
                let decoded = jwt.decode(authorizationData[1], jsonTokenSecret);
                if(decoded.exp <= Date.now()){
                    return false;
                }else{
                    return true;
                }
            }catch(err){
                return false;
            }
        }else{ return false; }
    },
    validateConsumerCredentials: (authHeader) => {
        try{
            authHeader = authHeader.split(" ");
            if(authHeader[0] == "Basic"){
                authHeader = authHeader[1];
                authHeader = Buffer.from(authHeader, 'base64').toString();
                let authorizationData = authHeader.split(":");
                return { user: authorizationData[0], password: authorizationData[1] }
            }else{ 
                return { error: "Bad authorization type." };
            }
        }
        catch(err) {
            return { error: err.message };
        }
    },
    generateSecurityToken: (size) => {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( var i = 0; i < size; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    generateJsonWebToken(issuer, type) {
        let expires = moment().add(1, 'days').valueOf();
        let id = this.generateSecurityToken(15);
        let token = jwt.encode({
            id: id,
            iss: issuer,
            type: type,
            exp: expires
        }, jsonTokenSecret);
        return { token: token, expires: expires };
    }
}