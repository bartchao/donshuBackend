const Sequelize = require("sequelize");
const sequelize = require("../db");
const Post = require("./post");
const modelName = "file";
class File extends Sequelize.Model {}
File.init({
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
  url: {
    allowNull: false,
    type: Sequelize.STRING
  },
  fileName: {
    type: Sequelize.STRING
  }
}, { timestamps: false, sequelize, modelName });
module.exports = File;
