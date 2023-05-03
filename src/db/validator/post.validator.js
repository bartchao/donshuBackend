const Joi = require("joi");

module.exports.query = {
  query: Joi.object({
    search: Joi.string().optional(),
    isNeed: Joi.boolean().optional(),
    typeId: Joi.number().optional(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional()
  })
};
module.exports.getById = {
  query: Joi.object({
    postId: Joi.string().required()
  })
};
