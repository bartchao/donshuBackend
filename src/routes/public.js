const express = require("express");
const router = express.Router();
const { validate } = require("express-validation");
const Controller = require("../db/controller/");
const { postController, typeController, topicController, authController } = Controller;
const { postValidator, topicValidator, userValidator } = require("../db/validator/index");

const { errHandler } = require("../helper/errHandler");
//  post
// router.get("/post/getAllWithType", validate(postValidator.getLimitWithType), postController.getAllWithType);
router.get("/post/getById", validate(postValidator.getById), postController.getById);
// router.get("/post/getLimitWithType", validate(postValidator.getLimitWithType), postController.getLimitWithType);
router.get("/post/query", validate(postValidator.query), postController.query);
//  user
router.post("/user/login", authController.login);
router.post("/user/googleLogin", authController.googleLogin);
router.post("/user/register", validate(userValidator.register), authController.register);
// type & topic
router.get("/type/getAll", typeController.getAll);
// router.get("/topic/getAll", topicController.getAll);
router.get("/topic/getWithType", validate(topicValidator.getWithType), topicController.getWithType);
//
router.use((err, req, res, next) => { errHandler(err, res); });

module.exports = router;
