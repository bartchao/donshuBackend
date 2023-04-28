const Joi = require("joi");

module.exports.getAllWithType = {
  body: Joi.object({
    typeId: Joi.number().required(),
    isNeed: Joi.boolean().required()
  })
};
module.exports.query = {
  body: Joi.object({
    search: Joi.string().required(),
    isNeed: Joi.boolean().required()
  })
};
module.exports.getLimitWithType = {
  body: Joi.object({
    typeId: Joi.number().required(),
    isNeed: Joi.boolean().required(),
    offset: Joi.number().required(),
    limit: Joi.number().required()
  })
};
module.exports.getById = {
  body: Joi.object({
    postId: Joi.number().required()
  })
};
