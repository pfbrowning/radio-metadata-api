const cors = require('cors')
const allowedCorsOriginsJSON = process.env.allowedCorsOrigins

/* If a valid JSON string is present in the corsOrigins env variable,
then pass it to use as the CORS origin option.  Otherwise allow all
origins. */
let allowedCorsOrigins
if (allowedCorsOriginsJSON) {
  try {
    allowedCorsOrigins = JSON.parse(allowedCorsOriginsJSON)
  } catch (error) {
    console.error(error, 'Failed to parse allowedCorsOrigins.  Falling back to allowing all origins')
  }
}
if (Array.isArray(allowedCorsOrigins)) {
  module.exports = () => cors({ origin: allowedCorsOrigins })
} else {
  module.exports = () => cors()
}
