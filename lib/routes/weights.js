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
          res.render('weights/listAll', { weights: weights });
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
    })
    .then(function(weight){
      req.session.save(function() {
        res.redirect('list');
      })
    });
});

router.post('/delete', function(req, res) {
  Weight.findById(req.body.id)
  .then(function(weight){
    weight.markForRemoval();
  })
  .then(function(weight){
    req.session.save(function(){
      res.redirect('list');
    })
  })
});

module.exports = router;
