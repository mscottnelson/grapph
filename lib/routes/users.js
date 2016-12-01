var express = require('express'),
  router = express.Router(),
  User = require('../../models').User;

router.get("/register", function(req, res) {
  res.render('users/register');
});

router.post('/register', function(req, res) {
  if (req.body.password !== req.body.password_confirm) {
    res.end('Passwords must match');
  } else {
    User.findOne({ where: { username: req.body.username }})
      .then(function(existingUser) {
        if (existingUser) {
          res.end('User already exists');
        } else {
          User.create(req.body).then(function(user) {
            req.session.user_id = user.id;
            req.session.username = req.body.username;
            req.session.save(function() {
              res.redirect('/');
            });
          });
        }
      });
  }
});

router.get('/login', function(req, res) {
  res.render('users/login');
});

router.post('/login', function(req, res) {
  User.findOne({ where: { username: req.body.username }})
    .then(function(user) {
      res.format({
        html: function() {
          if (!user) {
            res.end('User not found');
          } else if (user.isValidPassword(req.body.password)) {
            req.session.user_id = user.id;
            req.session.username = req.body.username;
            req.session.save(function() {
              res.redirect('/');
            });
          } else {
            res.end('Password incorrect');
          }
        },
        json: function() {
          if (!user) {
            res.status(401).json({ error: 'User does not exist' });
          } else if (user.isValidPassword(req.body.password)) {
            req.session.user_id = user.id;
            req.session.username = req.body.username;
            req.session.save(function() {
              res.json({ success: true });
            });
          } else {
            res.status(401).json({ error: 'Password incorrect' });
          }
        }
      });
    });
});

router.post('/available', function(req, res) {
  User.findOne({ where: { username: req.body.username }})
    .then(function(user) {
      res.json({ isAvailable: !user });
    });
});

router.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

module.exports = router;
