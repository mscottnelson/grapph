process.env.NODE_ENV = 'test';

var db = require('../models');

require('chai').should();

before(function(done) {
  db.sequelize.sync({ force: true }).then(function() {
    return done();
  });
});
