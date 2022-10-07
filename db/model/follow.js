const Sequelize = require("sequelize");
const sequelize = require("../db");
const Topic = require("./topic");
const User = require("./user");
const modelName = "follow";
class Follow extends Sequelize.Model {}
Follow.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  topicId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: Topic,
      key: "id"
    }
  },
  userId: {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model: User,
      key: "id"
    }
  }
}, { timestamps: false, sequelize, modelName });
module.exports = Follow;
