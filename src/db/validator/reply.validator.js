const Joi = require("joi");
module.exports.updateReply = {
  body: Joi.object({
    id: Joi.number().required(),
    text: Joi.string().required()
  })
};
module.exports.deleteReply = {
  query: Joi.object({
    id: Joi.number().required()
  })
};
