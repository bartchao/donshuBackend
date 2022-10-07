const Sequelize = require("sequelize");
const sequelize = require("../db");
const Post = require("./post");
const User = require("./user");
const modelName = "comment";
class Comment extends Sequelize.Model {}
Comment.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  postId: {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model: Post,
      key: "id"
    }
  },
  text: {
    type: Sequelize.TEXT
  },
  userId: {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model: User,
      key: "id"
    }
  }
}, { sequelize, modelName });
module.exports = Comment;
