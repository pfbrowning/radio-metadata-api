/**
 * Constructor function which creates an object representing a
 * 400 "Bad Request" response object to return to the
 * consumer as JSON.
 * @param {string} message A brief message used to communicate the type of
 * error to the consumer in a detail-agnostic fashion.  For example,
 * "Validation Error".
 * @param {*} detail Any extra details to include with the error.  This
 * could be any type, but most commonly it would be an object or an array.
 */
exports.BadRequest = function (message, detail) {
  return new module.exports.HttpError(400, 'Bad Request', message, detail)
}

/**
 * Constructor function which creates an object representing a
 * 502 "Bad Gateway" response object to return to the
 * consumer as JSON.
 * @param {string} message A brief message used to communicate the type of
 * error to the consumer in a detail-agnostic fashion.  For example,
 * "The downstream API could not be reached".
 * @param {*} detail Any extra details to include with the error.  This
 * could be any type, but most commonly it would be an object or an array.
 */
exports.BadGateway = function (message, detail) {
  return new module.exports.HttpError(502, 'Bad Gateway', message, detail)
}

/**
 * Constructor function which creates an object representing a
 * 401 "Unauthorized" response object to return to the
 * consumer as JSON.
 * @param {string} message A brief message used to communicate the type of
 * error to the consumer in a detail-agnostic fashion.  For example,
 * "No authorization token was found".
 * @param {*} detail Any extra details to include with the error.  This
 * could be any type, but most commonly it would be an object or an array.
 */
exports.Unauthorized = function (message, detail) {
  return new module.exports.HttpError(401, 'Unauthorized', message, detail)
}

/**
 * Constructor function which creates an object representing a
 * 500 "Internal Server Error" response object to return to the
 * consumer as JSON.
 * @param {string} message A brief message used to communicate the type of
 * error to the consumer in a detail-agnostic fashion.  For example,
 * "Unhandled Error Caught".
 * @param {*} detail Any extra details to include with the error.  This
 * could be any type, but most commonly it would be an object or an array.
 */
exports.InternalServerError = function (message, detail) {
  return new module.exports.HttpError(500, 'Internal Server Error', message, detail)
}

/**
 * Constructor function which creates an object representing an HTTP error
 * response object to return to the consumer as JSON.  It's intended to
 * include helpful details about the error to the API consumer in a 
 * consistent format
 * @param {number} statusCode The HTTP Status Code for the error being 
 * returned, such as 400 or 500
 * @param {string} statusDescription The description associated with the
 * returned error code, such as "Bad Request" for 400 or "Internal Server Error" 
 * for 500.
 * @param {string} message A brief message used to communicate the type of
 * error to the consumer in a detail-agnostic fashion.  For example,
 * "Validation Error" or "No authorization token was found".
 * @param {*} detail Any extra details to include with the error.  This
 * could be any type, but most commonly it would be an object or an array.
 */
exports.HttpError = function (statusCode, statusDescription, message, detail) {
  this.statusCode = statusCode
  this.statusDescription = statusDescription
  this.message = message
  this.detail = detail
}
