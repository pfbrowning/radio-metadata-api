const express = require('express')
const swaggerUi = require('swagger-ui-express')
const morgan = require('morgan')
const routes = require('./routes/routes')
const corsMiddleware = require('./middlewares/cors')
const jwtMiddleware = require('./middlewares/jwt')
const swaggerMiddleware = require('./middlewares/swagger')
const errorMiddleware = require('./middlewares/error')
const logger = require('./logger')

// Configuration via environment variables
const port = process.env.PORT || 3000

const app = express()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Configure CORS, JWT, & Swagger via custom middlewares
app.use('/swagger', swaggerUi.serve, swaggerMiddleware)
app.use(corsMiddleware)
app.use(jwtMiddleware)

// Log HTTP Requests
app.use(morgan('short', { stream: logger.stream }))

// Connect imported routes to Express
app.use('/', routes)

/* Run the error middleware last to catch any errors
which happened in the controllers. */
app.use(errorMiddleware)
