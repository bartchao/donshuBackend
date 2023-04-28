const Sequelize = require("sequelize");
const sequelize = require("../db");
const uuid = require("uuid/v4");
const modelName = "user";
class User extends Sequelize.Model {
  static addUser (account, password, username, role) {
    return User.create({
      id: "553ab958-b567-4178-b79e-edbc53883557",
      account,
      password,
      username,
      gender: "男",
      role
    });
  }

  static authenticate (account) {
    return User.findOne({
      where: {
        account
      }
    });
  }

  // static findAll() { return User.findAll(); }
}
User.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: () => uuid()
  },
  account: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true
  },
  // Deprecated
  /* password: {
        type: Sequelize.STRING
    } */
  username: {
    allowNull: false,
    type: Sequelize.STRING
  },
  gender: {
    type: Sequelize.STRING,
    validate: {
      isIn: {
        args: [["男", "女", "其它"]],
        msg: "Gender:Please choose a valid option"
      }
    }
  },
  birthday: {
    type: Sequelize.DATEONLY,
    validate: {
      isBefore: {
        args: new Date().toISOString().split("T")[0],
        msg: "Birthday:cannot later than today"
      }
    }
  },
  introduction: {
    type: Sequelize.TEXT
  },
  phone: {
    type: Sequelize.STRING,
    validate: {
      isNumeric: {
        args: true,
        msg: "Phone:must be numeric"
      }
    }
  },
  pictureUrl: {
    type: Sequelize.STRING
  },
  role: {
    allowNull: false,
    type: Sequelize.INTEGER // 1:user 0:admin
  },
  hasUserTicket: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }

}, {
  defaultScope: {},
  scopes: {},
  sequelize,
  modelName
});
module.exports = User;
