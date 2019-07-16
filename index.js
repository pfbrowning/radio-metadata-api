const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const isBlank = require('is-blank')
const routes = require('./routes/routes')
const corsMiddleware = require('./middlewares/cors')

// Configuration via environment variables
let issuer = process.env.issuer
const audience = process.env.audience
const port = process.env.PORT || 3000

const app = express()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Configure CORS via the middleware
app.use(corsMiddleware)

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
if (!isBlank(issuer) && !isBlank(audience)) {
  // Fix issuer if it doesn't contain a trailing slash
  if (!issuer.endsWith('/')) {
    issuer = `${issuer}/`
  }
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
app.use('/', routes)
