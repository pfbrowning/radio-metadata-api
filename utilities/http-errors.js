exports.badRequest = function(message, detail) {
    return new module.exports.httpError(400, 'Bad Request', message, detail);
}

exports.badGateway = function(message, detail) {
    return new module.exports.httpError(502, 'Bad Gateway', message, detail);
}

exports.unauthorized = function(message, detail) {
    return new module.exports.httpError(401, 'Unauthorized', message, detail);
}

exports.internalServerError = function(message, detail) {
    return new module.exports.httpError(500, 'Internal Server Error', message, detail);
}

exports.httpError = function(statusCode, statusDescription, message, detail) {
    this.statusCode = statusCode;
    this.statusDescription = statusDescription;
    this.message = message;
    this.detail = detail;
}