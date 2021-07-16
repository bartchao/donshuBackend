const Sequelize = require('sequelize');
const sequelize = require('../db');
const uuid = require('uuid/v4');
const modelName = 'user';
class User extends Sequelize.Model {
    static addUser(account, password, username, role) {
        return User.create({
            id: '553ab958-b567-4178-b79e-edbc53883557',
            account: account,
            password: password,
            username: username,
            gender:"男",
            role: role,
        });
    }
    static authenticate(account) {
        return User.findOne({
            where: {
                account: account,
                password: password,
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
        unique: true,
    },
    password: {
        type: Sequelize.STRING
    },
    username: {
        allowNull: false,
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING,
        values: ['男', '女', '其他']
    },
    birthday: {
        type: Sequelize.DATEONLY
    },
    introduction: {
        type: Sequelize.TEXT,
    },
    phone: {
        type: Sequelize.STRING,
    },
    pictureUrl:{
        type: Sequelize.STRING,
    },
    role: {
        allowNull: false,
        type: Sequelize.INTEGER  //1:user 0:admin
    }
}, { sequelize, modelName });
module.exports = User

