const Joi = require("joi");

module.exports.getAllWithType = {
  query: Joi.object({
    typeId: Joi.number().required(),
    isNeed: Joi.boolean().required()
  })
};
module.exports.query = {
  query: Joi.object({
    search: Joi.string().required(),
    isNeed: Joi.boolean().optional(),
    typeId: Joi.number().optional(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional()
  })
};
module.exports.getLimitWithType = {
  query: Joi.object({
    typeId: Joi.number().required(),
    isNeed: Joi.boolean().required(),
    offset: Joi.number().required(),
    limit: Joi.number().required()
  })
};
module.exports.getById = {
  query: Joi.object({
    postId: Joi.string().required()
  })
};
