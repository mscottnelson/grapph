'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    redis = require('connect-redis'),
    app = express();

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}

app.set('view engine', 'jade');
app.set('views', './views');
app.use(cookieParser());
app.use(express.static('public'));

var RedisStore = redis(session);
var myRedis;

/* istanbul ignore next */
if (process.env.REDIS_URL) {
  myRedis = new RedisStore({ url: process.env.REDIS_URL });
} else {
  myRedis = new RedisStore();
}
app.use(session({
  secret: 'Shhhhh!',
  resave: false,
  saveUninitialized: false,
  store: myRedis
}));

// to extract form data from POST bodies
app.use(bodyParser.json());                         // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(require('./middleware/loggedInUser'));

app.use(require('./routes'));

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  require('express-debug')(app);
}

// allow other modules to use the server
module.exports = app;
