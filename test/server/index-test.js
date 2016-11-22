'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest');

describe('server', function() {
    it('should respond with "Hello world!" on /', function(done) {
        request(app)
            .get('/')
            .expect(200, /Hello world!/, done);
    });
});
