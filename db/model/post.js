const Sequelize = require('sequelize');
const User = require('./user');
const Type = require('./type');
const Topic = require('./topic');
const uuid = require('uuid/v4'); 
const sequelize = require('../db');
const modelName = 'post' ;
class Post extends Sequelize.Model {}
Post.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: () => uuid()
     },
    typeId:{allowNull: false,type:Sequelize.INTEGER},
    topicId:{type:Sequelize.INTEGER,references: {
      model: Topic,
      key: 'id',
    }},
    title:{allowNull: false,type:Sequelize.STRING},
    startDate:{type:Sequelize.DATEONLY },
    endDate:{type:Sequelize.DATEONLY },
    position:{type:Sequelize.STRING},
    text:{type:Sequelize.TEXT},
    latitude:{type:Sequelize.DOUBLE},
    longitude:{type:Sequelize.DOUBLE},
    userId:{allowNull: false,type:Sequelize.UUID,references: {
        model: User,
        key: 'id',
    }},
    // postTime:{type:Sequelize.DATE},
    isNeed:{allowNull: false,type:Sequelize.BOOLEAN},
},{sequelize,modelName});

module.exports = Post

