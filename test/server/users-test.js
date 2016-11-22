'use strict';

// load the common test setup code
require('../setup-test');

// code to test
var app = require('../../lib/app');

// libraries
var request = require('supertest-as-promised').agent,
  agent;

var User = require('../../models').User;

describe('users', function() {
  beforeEach(function() {
    agent = request(app);
  });

  after(function() {
    return User.truncate();
  });

  describe('registration', function() {
    it('should have a registration page', function() {
      return agent
        .get('/users/register')
        .expect(200)
    });

    it('should log the new user in', function() {
      return agent
        .post('/users/register')
        .type('form')
        .send({
          username: 'myNewUsername',
          password: 'myFancyPassword',
          password_confirm: 'myFancyPassword'
        })
        .expect(302)
        .expect('Location', '/')
        .then(function() {
          return agent
            .get('/')
            .expect(200, /Hello myNewUsername!/);
          });
    });

    it('should not allow registration if passwords do not match', function() {
      return agent
        .post('/users/register')
        .type('form')
        .send({
          username: 'myNewUsername',
          password: 'myFancyPassword',
          password_confirm: 'myOtherFancyPassword'
        })
        .expect(200, /Passwords must match/);
    });

    describe('when a user already exists', function() {
      var existingUser;
      before(function() {
        return User.create({ username: 'PreExistingUser1', password: 'TheirPassword' })
          .then(function(user) {
            existingUser = user;
          });
      });

      it('should not allow registration of an existing username', function() {
        return agent
          .post('/users/register')
          .type('form')
          .send({
            username: existingUser.username,
            password: 'password',
            password_confirm: 'password'
          })
          .expect(200, /User already exists/);
      });

      it('should tell us the username is not avaialble', function() {
        return agent
          .post('/users/available')
          .type('form')
          .send({ username: existingUser.username })
          .expect(200, { isAvailable: false });
      });

      it('should tell us that another username is available', function() {
        return agent
          .post('/users/available')
          .type('form')
          .send({ username: existingUser.username + "new" })
          .expect(200, { isAvailable: true });
      });
    });
  });

  describe('login', function() {
    it('should have a login page', function() {
      return agent
        .get('/users/login')
        .expect(200);
    });

    it('should not login when there are no users', function() {
      return agent
        .post('/users/login')
        .type('form')
        .send({
          username: 'someUsername',
          password: 'somePassword'
        })
        .expect(200, /User not found/)
        .then(function() {
          return agent
            .post('/users/login')
            .set('Accept', 'application/json')
            .send({
              username: 'someUsername',
              password: 'somePassword'
            })
            .expect(401, { error: 'User does not exist' });
        });
    });

    describe('when there are users', function() {
      before(function() {
        return User.create({ username: 'PreExistingUser', password: 'TheirPassword' });
      });

      after(function() {
        return User.truncate();
      });

      describe('for a form login', function() {
        it('should login the user', function() {
          return agent
            .post('/users/login')
            .type('form')
            .send({
              username: 'PreExistingUser',
              password: 'TheirPassword'
            })
            .expect(302)
            .expect('Location', '/')
            .then(function() {
              return agent
                .get('/')
                .expect(200, /Hello PreExistingUser!/);
            });
        });

        it('should warn the user about incorrect passwords', function() {
          return agent
            .post('/users/login')
            .type('form')
            .send({
              username: 'PreExistingUser',
              password: 'myOtherFancyPassword'
            })
            .expect(200, /Password incorrect/);
        });
      });

      describe('for an API login', function() {
        it('should login the user', function() {
          return agent
            .post('/users/login')
            .set('Accept', 'application/json')
            .send({
              username: 'PreExistingUser',
              password: 'TheirPassword'
            })
            .expect(200, { success: true })
            .then(function() {
              return agent
                .get('/')
                .expect(200, /Hello PreExistingUser!/);
            });
        });

        it('should warn the user about incorrect passwords', function() {
          return agent
            .post('/users/login')
            .set('Accept', 'application/json')
            .send({
              username: 'PreExistingUser',
              password: 'myOtherFancyPassword'
            })
            .expect(401, { error: 'Password incorrect' });
        });
      });
    });
  });
});
