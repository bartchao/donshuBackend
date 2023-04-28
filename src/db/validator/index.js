const postValidator = require("./post.validator");
const topicValidator = require("./topic.validator");
const userValidator = require("./user.validator");
module.exports = [postValidator, topicValidator, userValidator];
