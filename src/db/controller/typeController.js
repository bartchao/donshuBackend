const Model = require("../model");
const errHandler = require("../../helper/errHandler");
const { responseWithData } = require("../../helper/response");
const { Type } = Model;
exports.getAll = (req, res, next) => {
  // #swagger.tags = ['Type']
  Type.findAll({ attributes: ["id", "typeName"] })
    .then(response => responseWithData(res, response))
    .catch(err => errHandler(err, res));
};
