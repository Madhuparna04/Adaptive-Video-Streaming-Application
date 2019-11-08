var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');

var app = express();
//mongoose.connect('mongodb://localhost/Users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.set('views', './views');
app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded())

app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
