// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (error, req, res, next) => {
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "something went wrong please try again later",
  };

  // if (error instanceof CustomAPIError) {
  //   return res.status(error.statusCode).json({ msg: error.message });
  // }
  if (error.name === "ValidationError") {
    customError.statusCode = 400;
  }
  if (error.code && error.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;
