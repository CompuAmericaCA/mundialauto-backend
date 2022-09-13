const joi = require('joi');
const validationSchema = require('./validation');

module.exports = {
    api: {
        searchSecurityApiClubPermissionSchema: joi.object({
            cpais: joi.number().required(),
            ccompania: joi.number().required(),
            crolclub: joi.string().required()
        })
    },
    production: {

    }
}