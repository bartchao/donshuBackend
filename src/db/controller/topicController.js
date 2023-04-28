const Model = require("../model");
const { Topic, Post } = Model;
const errHandler = require("../../util/errHandler");
const { successResponse } = require("../helper");
exports.getAll = (req, res, next) => {
  Topic.findAll({ attributes: ["id", "topicName"] })
    .then(response => successResponse(res, response))
    .catch(err => errHandler(err, res));
};
exports.getWithType = (req, res, next) => {
  const { typeId } = req.body;
  const isCreatedByUser = 0;
  Topic.findAll({ where: { typeId, isCreatedByUser }, attributes: ["id", "topicName"] })
    .then(response => {
      //      console.log(response);
      successResponse(res, response);
    })
    .catch(err => errHandler(err, res));
};
exports.addTopic = (req, res, next) => {
  const { body } = req;
  if (req.user.role === 0) {
    Topic.create(body)
      .then(result => successResponse(res, result))
      .catch(err => errHandler(err, res));
  } else { res.status(403).send({ message: "you are not adminstrator" }); }
};

exports.deleteTopic = (req, res, next) => {
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
      .then(result => successResponse(res, result))
      .catch(err => errHandler(err, res));
  } else { res.status(403).send({ message: "you are not adminstrator" }); }
};
