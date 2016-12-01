var express = require('express'),
router = express.Router();

router.get("/", function(req, res) {
  res.render('index');
});

router.use('/users', require('./routes/users'));
router.use('/weights', require('./routes/weights'));

module.exports = router;
