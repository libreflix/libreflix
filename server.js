import express from 'express';
const path = require('path');
const logger = require('morgan');
const compression = require('compression');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const mongoose = require('mongoose');
const passport = require('passport');
const routes = require('./routes');
const processImage = require('express-processimage');
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/title.js';

// Load environment variables from .env file
dotenv.load();

// Passport OAuth strategies
require('./config/passport');

const app = express();


const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true,  useUnifiedTopology: true, });

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
app.set('uploadDir', path.join(__dirname, '/public/media/'));
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
