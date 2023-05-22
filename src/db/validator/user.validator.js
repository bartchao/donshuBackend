const Joi = require("joi");

module.exports.searchUserName = {
  query: Joi.object({
    search: Joi.string().required()
  })
};
module.exports.getById = {
  query: Joi.object({
    id: Joi.string().required()
  })
};

module.exports.getPosts = {
  query: Joi.object({
    isNeed: Joi.boolean().optional()
  })
};
module.exports.register = {
  body: Joi.object({
    gender: Joi.string().required(),
    birthday: Joi.date().required(),
    phone: Joi.string().regex(/^[0-9]{9,}$/).messages({ "string.pattern.base": "Phone number must have at least 9 digits." }).required(),
    hasUserTicket: Joi.boolean().required()
  })
};
