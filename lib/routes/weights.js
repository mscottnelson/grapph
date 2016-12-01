var express = require('express'),
  router = express.Router(),
  Weight = require('../../models').Weight;

router.get('/list', function(req, res) {
  if(!req.session.user_id){
    //do nothing if there is no user logged in
  } else{
    Weight.findAll({
      where: {
        username: req.session.username
      }
    })
    .then(function(weights) {
      res.format({
        html: function() {
          res.render('weights/listAll', { weights: weights }); // view not implemented as of 11/30
        },
        json: function() {
          res.json(weights);
        }
      });
    });
  }
});

router.post('/new', function(req, res) {
  Weight.create(
    {
      username: req.session.username,
      weight: req.body.weight
    });
  res.redirect('/');
});

router.post('/delete', function(req, res) {
  //not implemented
});

module.exports = router;
