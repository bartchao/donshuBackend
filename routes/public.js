const express = require("express");
const router = express.Router();
const Controller = require("../db/controller/");
const { postController, typeController, topicController, userController, commentController } = Controller;

//  post
router.post("/post/getAllWithType", postController.getAllWithType);
router.post("/post/getById", postController.getById);
router.post("/post/getLimitWithType", postController.getLimitWithType);
router.post("/post/query", postController.query);
//  user
router.post("/user/login", userController.login);
router.post("/user/googleLogin", userController.googleLogin);
router.post("/user/register", userController.register);
router.post("/user/checkExist", userController.isExist);
// type & topic
router.post("/type/getAll", typeController.getAll);
router.post("/topic/getAll", topicController.getAll);
router.post("/topic/getWithType", topicController.getWithType);
//

module.exports = router;
