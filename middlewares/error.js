const httpErrors = require('../utilities/http-errors');

module.exports = function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(new httpErrors.unauthorized(err.message));
    }
    else {
        res.status(500).json(new httpErrors.internalServerError(err.message))
    }
    next()
};