const express = require("express");
const router = express.Router();
const Controller = require("../db/controller/");
const { postController, typeController, topicController, authController } = Controller;

//  post
router.post("/post/getAllWithType", postController.getAllWithType);
router.post("/post/getById", postController.getById);
router.post("/post/getLimitWithType", postController.getLimitWithType);
router.post("/post/query", postController.query);
//  user
router.post("/user/login", authController.login);
router.post("/user/googleLogin", authController.googleLogin);
router.post("/user/register", authController.register);
// type & topic
router.post("/type/getAll", typeController.getAll);
router.post("/topic/getAll", topicController.getAll);
router.post("/topic/getWithType", topicController.getWithType);
//

module.exports = router;
