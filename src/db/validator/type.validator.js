const Joi = require("joi");

module.exports.searchUserName = {
  body: Joi.object({
    search: Joi.string().required()
  })
};
module.exports.getById = {
  body: Joi.object({
    id: Joi.number().required()
  })
};
module.exports.getOtherUserPosts = {
  body: Joi.object({
    id: Joi.number().required(),
    isNeed: Joi.boolean().required()
  })
};
module.exports.getPosts = {
  body: Joi.object({
    isNeed: Joi.boolean().required()
  })
};
module.exports.register = {
  body: Joi.object({
    gender: Joi.string().required(),
    birthday: Joi.date().required(),
    phone: Joi.string().regex(/^[0-9]{9}$/).messages({ "string.pattern.base": "Phone number must have 9 digits." }).required(),
    hasUserTicket: Joi.boolean().required()
  })
};
