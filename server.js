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
var i18n = require("i18n");
var cookieParser = require('cookie-parser');
var minifyHTML = require('express-minify-html');
var device = require('express-device');
const pjson = require('./package.json');

// Load environment variables from .env file
dotenv.load();

// Passport OAuth strategies
require('./config/passport');

var app = express()
app.use(cookieParser())
app.use(device.capture())

mongoose.connect(process.env.DB_PATH);

mongoose.set('debug', false);

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

// i18n options
i18n.configure({
    locales:['pt', 'en', 'es'],
    defaultLocale: 'pt',
    queryParameter: 'lang',
    cookie: 'siteLang',
    directoryPermissions: '775',
    autoReload: true,
    updateFiles: false,
    directory: __dirname + '/public/locales',
    api: {
     '__': 't',  //now req.__ becomes req.t
   }
});

app.use(i18n.init);



/* Minify options */
// app.use(minifyHTML({
//     override:      true,
//     exception_url: true,
//     htmlMinifier: {
//         removeComments:            false,
//         collapseWhitespace:        false,
//         collapseBooleanAttributes: false,
//         removeAttributeQuotes:     false,
//         removeEmptyAttributes:     false,
//         minifyJS:                  true
//     }
// }));


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
  res.locals.appVersion = pjson.version;
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
