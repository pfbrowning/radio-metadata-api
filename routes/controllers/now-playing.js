const internetRadio = require('node-internet-radio')
const { validationResult } = require('express-validator/check')

exports.apiGET = function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  internetRadio.getStationInfo(decodeURIComponent(req.query.url), function (error, station) {
    // If there was an error, then report it back with a 500
    if (error) {
      res.status(500).send(error.message)
      // If the call was successful, then return the data with a 200
    } else {
      res.status(200).send(station)
    }
    /* Pass in query method in case the user provided a value.
      If nothing was provided, then getStationInfo will check all
      supported protocols, which is easy but inefficient. */
  }, req.query.method)
}
