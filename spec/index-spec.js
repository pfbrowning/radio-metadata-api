const proxyquire = require('proxyquire');

describe('index.ts', () => {
    let express;

    beforeEach(() => {
        express = jasmine.createSpyObj('express', ['listen', 'use']);
    });

    it('should listen on port 3000 by default', (done) => {
        expect(express.listen).not.toHaveBeenCalled();
        const index = proxyquire('../index', {
            'express': () => express
        });
        expect(express.listen).toHaveBeenCalledTimes(1);
        expect(express.listen.calls.mostRecent().args[0]).toBe(3000);
        done();
    });
});