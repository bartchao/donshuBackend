const Joi = require("joi");
module.exports.updateComment = {
  body: Joi.object({
    id: Joi.number().required(),
    text: Joi.string().required()
  })
};
module.exports.deleteComment = {
  query: Joi.object({
    id: Joi.number().required()
  })
};
