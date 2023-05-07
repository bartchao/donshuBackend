const Model = require("../model");
const { Topic, Post } = Model;
const { errHandler } = require("../../helper/errHandler");
const { responseWithData, successResponse } = require("../../helper/response");

exports.getWithType = (req, res, next) => {
  const { typeId } = req.query;
  const where = {};
  if (typeId !== undefined) {
    where.typeId = typeId;
  }
  Topic.findAll({ where, attributes: ["id", "topicName", "isCreatedByUser"] })
    .then(response => {
      responseWithData(res, response);
    })
    .catch(err => errHandler(err, res));
};
exports.addTopic = async (req, res, next) => {
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
  const { topicId } = req.query;
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
      .then(successResponse(res, "Delete topic success"))
      .catch(err => errHandler(err, res));
  } else { errHandler(new errHandler.ForbiddenError(), res); }
};
