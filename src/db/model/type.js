const Sequelize = require("sequelize");
const sequelize = require("../db");
const modelName = "type";
class Type extends Sequelize.Model {}
Type.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true
  },
  typeName: {
    allowNull: false,
    type: Sequelize.STRING
  }
}, { timestamps: false, sequelize, modelName });
module.exports = Type;
