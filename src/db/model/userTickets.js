const Sequelize = require("sequelize");
const sequelize = require("../db");
const modelName = "userTickets";
class UserTickets extends Sequelize.Model {}
UserTickets.init({
  hasUserTicket: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, { sequelize, modelName, timestamps: true, createdAt: false });
module.exports = UserTickets;
