const isBlank = require('is-blank')
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const audience = process.env.audience
let issuer = process.env.issuer

/* If audience and issuer are present, then use RS256 JWT
Bearer Token authentication for all requests *except* the
Swagger UI. Otherwise export an empty middleware in order
to not use JWT logic at all.*/
if (!isBlank(issuer) && !isBlank(audience)) {
    // Fix issuer if it doesn't contain a trailing slash
    if (!issuer.endsWith('/')) {
        issuer = `${issuer}/`
    }
    module.exports = jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${issuer}.well-known/jwks.json`
        }),
        audience: audience,
        issuer: issuer,
        algorithms: ['RS256']
    }).unless({ path: ['/swagger'] })
} else {
    module.exports = function(req, res, next) {
        next();
    }
}