/* eslint-disable no-tabs */
const Op = require("sequelize").Op;
const Model = require("../model");
const { User, UserTicket } = Model;
const getNewToken = require("../../util/token/getNewToken");
const { postInclude, postOrder, userTicketsInclude } = require("../helper");
const checkValidDate = require("../../util/checkValidDate");
const errHandler = require("../../util/errHandler");
const verifyGoogleToken = require("../../middleware/verifyGoogleToken");

class RegisterFormError extends Error {}
function preProcessData (body) {
  try {
    const { password, gender, birthday, introduction, phone, pictureUrl } =
      body;
    if (phone === null) {
      throw new RegisterFormError("Phone cannot be null");
    }
    if (gender === null) {
      throw new RegisterFormError("Gender cannot be null");
    }
    if (birthday == null) {
      throw new RegisterFormError("Birthday cannot be null");
    } else if (checkValidDate(new Date(birthday))) {
      throw new RegisterFormError("Wrong format of birthday");
    } else body.birthday = new Date(birthday);
    if (password === null) delete body.password; // 沒有這個欄位
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
exports.searchUser = (req, res, next) => {
  const { search } = req.body;
  User.findAll({
    attributes: ["id", "username", "pictureUrl"],
    where: {
      username: { [Op.startsWith]: search }
    }
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send({ success: false });
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
  User.findAll({ attributes: ["id", "username"], include: userTicketsInclude })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ success: false });
    });
};
exports.getOtherUser = (req, res, next) => {
  const { id } = req.body;
  User.findByPk({ id, include: userTicketsInclude })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send({ success: false });
    });
};
exports.getUserPosts = (req, res, next) => {
  const { body } = req;
  const { id, isNeed } = body;
  User.findByPk(id)
    .then((user) =>
      user === null
        ? Promise.reject(new Error("Null"))
        : user.getPosts({
          where: { isNeed: isNeed === "true" },
          order: postOrder,
          include: postInclude
        })
    )
    .then((posts) => res.status(200).send(posts))
    .catch((error) => {
      console.error(error);
      const code = 500;
      res.status(code).send({ succeess: false });
    });
};
exports.googleLogin = (req, res, next) => {
  const { googleIdToken } = req.body;
  verifyGoogleToken(googleIdToken)
    .then((payloads) => {
      return User.findOne({ where: { account: payloads.email } }).then(
        (user) => {
          if (!user) {
            const response = {
              success: false,
              msg: "NULL ACCOUNT",
              payload: {
                account: payloads.email,
                username: payloads.name,
                pictureUrl: payloads.picture
              }
            };
            res.status(200).send(response);
            return;
          }
          const payload = {
            id: user.id,
            account: user.account,
            username: user.username,
            role: user.role,
            pictureUrl: user.pictureUrl
          };
          const response = {
            success: true,
            token: getNewToken(payload)
          };
          res.status(200).send(response);
        }
      );
    })
    .catch((err) => errHandler(err, res));
};

// will be Deprecate
exports.login = (req, res, next) => {
  console.log("login");
  const { account } = req.body;
  User.findOne({ where: { account } })
    .then((user) => {
      const payload = {
        id: user.id,
        account: user.account,
        username: user.username,
        role: user.role,
        pictureUrl: user.pictureUrl
      };
      const response = {
        success: true,
        token: getNewToken(payload)
      };
      res.status(200).send(response);
    })
    .catch((err) => errHandler(err, res));
};

// will Deprecate
exports.isExist = (req, res, next) => {
  const { account } = req.body;
  User.findOne({ where: { account } })
    .then((user) => {
      console.log(user);
      const response = {
        success: true,
        txt: user ? "REAPET ACCOUNT" : "NULL"
      };
      res.status(200).send(response);
    })
    .catch((err) => errHandler(err, res));
};

exports.register = (req, res, next) => {
  let { body } = req;
  const { googleIdToken } = body;
  try {
    body = preProcessData(body);
  } catch (err) {
    console.log("catch err!");
    const response = {
      success: false,
      msg: err.message
    };
    res.status(400).send(response);
  }
  body.role = 1;

  verifyGoogleToken(googleIdToken)
    .then(({ email }) => {
      body.account = email;
      delete body.googleIdToken;
    })
    .then(() =>
      User.findOrCreate({ where: { account: body.account }, defaults: body })
    )
    .then(([user, created]) => {
      console.log("creater");
      const payload = {
        id: user.id,
        account: user.account,
        username: user.username,
        role: user.role
      };
      const response = {
        success: true,
        token: getNewToken(payload)
      };
      res.status(200).send(response);
    })
    .catch((err) => errHandler(err, res));
};

exports.getUser = (req, res, next) => {
  const { id } = req.user;
  // console.log('getUser!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(id);
  User.findByPk({ id, include: userTicketsInclude })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => errHandler(err, res));
};
exports.update = (req, res, next) => {
  // console.log("!!!!!!!!!!!!!!!!!!!!!!");
  let { body, user } = req;
  const tid = user.id;
  body = preProcessData(body);
  if (body.id === undefined) body.id = tid;
  User.findByPk(body.id)
    .then(async (user) => {
      if (user === null) return Promise.reject(new Error("Null"));
      if (user.id === tid) {
        try {
          const result = await User.sequelize.transaction(async (t) => {
            await UserTicket.upsert({ userId: user.id, hasUserTicket: body.userTicket.hasUserTicket }, { transaction: t }
            );
            await User.update(body, { where: { id: user.id }, fields: Object.keys(body), transaction: t });
          });
          return User.findOne({
            where: { id: user.id },
            include: userTicketsInclude
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
      res.status(200).send(response);
    })
    .catch((err) => errHandler(err, res));
};
exports.getPosts = (req, res, next) => {
  const { user, body } = req;
  const { isNeed } = body;
  const { id } = user;
  User.findByPk(id)
    .then((user) =>
      user === null
        ? Promise.reject(new Error("Null"))
        : user.getPosts({
          where: { isNeed: isNeed === "true" },
          order: postOrder,
          include: postInclude
        })
    )
    .then((posts) => res.status(200).send(posts))
    .catch((err) => errHandler(err, res));
};
// not use
exports.delete = (req, res, next) => {
  const body = req.body;
  const pk = body.id;
  User.findByPk(pk)
    .then((user) => {
      if (user === null) return Promise.reject(new Error("Null"));
      if (user.id === req.user.id || req.user.role === 0) return user.destroy();
      else return Promise.reject(new Error("Forbbiden"));
    })
    .then(() => res.status(200).send({ succeess: true }))
    .catch((err) => errHandler(err, res));
};
