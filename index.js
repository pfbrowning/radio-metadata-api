const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const routes = require('./routes/routes')
const corsMiddleware = require('./middlewares/cors')
const jwtMiddleware = require('./middlewares/jwt')

// Configuration via environment variables
const port = process.env.PORT || 3000

const app = express()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Configure CORS via the middleware
app.use(corsMiddleware)
// Configure JWT via our custom middleware
app.use(jwtMiddleware);

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


// Connect imported routes to Express
app.use('/', routes)