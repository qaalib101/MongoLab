var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var session = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var passportConfig = require('./config/passport')(passport);



var config = require('./config/db_config');
var db_url = process.env.MONGO_URL;

mongoose.connect(db_url)
    .then(() => {console.log('Connected to mLab');})
    .catch((err) => {console.log('Error connecting to mLab', err); });


var auth = require('./routes/auth');
var tasks = require('./routes/tasks');
var users = require('./routes/users');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret: 'top secret', resave: false, saveUninitialized: false}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

var store = MongoDBStore({uri: db_url, collection: 'tasks'});
 app.use(session({
     secret: 'top secret',
     resave: true,
     saveUninitialized: true,
     store:store
 }));
 app.use(passport.initialize());
 app.use(passport.session());

app.use('/auth', auth);
app.use('/', tasks);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    if(err.kind === 'ObjectId' && err.name == 'CastError'){
      err.status = 404;
      err.message = "ObjectId Not Found";
    }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.kind);
  console.log(err.name);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
