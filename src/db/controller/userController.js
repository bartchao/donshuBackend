/* eslint-disable no-tabs */
const Op = require("sequelize").Op;
const Model = require("../model");
const getNewToken = require("../../util/token/getNewToken");
const { errHandler, NotFoundError } = require("../../helper/errHandler");
const { successResponse, responseWithData } = require("../../helper/response");
const { User } = Model;

class RegisterFormError extends Error { }
// Need express-validator
function preProcessData (body) {
  try {
    const { introduction, pictureUrl } = body;

    if (pictureUrl === null) delete body.pictureUrl;
    if (introduction === null) delete body.introduction;
  } catch (error) {
    if (error instanceof RegisterFormError) {
      throw error;
    } else {
      console.log(error);
    }
  }
  return body;
}
function getUserPosts (userId, isNeed) {
  // #swagger.tags = ['Users']

  return User.findByPk(userId)
    .then((user) =>
      user === null
        ? Promise.reject(new NotFoundError())
        : user.getPosts({
          where: { isNeed: isNeed === "true" }
        })
    );
}
exports.searchUserName = (req, res, next) => {
  // #swagger.tags = ['Users']
  /*  #swagger.requestBody = {
            required: false,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            search: {
                                type: "string"
                            }
                        },
                        required: ["search"]
                    }
                }
              }
        } */
  const { search } = req.body;
  User.findAll({
    attributes: ["id", "username", "pictureUrl"],
    where: {
      username: { [Op.startsWith]: search }
    }
  })
    .then((user) => {
      responseWithData(res, user);
    })
    .catch((err) => {
      errHandler(res, err);
    });
};
// exports.searchUser = (req,res,next)=>{
//     const search = "t"
//     User.findAll({
// 	attributes: ["id","username"],
// 	where:{
//     		username: {
// 			[Op.substring]: search
// 		}
//     	}
//      })
//     .then(user=>{
//         res.status(200).send(user);
//     })
//     .catch(()=>{
//         res.status(500).send({success: false,});
//     })
// }

exports.getAllUser = (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = '取得所有User'
  */
  User.findAll({ attributes: ["id", "username", "pictureUrl"] })
    .then((user) => {
      responseWithData(res, user);
    })
    .catch((err) => {
      errHandler(err, res);
    });
};
exports.getOtherUser = (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = '取得某User資料'
  */

  /*  #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            }
                        },
                        required: ["id"]
                    }
                }
              }
        } */
  /* #swagger.responses[200] = {
            description: 'Found Other User',
            schema: { $ref: '#/definitions/User' }
    } */
  const { id } = req.body;
  User.findByPk(id)
    .then((user) => user === null ? Promise.reject(new NotFoundError()) : responseWithData(res, user))
    .catch((err) => {
      errHandler(err, res);
    });
};
exports.getOtherUserPosts = (req, res, next) => {
  // #swagger.tags = ['Users']

  const { body } = req;
  const { id, isNeed } = body;
  getUserPosts(id, isNeed)
    .then((posts) => responseWithData(res, posts))
    .catch((error) => {
      errHandler(error, res);
    });
};

exports.isExist = (req, res, next) => {
  // #swagger.deprecated = true
  const { account } = req.body;
  User.findOne({ where: { account } })
    .then((user) => {
      const response = {
        success: true,
        txt: user ? "REAPET ACCOUNT" : "NULL"
      };
      res.status(200).send(response);
    })
    .catch((err) => errHandler(err, res));
};

exports.getLoggedInUser = (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = '取得登入的User資料'
  */
  /* #swagger.responses[200] = {
            description: 'Current User Data',
            schema: { $ref: '#/definitions/User' }
    } */
  const { id } = req.user;
  User.findByPk(id)
    .then((user) => user === null ? Promise.reject(new NotFoundError()) : responseWithData(res, user))
    .catch((err) => errHandler(err, res));
};
exports.update = (req, res, next) => {
  // #swagger.tags = ['Users']

  // console.log("!!!!!!!!!!!!!!!!!!!!!!");
  let { body, user } = req;
  const tid = user.id;
  body = preProcessData(body);
  if (body.id === undefined) body.id = tid;
  User.findByPk(body.id)
    .then(async (user) => {
      if (user === null) return Promise.reject(new NotFoundError());
      if (user.id === tid) {
        try {
          await User.sequelize.transaction(async (t) => {
            await User.update(body, { where: { id: user.id }, fields: Object.keys(body), transaction: t });
          });
          return User.findOne({
            where: { id: user.id }
          });
          // return result;
        } catch (error) {
          console.error(error);
          if (error.name === "SequelizeValidationError") {
            return Promise.reject(new Error(error.message));
          } else {
            return Promise.reject(new Error("Server Error"));
          }
        }
      } else return Promise.reject(new Error("Forbbiden"));
    })
    .then((user) => {
      console.log(user);
      const payload = {
        id: user.id,
        account: user.account,
        username: user.username,
        role: user.role
      };
      const response = {
        success: true,
        token: getNewToken(payload),
        user
      };
      responseWithData(res, response);
    })
    .catch((err) => errHandler(err, res));
};
exports.getPosts = (req, res, next) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = '取得登入的User擁有的發文'
     #swagger.requestBody = {
      required: true,
      "@content": {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      isNeed: {
                          type: "boolean"
                      }
                  },
                  required: ["isNeed"]
              }
          }
        }
      }
  */
  const { user, body } = req;
  const { isNeed } = body;
  getUserPosts(user.id, isNeed)
    .then((posts) => responseWithData(res, posts))
    .catch((err) => errHandler(err, res));
};
// not use
exports.delete = (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.deprecated = true
  const body = req.body;
  const pk = body.id;
  User.findByPk(pk)
    .then((user) => {
      if (user === null) return Promise.reject(new Error("Null"));
      if (user.id === req.user.id || req.user.role === 0) return user.destroy();
      else return Promise.reject(new Error("Forbbiden"));
    })
    .then(() => successResponse(res))
    .catch((err) => errHandler(err, res));
};
