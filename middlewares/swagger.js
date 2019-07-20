const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const packageVersion = require('../package.json').version

module.exports = swaggerUi.setup(swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Internet Radio Metadata API',
      version: packageVersion,
      description: 'API that retrieves the Now Playing metadata of radio streams via the node-internet-radio module'
    },
    host: 'localhost:3000',
    basePath: '/'
  },
  apis: ['routes/routes.js']
}))
