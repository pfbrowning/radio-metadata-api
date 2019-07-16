const express = require('express')
const swaggerUi = require('swagger-ui-express')
const routes = require('./routes/routes')
const corsMiddleware = require('./middlewares/cors')
const jwtMiddleware = require('./middlewares/jwt')
const swaggerMiddleware = require('./middlewares/swagger')

// Configuration via environment variables
const port = process.env.PORT || 3000

const app = express()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Configure CORS, JWT, & Swagger via custom middlewares
app.use(corsMiddleware)
app.use(jwtMiddleware);
app.use('/swagger', swaggerUi.serve, swaggerMiddleware)

// Connect imported routes to Express
app.use('/', routes)