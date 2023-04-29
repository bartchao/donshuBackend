/* eslint-disable no-return-assign */
const Model = require("../model");
const socketio = require("../../socketio");
const errHandler = require("../../helper/errHandler");
const { responseWithData } = require("../../helper/response");
const { Post, Comment, User, Reply } = Model;
const cmtInclude = [
  {
    model: User,
    attributes: ["id", "username", "pictureUrl", "role"]
  },
  {
    model: Reply,
    attributes: ["id", "text", "updatedAt"],
    include: [
      {
        model: User,
        attributes: ["id", "username", "pictureUrl", "role"]
      }
    ]
  }
];
async function response (cmt, res, action) {
  cmt = await cmt.reload({ include: cmtInclude });
  if (action === "DELETE") await cmt.destroy();
  return await Post.findOne({ where: { id: cmt.postId } })
    .then(post => {
      const { io } = socketio;
      const response = {
        action,
        comment: cmt,
        post
      };
      responseWithData(res, response);
      io.emit("change", response);
    });
}
exports.addNew = (req, res, next) => {
  // #swagger.tags = ['Comment']
  const { body, user } = req;
  const comment = body;
  comment.userId = user.id;
  Post.findByPk(comment.postId)
    .then(post => (post === null)
      ? Promise.reject(new errHandler.NotFoundError())
      : Comment.create(comment))
    .then((cmt) => response(cmt, res, "ADD"))
    .catch(err => {
      // console.log(err);
      errHandler(err, res);
    });
};
exports.addNewAndGetComments = (req, res, next) => {
  // #swagger.tags = ['Comment']
  // #swagger.deprecated = true
  // const {body,user} = req;
  // const {postId}=body;
  // let comment = body;
  // comment.userId = user.id;
  // const comm = Comment.build(comment);
  // Post.findByPk(postId)
  //     .then(post =>(post === null)
  //                     ?   Promise.reject(new Error('Null'))
  //                     :   comm.save())
  //     .then(comment=>comment.getPost())
  //     .then(post=>post.getComments())
  //     .then(comments=>{
  //         const{io}=socketio;
  //         res.status(200).send(comments);
  //         io.emit('change', 1);
  //     })
  //     .catch(err =>errHandler(err,res))
};
exports.delete = (req, res, next) => {
  // #swagger.tags = ['Comment']
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
  Comment.findByPk(id)
    .then(comment => {
      if (comment === null) { return Promise.reject(new errHandler.NotFoundError()); }
      if (comment.userId === req.user.id || req.user.role === 0) { return response(comment, res, "DELETE"); } else { return Promise.reject(new errHandler.ForbiddenError()); }
    })
    .catch(err => errHandler(err, res));
};
exports.update = (req, res, next) => {
  // #swagger.tags = ['Comment']
  /* #swagger.requestBody = {
            required: false,
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
  Comment.findByPk(id)
    .then(comment => {
      if (comment === null) { return Promise.reject(new Error("Not found")); }
      if (comment.userId === req.user.id || req.user.role === 0) { return comment.update({ text }); } else { return Promise.reject(new errHandler.ForbiddenError()); }
    })
    .then(cmt => response(cmt, res, "UPDATE"))
    .catch(err => errHandler(err, res));
};
