const express = require('express')
const app = express()
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const routes = require('./routes/routes');

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

// Configure Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Internet Radio Metadata API',
      version: '0.0.1',
      description: 'API that retrieves the Now Playing metadata of radio streams via the node-internet-radio module'
    },
    host: 'localhost:3000',
    basePath: '/'
  },
  apis: ['./routes/routes.js']
})))

/* If audience and issuer are present, then use RS256 JWT
Bearer Token authentication for all requests *except* the
Swagger UI. */
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
  }).unless({ path: ['/swagger'] }))
}

// Connect imported routes to Express
app.use('/', routes);