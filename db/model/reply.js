const Sequelize = require('sequelize');
const sequelize = require('../db');
const Comment = require('./comment.js');
const User = require('./user');
const modelName = 'reply' ;
class Reply extends Sequelize.Model {}
Reply.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
    },
    commentId:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: Comment,
            key: 'id',
        }
    },
    text:{
        type: Sequelize.TEXT,
    },
    userId:{
        allowNull: false,
        type: Sequelize.UUID,
        references: {
            model: User,
            key: 'id',
        }
    }
},{sequelize,modelName});
module.exports = Reply;
