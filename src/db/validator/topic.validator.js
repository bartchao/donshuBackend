const Joi = require("joi");

module.exports.getWithType = {
  query: Joi.object({
    typeId: Joi.number().optional()
  })
};
module.exports.getById = {
  query: Joi.object({
    topicId: Joi.number().required()
  })
};
module.exports.addTopic = {
  body: Joi.object({
    typeId: Joi.number().required(),
    topicName: Joi.string().required()
  })
};
