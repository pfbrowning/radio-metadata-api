exports.BadRequest = function (message, detail) {
  return new module.exports.HttpError(400, 'Bad Request', message, detail)
}

exports.BadGateway = function (message, detail) {
  return new module.exports.HttpError(502, 'Bad Gateway', message, detail)
}

exports.Unauthorized = function (message, detail) {
  return new module.exports.HttpError(401, 'Unauthorized', message, detail)
}

exports.InternalServerError = function (message, detail) {
  return new module.exports.HttpError(500, 'Internal Server Error', message, detail)
}

exports.HttpError = function (statusCode, statusDescription, message, detail) {
  this.statusCode = statusCode
  this.statusDescription = statusDescription
  this.message = message
  this.detail = detail
}
