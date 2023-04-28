const Model = require("../model");
const getNewToken = require("../../util/token/getNewToken");
const errHandler = require("../../util/errHandler");
const verifyGoogleToken = require("../../middleware/verifyGoogleToken");
const checkValidDate = require("../../util/checkValidDate");
const { NotFoundError, successResponse } = require("../helper");
const { User } = Model;
class RegisterFormError extends Error { }

function preProcessData (body) {
  try {
    const { password, gender, birthday, introduction, phone, pictureUrl, hasUserTicket } = body;
    if (typeof hasUserTicket !== "boolean") {
      throw new RegisterFormError("UserTicket cannot be other than true or false");
    }
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
exports.getUser = (req, res, next) => {
  /* #swagger.tags = ['Auth']
       #swagger.summary = '取得登入的User資料'
    */
  /* #swagger.responses[200] = {
              description: 'Current User Data',
              schema: { $ref: '#/definitions/User' }
      } */
  const { id } = req.user;
  User.findByPk(id)
    .then((user) => user === null ? Promise.reject(new NotFoundError()) : successResponse(res, user))
    .catch((err) => errHandler(err, res));
};
exports.register = (req, res, next) => {
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Google OAuth2.0 Register'
     #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            googleIdToken: {
                                type: "string"
                            },
                            gender: {
                              type: "string"
                            },
                            birthday: {
                              type: "string",
                              format:"date"
                            },
                            introduction: {
                              type: "string"
                            },
                            phone:{
                              type: "string"
                            },
                            pictureUrl:{
                              tpye:"string"
                            }
                        },
                        required: ["googleIdToken","gender","birthday","phone"]
                    }
                }
              }
    } */
  let { body } = req;
  const { googleIdToken } = body;
  try {
    body = preProcessData(body);
  } catch (err) {
    // console.log("catch err!");
    const response = {
      success: false,
      msg: err.message
    };
    /* #swagger.responses[400] = {
              description: '輸入資料有誤',
              schema: {
                success: false,
                msg:'<Error message>'
              }
          } */
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
      /* #swagger.responses[200] = {
              description: '登入成功後得到的token',
              schema: {
                success: true,
                token:'<Token for every request use>'
              }
          } */
      successResponse(res, response);
    })
    .catch((err) => errHandler(err, res));
};
exports.login = (req, res, next) => {
  // #swagger.deprecated = true
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
      successResponse(res, response);
    })
    .catch((err) => errHandler(err, res));
};
exports.googleLogin = (req, res, next) => {
  /* #swagger.tags = ['Auth']
     #swagger.summary = 'Google OAuth2.0登入'
     #swagger.requestBody = {
      required: true,
      "@content": {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      googleIdToken: {
                          type: "string"
                      }
                  },
                  required: ["googleIdToken"]
              }
          }
        }
      }
      */
  const { googleIdToken } = req.body;
  verifyGoogleToken(googleIdToken)
    .then((payloads) => {
      return User.findOne({ where: { account: payloads.email } }).then(
        (user) => {
          if (!user) {
            return new NotFoundError();
          } else {
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
            /* #swagger.responses[200] = {
              description: '登入成功後得到的token',
              schema: {
                success: true,
                token:'<Token for every request use>'
              }
          } */
            successResponse(res, response);
          }
        }
      );
    })
    .catch((err) => errHandler(err, res));
};
