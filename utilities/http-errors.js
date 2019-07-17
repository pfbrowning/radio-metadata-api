exports.badRequest = function(message, detail) {
    return new module.exports.httpError(400, 'Bad Request', message, detail);
}

exports.badGateway = (message, detail) => {
    return new module.exports.httpError(502, 'Bad Gateway');
}

exports.httpError = function(statusCode, statusDescription, message, detail) {
    this.statusCode = statusCode;
    this.statusDescription = statusDescription;
    this.message = message;
    this.detail = detail;
}