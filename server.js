var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var nunjucks = require('nunjucks');
var markdown = require('nunjucks-markdown');
var marked = require('marked');
var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch');
var passport = require('passport');
var routes = require('./routes');
var processImage = require('express-processimage');

// Load environment variables from .env file
dotenv.load();

// Passport OAuth strategies
require('./config/passport');

var app = express();

mongoose.connect(process.env.DB_PATH);

mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// view engine setup
var njks = nunjucks.configure('views', {
  autoescape: true,
  express: app,
  marked: true
});

markdown.register(njks, marked);

app.set('view engine', 'html');
app.set('port', process.env.PORT || 3998);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

/*
* https://www.npmjs.com/package/express-processimage
* pacote de thumb pra corrigir o issue:  https://libregit.org/libreflix/libreflix/issues/19
* instrução pra recortar uma imagem https://github.com/papandreou/express-processimage/issues/14
*/

app.use(processImage(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup Routes
 */
routes.init(app, passport);
uploadDir = path.join(__dirname, '/public/media/');

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
