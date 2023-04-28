const Sequelize = require("sequelize");
const Type = require("./type");
const Topic = require("./topic");
const User = require("./user");
const File = require("./file");
const Comment = require("./comment");
const Reply = require("./reply");
const uuid = require("uuid/v4");
const sequelize = require("../db");
const modelName = "post";
class Post extends Sequelize.Model { }
Post.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: () => uuid()
  },
  typeId: { allowNull: false, type: Sequelize.INTEGER },
  topicId: {
    type: Sequelize.INTEGER,
    references: {
      model: Topic,
      key: "id"
    }
  },
  title: { allowNull: false, type: Sequelize.STRING },
  startDate: { type: Sequelize.DATEONLY },
  endDate: { type: Sequelize.DATEONLY },
  position: { type: Sequelize.STRING },
  text: { type: Sequelize.TEXT },
  latitude: { type: Sequelize.DOUBLE },
  longitude: { type: Sequelize.DOUBLE },
  userId: {
    allowNull: false,
    type: Sequelize.UUID,
    references: {
      model: User,
      key: "id"
    }
  },
  // postTime:{type:Sequelize.DATE},
  isNeed: { allowNull: false, type: Sequelize.BOOLEAN }
}, {
  defaultScope: {
    include: [
      {
        model: Topic,
        attributes: ["id", "topicName"]
      },
      {
        model: Type,
        attributes: ["id", "typeName"]
      },
      {
        model: User,
        attributes: ["id", "username", "pictureUrl", "role"]
      },
      {
        model: File,
        attributes: ["id", "url", "fileName"]
      }, {
        model: Comment,
        attributes: ["id", "text", "updatedAt"],
        include: [{
          model: User,
          attributes: ["id", "username", "pictureUrl", "role"]
        },
        {
          model: Reply,
          attributes: ["id", "text", "updatedAt"],
          include: [{
            model: User,
            attributes: ["id", "username", "pictureUrl", "role"]
          }]
        }]
      }
    ],
    order: [
      ["updatedAt", "DESC"],
      [{ model: Comment }, "updatedAt", "ASC"]
    ]
  },
  scopes: {},
  sequelize,
  modelName
});

module.exports = Post;
