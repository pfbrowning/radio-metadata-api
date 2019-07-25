const internetRadio = require('node-internet-radio')
const { validationResult } = require('express-validator/check')
const httpErrors = require('../../utilities/http-errors.js')
const logger = require('../../logger')

exports.apiGET = function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(new httpErrors.BadRequest('Validation Error', errors.array()))
  }
  internetRadio.getStationInfo(decodeURIComponent(req.query.url), function (error, station) {
    // If node-internet-radio reported an error, report it as a 502
    if (error) {
      logger.warn('node-internet-radio error', error)
      res.status(502).json(new httpErrors.BadGateway('node-internet-radio error', error.message))
      // If the call was successful, then return the data with a 200
    } else {
      res.status(200).json(station)
    }
    /* Pass in query method in case the user provided a value.
      If nothing was provided, then getStationInfo will check all
      supported protocols, which is easy but inefficient. */
  }, req.query.method)
}
