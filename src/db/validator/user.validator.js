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
