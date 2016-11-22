var User = require('../../models').User;

module.exports = function(req, res, next) {
  res.locals.isAuthenticated = function() {
    return !!req.user;
  };
  if (req.session.user_id) {
    User.findById(req.session.user_id)
      .then(function(user) {
        req.user = user;
        res.locals.user = user;
        next();
      })
  } else {
    next();
  }
};
