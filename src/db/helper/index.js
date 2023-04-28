module.exports.successResponse = (res, data, code = 200) => {
  if (data === null || data === undefined) {
    res.status(code).send({ success: true });
  } else if (data.length === 0) {
    res.status(204).send(data);
  } else {
    res.status(code).send(data);
  }
};

module.exports.errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) => res.status(500).json({
  code,
  errorMessage,
  error,
  data: null,
  success: false
});
