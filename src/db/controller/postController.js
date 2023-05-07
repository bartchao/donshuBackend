const Op = require("sequelize").Op;
const Model = require("../model");
const { Post, File, Comment, Topic } = Model;

const checkValidDate = require("../../util/checkValidDate");
const { errHandler, ForbiddenError, NotFoundError } = require("../../helper/errHandler");

const { responseWithData, successResponse } = require("../../helper/response");
function preProcessData (body, user) {
  const { type, startDate, endDate } = body;
  delete body.createdAt;
  body.typeId = type.id; delete body.type;
  body.startDate = new Date(startDate);
  if (checkValidDate(body.startDate)) delete body.startDate;
  body.endDate = new Date(endDate);
  if (checkValidDate(body.endDate)) delete body.endDate;
  body.userId = user.id;
  return body;
}
/* exports.query = (req, res, next) => {
  const { search, isNeed } = req.query;
  const query = {
    where: {

    }
  };
  if (isNeed !== undefined) {
    query.where.isNeed = isNeed;
  }
  //  console.log(search);
  Post.findAll(query)
    .then(response => responseWithData(res, response))
    .catch(err => errorResponse(req, res, err.message));
}; */
exports.addComment = (req, res, next) => {
  const comment = req.body;
  comment.userId = req.user.id;
  const newComment = Comment.build(comment);
  Post.findByPk(comment.postId)
    .then(post => (post === null)
      ? Promise.reject(new NotFoundError())
      : newComment.save())
    .then((response) => responseWithData(res, response))
    .catch(err => errHandler(err, res));
};
/* exports.getAllWithType = (req, res, next) => {
  const { typeId, isNeed } = req.query;
  const whereObj = {};
  if (typeId !== undefined) {
    whereObj.typeId = typeId;
  }
  if (isNeed !== undefined) {
    whereObj.isNeed = isNeed;
  }
  Post.findAll({
    where: whereObj
  })
    .then(response => responseWithData(res, response))
    .catch(err => errHandler(err, res));
}; */
exports.query = (req, res, next) => {
  let { search, typeId, isNeed, offset, limit } = req.query;
  let whereObj = {};
  if (typeId !== undefined) {
    whereObj.typeId = typeId;
  }
  if (isNeed !== undefined) {
    whereObj.isNeed = isNeed;
  }
  if (offset === undefined) {
    offset = 0;
  } else {
    offset = parseInt(offset);
  }
  if (limit === undefined) {
    limit = 50;
  } else {
    limit = parseInt(limit);
  }
  if (search !== undefined) {
    whereObj = {
      [Op.or]: [
        // LIKE '%search%'
        { title: { [Op.substring]: search } },
        { text: { [Op.substring]: search } }
      ],
      ...whereObj
    };
  }
  Post.findAll({
    where: whereObj,
    limit,
    offset
  })
    .then(response => {
      // console.log(response);
      responseWithData(res, response);
    })
    .catch(err => errHandler(err, res));
};
exports.getById = (req, res, next) => {
  const { postId } = req.query;
  Post.findOne({ where: { id: postId } })
    .then((response) => responseWithData(res, response))
    .catch(err => errHandler(err, res));
};
exports.getByUserId = (req, res, next) => {
  const { userId, isNeed } = req.query;
  const whereObj = {};
  whereObj.userId = userId === undefined ? req.user.id : userId;
  if (isNeed !== undefined) {
    whereObj.isNeed = isNeed;
  }
  Post.findAll({ where: whereObj })
    .then((response) => responseWithData(res, response))
    .catch(err => errHandler(err, res));
};
async function createPost (body) {
  const result = await Post.sequelize.transaction(async (t) => {
    if (body.topic.topicName !== undefined) {
      const addCustomTopic = {
        typeId: body.typeId,
        topicName: body.topic.topicName
      };
      const [topicResult] = await Topic.findOrCreate({ where: addCustomTopic, defaults: addCustomTopic, transaction: t });
      body.topicId = topicResult.id;
    } else if (body.topic.topicId !== undefined) {
      body.topicId = body.topic.topicId;
    }
    delete body.topic;
    const postResult = await Post.create(body, { include: [File], transaction: t }).catch(err => console.error(err));
    return postResult;
  });
  return result;
}
exports.addNewPost = (req, res, next) => {
  let { body, user } = req;
  body = preProcessData(body, user);
  // console.log(body);
  createPost(body).then(post => responseWithData(res, post)).catch(err => errHandler(err, res));
};
exports.delete = (req, res, next) => {
  const pk = req.query.postId;
  Post.findByPk(pk)
    .then(post => {
      if (post === null) { return Promise.reject(new NotFoundError()); }
      if (post.userId === req.user.id || req.user.role === 0) { return post.destroy(); } else { return Promise.reject(new ForbiddenError()); }
    })
    .then(() => successResponse(res, "Delete Success"))
    .catch(err => errHandler(err, res));
};
exports.update = (req, res, next) => {
  const { body, user } = req;
  const { files } = body;
  const uPost = preProcessData(body, user);
  delete uPost.files;
  const pk = body.id;
  Post.findByPk(pk, { include: [File] })
    .then(post => {
      if (post === null) { return Promise.reject(new NotFoundError()); }
      if (post.userId === req.user.id) {
        post.files.map(file => file.destroy());
        uPost.userId = post.userId; // 把po文者換成原本的po文者
        const postUpdate = post.update(uPost, { fields: Object.keys(uPost) });
        const filesUpdate = files.map(file => {
          delete file.id;
          file.postId = post.id;
          return File.create(file);
        });
        const update = [postUpdate, filesUpdate];
        return Promise.all(update);
      } else { return Promise.reject(new ForbiddenError()); }
    })
    .then(post => {
      responseWithData(res, post);
    })
    .catch(err => errHandler(err, res));
};
