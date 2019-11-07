var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var videosRouter = require('./routes/videos');
var streamRouter = require('./routes/stream');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded())
app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/videos', videosRouter);
app.use('/stream', streamRouter);

app.use(bodyParser.json()); 
app.use(upload.array()); 
app.use(express.static('public'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.log("Some error");
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  /*
  res.status(err.status || 500);
  res.render('error');
  */
 // console.log(err);
});

app.on('listening', function () {
    // server ready to accept connections here
    console.log("server started");
});
module.exports = app;
