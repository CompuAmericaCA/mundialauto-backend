const crypto = require('crypto');
const jwt = require('jwt-simple');
const moment = require('moment');
const algorithm = 'aes-256-cbc';
const key = process.env.KEY;
const jsonTokenSecret = process.env.JSONSECRET;


module.exports = {
    validateRequestObj: (reqObj, validationArray) => {
        let status = true;
        for(let i = 0; i < validationArray.length; i++){
            if(!reqObj.hasOwnProperty(validationArray[i])){ status = false; }
        }
        return status;
    },
    encrypt: (data) => {
        /*let encrypted = '';
        if(data != null && data != ''){
            let cipher = crypto.createCipher(algorithm, key);
            encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
        }*/
        return data;//encrypted;
    },
    decrypt: (data) => {
        /*let decrypted = '';
        if(data != null && data != ''){
            let decipher = crypto.createDecipher(algorithm, key);
            decrypted = decipher.update(data, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }*/
        return data;//decrypted;
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
    generateJsonWebToken(cusuario) {
        let expires = moment().add(1, 'days').valueOf();
        let id = this.generateSecurityToken(15);
        let token = jwt.encode({
            id: id,
            iss: cusuario,
            exp: expires
        }, jsonTokenSecret);
        return { token: token, expires: expires };
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
    } 
}