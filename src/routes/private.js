const express = require("express");
const router = express.Router();
const Middleware = require("../middleware/");
const { checkToken, checkTokExp, ImgUpload, checkAPKversion } = Middleware;
const { validate } = require("express-validation");
const { postValidator, topicValidator, userValidator, commentValidator } = require("../db/validator/index");
const Controller = require("../db/controller/");
const { errHandler } = require("../helper/errHandler");
const {
  postController,
  topicController,
  userController,
  commentController,
  replyController
} = Controller;

router.post("/checkTokExp", checkTokExp);
router.use(checkToken);
// checkAPKversion
router.post("/checkAPKversion", checkAPKversion);
//  post
router.post("/post/addNewPost", postController.addNewPost);
router.delete("/post/delete", validate(postValidator.getById), postController.delete);
router.post("/post/update", postController.update);
// comment
router.post("/post/addComment", commentController.addNew);
// router.post("/comment/addAndGet", commentController.addNewAndGetComments);
router.delete("/comment/delete", validate(commentValidator.deleteComment), commentController.delete);
router.post("/comment/update", validate(commentValidator.updateComment), commentController.update);
// reply
router.post("/comment/addReply", replyController.addNew);
router.delete("/reply/delete", replyController.delete);
router.post("/reply/update", replyController.update);
// user
router.post("/user/getPosts", validate(userValidator.getPosts), userController.getPosts);
router.get("/user/getUser", userController.getLoggedInUser);
router.post("/user/update", userController.update);
router.get("/user/getOtherUser", validate(userValidator.getById), userController.getOtherUser);
router.get("/user/getUserPosts", validate(userValidator.getOtherUserPosts), userController.getOtherUserPosts);
router.get("/user/getAllUsername", userController.getAllUser);
router.get("/user/searchUser", validate(userValidator.searchUserName), userController.searchUserName);
// topic
router.post("/topic/addTopic", validate(topicValidator.addTopic), topicController.addTopic);
router.delete("/topic/deleteTopic", validate(topicValidator.getById), topicController.deleteTopic);

// router.post('/user/delete',userController.delete);

// uploadImg
router.post("/uploadImg", ImgUpload);
router.use((err, req, res, next) => { errHandler(err, res); });
module.exports = router;
