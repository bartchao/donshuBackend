const { Post, Comment, User, Reply } = require("../model");
const { postOrder, postInclude, cmtInclude, rpyInclude } = require("../helper");
const errHandler = require("../../util/errHandler");
const socketio = require("../../socketio");
const io = socketio.getSocketio();

async function response (rpy, res, action) {
  const cmt = await rpy.getComment({ include: cmtInclude });
  const reply = await rpy.reload({ include: rpyInclude });
  if (action == "DELETE") await reply.destroy();
  const comment = await cmt.reload({ include: cmtInclude });
  return await Post.findOne({ where: { id: comment.postId }, include: postInclude, order: postOrder })
    .then(post => {
      const { io } = socketio;
      const response = {
        action,
        reply,
        comment,
        post
      };
      res.status(200).send(response);
      io.emit("change", response);
    });
}
exports.addNew = (req, res, next) => {
  const { body, user } = req;
  const { commentId } = body;
  const reply = body;
  console.log("reply");
  console.log(reply);
  reply.userId = user.id;
  Comment.findByPk(commentId)
    .then(cmt => (cmt === null)
      ? Promise.reject(new Error("Null"))
      : Reply.create(reply))
    .then(rpy => response(rpy, res, action = "ADD"))
    .catch(err => errHandler(err, res));
};
exports.delete = (req, res, next) => {
  const { body, user } = req;
  const { id } = body;
  Reply.findByPk(id)
    .then(rpy => {
      if (rpy === null) { return Promise.reject(new Error("Null")); }
      if (rpy.userId === req.user.id || req.user.role === 0) { return response(rpy, res, action = "DELETE"); } else { return Promise.reject(new Error("Forbbiden")); }
    })
    .catch(err => errHandler(err, res));
};
exports.update = (req, res, next) => {
  const { body, user } = req;
  const { id, text } = body;
  Reply.findByPk(id)
    .then(rpy => {
      if (rpy === null) { return Promise.reject(new Error("Null")); }
      if (rpy.userId === req.user.id || req.user.role === 0) { return rpy.update({ text }); } else { return Promise.reject(new Error("Forbbiden")); }
    })
    .then(rpy => response(rpy, res, action = "UPDATE"))
    .catch(err => errHandler(err, res));
};
