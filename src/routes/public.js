const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const Controller = require("../db/controller/");
const { postController, typeController, topicController, userController } = Controller;
const postValidator = require("../db/validator/post.validator");
const topicValidator = require("../db/validator/topic.validator");
//  post
router.post("/post/getAllWithType", validate(postValidator.getAllWithType), postController.getAllWithType);
router.post("/post/getById", validate(postValidator.getById), postController.getById);
router.post("/post/getLimitWithType", validate(postValidator.getLimitWithType), postController.getLimitWithType);
router.post("/post/query", validate(postValidator.query), postController.query);
//  user
router.post("/user/login", userController.login);
router.post("/user/googleLogin", userController.googleLogin);
router.post("/user/register", userController.register);
router.post("/user/checkExist", userController.isExist);
// type & topic
router.post("/type/getAll", typeController.getAll);
router.post("/topic/getAll", topicController.getAll);
router.post("/topic/getWithType", validate(topicValidator.getWithType), topicController.getWithType);
//

module.exports = router;
