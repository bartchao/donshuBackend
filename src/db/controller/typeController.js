const Model = require("../model");
const errHandler = require("../../util/errHandler");
const { successResponse } = require("../helper");
const { Type } = Model;
exports.getAll = (req, res, next) => {
  // #swagger.tags = ['Type']
  Type.findAll({ attributes: ["id", "typeName"] })
    .then(response => successResponse(res, response))
    .catch(err => errHandler(err, res));
};
