const Model = require("../model");
const errHandler = require("../../util/errHandler");
const { Type } = Model;
exports.getAll = (req, res, next) => {
  Type.findAll({ attributes: ["id", "typeName"] })
    .then(response => res.status(200).send(response))
    .catch(err => errHandler(err, res));
};
