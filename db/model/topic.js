const Sequelize = require('sequelize');
const sequelize = require('../db');
const Type = require('./type');
const modelName = 'topic' ;
class Topic extends Sequelize.Model {}
Topic.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
    },
    typeId:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: Type,
            key: 'id',
        }
    },
    topicName:{
        allowNull: false,
        type: Sequelize.STRING,
    }
},{timestamps: false,sequelize,modelName});
module.exports = Topic;
