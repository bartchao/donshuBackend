const Joi = require("joi");

module.exports.getWithType = {
  body: Joi.object({
    typeId: Joi.number().required()
  })
};
module.exports.getById = {
  body: Joi.object({
    topicId: Joi.string().required()
  })
};
module.exports.addTopic = {
  body: Joi.object({
    typeId: Joi.number().required(),
    topicName: Joi.string().required()
  })
};
