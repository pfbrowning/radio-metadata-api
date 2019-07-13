const express = require('express')
const internetRadio = require('node-internet-radio')
const app = express()
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { query, validationResult } = require('express-validator/check')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

// Configuration via environment variables
const port = process.env.PORT || 3000
const issuer = process.env.issuer
const audience = process.env.audience
const allowedCorsOriginsJSON = process.env.allowedCorsOrigins

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

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
if (allowedCorsOrigins) {
  app.use(cors({ origin: allowedCorsOrigins }))
} else {
  app.use(cors())
}

/* If audience and issuer are present, then use RS256 JWT
Bearer Token authentication for all requests. */
if (issuer && audience) {
  app.use(jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${issuer}.well-known/jwks.json`
    }),
    audience: audience,
    issuer: issuer,
    algorithms: ['RS256']
  }))
}

// Configure Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
  swaggerDefinition: swaggerDefinition = {
    info: {
      title: 'Internet Radio Metadata API',
      version: '0.0.1',
      description: 'API that retrieves the Now Playing metadata of radio streams via the node-internet-radio module'
    },
    host: 'localhost:3000',
    basePath: '/'
  },
  apis: ['index.js']
})))

/**
 * @swagger
 * /now-playing:
 *  get:
 *      summary: Gets the 'Now Playing' metadata for the specified radio stream URL
 *      description: This is an API wrapper around the getStationInfo function
 *          provided by https://www.npmjs.com/package/node-internet-radio.
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - name: url
 *        in: query
 *        description: Encoded URL to fetch metadata for
 *        required: true
 *        type: string
 *        example: http%3A%2F%2F188.165.212.92%3A8000%2Fheavy128mp3
 *      - name: method
 *        in: query
 *        description: The stream source method to query, as explained
 *          in the node-internet-radio readme.  This is optional, but
 *          strongly recommended.
 *        required: false
 *        type: string
 *        example: STREAM
 *      responses:
 *        200:
 *          description: Metadata was successfully retrieved
 *        400:
 *          description: Validation error - url was not provided or is not a valid url
 *        500:
 *          description: An error was reported by getStationInfo
 */
app.get('/now-playing', query('url').exists(), (req, res) => {
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
})
