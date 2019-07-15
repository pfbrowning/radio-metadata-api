const proxyquire = require('proxyquire');

describe('index.ts', () => {
    let express;

    beforeEach(() => {
        express = jasmine.createSpyObj('express', ['listen', 'use']);
        // Clear each env variable that we care about before each test
        delete process.env.PORT;
        delete process.env.allowedCorsOrigins;
        delete process.env.audience;
        delete process.env.issuer;
    });

    it('should listen on port 3000 by default', (done) => {
        // Act: Initialize the index
        const index = proxyquire('../index', {
            'express': () => express
        });
        // Assert: express.listen should have been called once specifying port 3000
        expect(express.listen).toHaveBeenCalledTimes(1);
        expect(express.listen.calls.mostRecent().args[0]).toBe(3000);
        done();
    });

    it('should listen on the port specified by PORT', (done) => {
        // Arrange: Set a custom port value
        process.env.PORT = 42;
        // Act: Initialize the index
        const index = proxyquire('../index', {
            'express': () => express
        });
        // Assert: Listen should have specified the custom port
        expect(express.listen).toHaveBeenCalledTimes(1);
        expect(express.listen.calls.mostRecent().args[0]).toBe('42');
        done();
    });

    it('should enable CORS with the expected origin based on the value of allowedCorsOrigins', (done) => {
        // Arrange: Define a set of expectations
        const testEntries = [
            { allowedCorsOrigins: null, expectedCorsParams: [] },
            { allowedCorsOrigins: 'http://localhost:4200', expectedCorsParams: [] },
            { allowedCorsOrigins: '{"origin":"http://localhost:4200"}', expectedCorsParams: [] },
            { allowedCorsOrigins: '{}', expectedCorsParams: [] },
            {
                allowedCorsOrigins: '["http://localhost:4200","http://publishedspa.com"]', 
                expectedCorsParams: [ { origin: ["http://localhost:4200","http://publishedspa.com"] } ]
            },
            {
                allowedCorsOrigins: '["http://localhost:4200"]', 
                expectedCorsParams: [ { origin: ["http://localhost:4200"] } ]
            }
        ];

        // For each expectation
        testEntries.forEach(testEntry => {
            // Act
            // If the input value is non-null, set the environment variable accordingly
            if(testEntry.allowedCorsOrigins) process.env.allowedCorsOrigins = testEntry.allowedCorsOrigins;
            /* Recreate the CORS spy once for each iteration so that we can always check
            that it's been called exactly once. */
            cors = jasmine.createSpy('cors');
            // Initialize index with the relevant spies
            const index = proxyquire('../index', {
                'express': () => express,
                'cors': cors
            });
            // Assert that CORS was called with the expected params
            expect(cors).toHaveBeenCalledTimes(1);
            expect(cors.calls.mostRecent().args).toEqual(testEntry.expectedCorsParams);
        })

        done();
    });

    it('should configure swagger', (done) => {
        // Act: Initialize index
        const index = proxyquire('../index', {
            'express': () => express
        });
        // Assert that the swagger endpoint was configured
        expect(express.use).toHaveBeenCalledWith('/swagger', jasmine.anything(), jasmine.anything());

        done();
    });

    it('should configure jwt authentication based on the provided values for issuer & audience', (done) => {
        // Arrange: Define a dummy set of input & expectation data
        const testEntries = [
            { issuer: null, audience: null, useJwt: false },
            { issuer: null, audience: 'audience', useJwt: false },
            { issuer: 'issuer', audience: null, useJwt: false },
            { issuer: '     ', audience: '    ', useJwt: false },
            {
                issuer: 'http://issuer.com', 
                audience: 'fancy-audience',
                useJwt: true,
                expectedJwtParams: {
                    secret: 'jwks-factory',
                    audience: 'fancy-audience',
                    issuer: 'http://issuer.com/',
                    algorithms: ['RS256']
                },
                expectedJwksParams: {
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: `http://issuer.com/.well-known/jwks.json`
                }
            },
            {
                issuer: 'http://another-issuer.com/', 
                audience: 'another-audience',
                useJwt: true,
                expectedJwtParams: {
                    secret: 'jwks-factory',
                    audience: 'another-audience',
                    issuer: 'http://another-issuer.com/',
                    algorithms: ['RS256']
                },
                expectedJwksParams: {
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: `http://another-issuer.com/.well-known/jwks.json`
                }
            }
        ];

        // For each dummy input / expectation
        testEntries.forEach(testEntry => {
            // Arrange
            // Clear & reassign 'audience' & 'issuer' based on the test input
            delete process.env.audience;
            delete process.env.issuer;
            if(testEntry.issuer) process.env.issuer = testEntry.issuer;
            if(testEntry.audience) process.env.audience = testEntry.audience;
            // Configure spies to test the jwt configuration
            const unless = jasmine.createSpy('unless');
            const jwt = jasmine.createSpy('jwt').and.returnValue({unless})
            const jwksRsa = jasmine.createSpyObj('jwks-rsa', [ 'expressJwtSecret' ])
            jwksRsa.expressJwtSecret.and.returnValue('jwks-factory');
            
            // Act: Initialize the index
            const index = proxyquire('../index', {
                'express': () => express,
                'express-jwt': jwt,
                'jwks-rsa': jwksRsa
            });

            // Assert that jwt was configured as per expectations
            if(testEntry.useJwt) {
                expect(jwt).toHaveBeenCalledTimes(1);
                expect(jwt.calls.mostRecent().args[0]).toEqual(testEntry.expectedJwtParams);

                expect(jwksRsa.expressJwtSecret).toHaveBeenCalledTimes(1);
                expect(jwksRsa.expressJwtSecret.calls.mostRecent().args[0]).toEqual(testEntry.expectedJwksParams);

                expect(unless).toHaveBeenCalledTimes(1);
            }
            else {
                expect(jwt).not.toHaveBeenCalled();
                expect(jwksRsa.expressJwtSecret).not.toHaveBeenCalled();
            }

        });

        done();
    });

    it('should use our route configuration', () => {
        // Arrange: Set up a dummy route config object
        const testObj = {'test': 'test'}

        // Act: Initialize index with the relevant spies
        const index = proxyquire('../index', {
            'express': () => express,
            './routes/routes': testObj
        });

        // Assert that the dummy route configuration was set up
        expect(express.use).toHaveBeenCalledWith('/', testObj);
    });
});