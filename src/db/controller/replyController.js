const { Post, Comment, User, Reply } = require("../model");
// const { cmtInclude, rpyInclude } = require("../helper");
const { errHandler, NotFoundError, ForbiddenError } = require("../../helper/errHandler");
const socketio = require("../../socketio");
const { responseWithData } = require("../../helper/response");
const io = socketio.getSocketio();
const rpyInclude = [
  {
    model: User,
    attributes: ["id", "username", "pictureUrl", "role"]
  }
];
const cmtInclude = [
  {
    model: User,
    attributes: ["id", "username", "pictureUrl", "role"]
  },
  {
    model: Reply,
    attributes: ["id", "text", "updatedAt"],
    include: rpyInclude
  }
];

async function response (rpy, res, action) {
  const cmt = await rpy.getComment({ include: cmtInclude });
  const reply = await rpy.reload({ include: rpyInclude });
  if (action === "DELETE") await reply.destroy();
  const comment = await cmt.reload({ include: cmtInclude });
  return await Post.findOne({ where: { id: comment.postId } })
    .then(post => {
      const response = {
        action,
        reply,
        comment,
        post
      };
      responseWithData(res, response);
      io.emit("change", response);
    });
}
exports.addNew = (req, res, next) => {
  // #swagger.tags = ['Reply']
  const { body, user } = req;
  const { commentId } = body;
  const reply = body;
  reply.userId = user.id;
  Comment.findByPk(commentId)
    .then(cmt => (cmt === null)
      ? Promise.reject(new NotFoundError())
      : Reply.create(reply))
    .then(rpy => response(rpy, res, "ADD"))
    .catch(err => errHandler(err, res));
};
exports.delete = (req, res, next) => {
  // #swagger.tags = ['Reply']
  /* #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer"
                            }
                        },
                        required: ["id"]
                    }
                }
              }
    } */
  const { id } = req.body;
  Reply.findByPk(id)
    .then(rpy => {
      if (rpy === null) { return Promise.reject(new NotFoundError()); }
      if (rpy.userId === req.user.id || req.user.role === 0) { return response(rpy, res, "DELETE"); } else { return Promise.reject(new ForbiddenError()); }
    })
    .catch(err => errHandler(err, res));
};
exports.update = (req, res, next) => {
  // #swagger.tags = ['Reply']
/* #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer"
                            },
                            text: {
                              type: "string"
                            }
                        },
                        required: ["id","text"]
                    }
                }
              }
    } */
  const { id, text } = req.body;
  Reply.findByPk(id)
    .then(rpy => {
      if (rpy === null) { return Promise.reject(new NotFoundError()); }
      if (rpy.userId === req.user.id || req.user.role === 0) { return rpy.update({ text }); } else { return Promise.reject(new ForbiddenError()); }
    })
    .then(rpy => response(rpy, res, "UPDATE"))
    .catch(err => errHandler(err, res));
};
