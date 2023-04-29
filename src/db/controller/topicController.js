const Model = require("../model");
const { Topic, Post } = Model;
const errHandler = require("../../helper/errHandler");
const { responseWithData } = require("../../helper/response");

exports.getAll = (req, res, next) => {
  // #swagger.tags = ['Topic']

  Topic.findAll({ attributes: ["id", "topicName"] })
    .then(response => responseWithData(res, response))
    .catch(err => errHandler(err, res));
};
exports.getWithType = (req, res, next) => {
  // #swagger.tags = ['Topic']
  // #swagger.summary='取得Type中擁有的Topic'
  /* #swagger.requestBody = {
            required: false,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            typeId: {
                                type: "integer"
                            }
                        },
                        required: ["typeId"]
                    }
                }
              }
    } */
  const { typeId } = req.body;
  const isCreatedByUser = 0;
  Topic.findAll({ where: { typeId, isCreatedByUser }, attributes: ["id", "topicName"] })
    .then(response => {
      /* #swagger.responses[200] = {
                description: '回傳與該Type有關之Topic',
                schema: { $ref: "#/definitions/Topic" }
            } */
      responseWithData(res, response);
    })
    .catch(err => errHandler(err, res));
};
exports.addTopic = async (req, res, next) => {
  // #swagger.tags = ['Topic']
/* #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            typeId: {
                                type: "integer"
                            },
                            topicName: {
                              type: "string"
                            }
                        },
                        required: ["typeId","topicName"]
                    }
                }
              }
    } */
  const { body } = req;
  // role = 0 為管理員
  if (req.user.role === 0) {
    body.isCreatedByUser = false;
  } else {
    body.isCreatedByUser = true;
  }
  try {
    const [topic, created] = await Topic.findOrCreate({
      where: { typeId: body.typeId, topicName: body.topicName },
      defaults: {
        typeId: body.typeId,
        topicName: body.topicName,
        isCreatedByUser: body.isCreatedByUser
      }
    });
    responseWithData(res, topic);
  } catch (err) {
    errHandler(err, res);
  }
};

exports.deleteTopic = (req, res, next) => {
  // #swagger.tags = ['Topic']
  /* #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            topicId: {
                                type: "integer"
                            }
                        },
                        required: ["topicId"]
                    }
                }
              }
    } */
  const { topicId } = req.body;
  const limitDelete = [42, 43, 44, 45, 46, 47, 48];
  let canDelete = true;
  limitDelete.forEach(val => {
    if (topicId === val)canDelete = false;
  });
  if (req.user.role === 0 && canDelete) {
    Topic.findByPk(topicId)
      .then(async topic => {
        const otherTopicId = 41 + topic.typeId;
        await Post.update({ topicId: otherTopicId }, { where: { topicId } });
        return topic.destroy();
      })
      .then(result => responseWithData(res, result))
      .catch(err => errHandler(err, res));
  } else { errHandler(new errHandler.ForbiddenError(), res); }
};
