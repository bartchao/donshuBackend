const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Model = require("../model");
const UserTickets = require("../model/userTickets");
const { Type, Topic, Post, File, Comment, User, Reply } = Model;
const postOrder = [
  ["updatedAt", "DESC"],
  [{ model: Comment }, "updatedAt", "ASC"]
];
const rpyInclude = [
  {
    model: User,
    attributes: ["id", "username", "pictureUrl", "role"]
  }
];
const cmtInclude = [
  {
    model: User,
    attributes: ["id", "username", "pictureUrl", "role"]
  },
  {
    model: Reply,
    attributes: ["id", "text", "updatedAt"],
    include: rpyInclude
  }
];
const postInclude = [
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
  },
  {
    model: Comment,
    attributes: ["id", "text", "updatedAt"],
    include: cmtInclude
  }
];
const userTicketsInclude = [
  { model: UserTickets, attributes: ["hasUserTicket"] }
];
module.exports = {
  rpyInclude,
  cmtInclude,
  postInclude,
  postOrder,
  userTicketsInclude
};
