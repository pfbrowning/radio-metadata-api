const httpErrors = require('../utilities/http-errors')

module.exports = function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json(new httpErrors.Unauthorized(err.message))
  } else {
    res.status(500).json(new httpErrors.InternalServerError(err.message))
  }
  next()
}
