const routes = require('express').Router()
const { query } = require('express-validator/check')
const nowPlaying = require('./controllers/now-playing')

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
 *        example: http%3A%2F%2F79.111.119.111%3A9107%2F%3B
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
 *          description: Validation error - url was not provided
 *        502:
 *          description: Failed to retrieve metadata from the provided URL
 */
routes.get('/now-playing', query('url').exists(), nowPlaying.apiGET)

module.exports = routes
