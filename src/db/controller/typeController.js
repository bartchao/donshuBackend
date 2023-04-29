const Model = require("../model");
const errHandler = require("../../util/errHandler");
const { responseWithData } = require("../helper");
const { Type } = Model;
exports.getAll = (req, res, next) => {
  // #swagger.tags = ['Type']
  Type.findAll({ attributes: ["id", "typeName"] })
    .then(response => responseWithData(res, response))
    .catch(err => errHandler(err, res));
};
