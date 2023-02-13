process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
let createError = require('http-errors');
let express = require('express');
let glob = require('glob');
let path = require('path');
let config = require('./config');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

var cors = require('cors'); // 임시사용

let app = express();

var bodyParser = require('body-parser'); //POST 방식 전송을 위해서 필요함                                               
require('events').EventEmitter.prototype._maxListeners = 100;
app.use(cookieParser());

// view enfine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('layout', 'layout');
app.use(expressLayouts);
app.set("layout extractScripts", true);

app.use(logger('dev'));
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS 설정
app.use(cors()); // 임시사용

//session & database
let session = require('express-session');

let MySQLStore = require('express-mysql-session')(session); 
// mysql session store 방식
var options = {
	host: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.HOST:config.DATABASE_INFO.dev.HOST,
	port: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.PORT:config.DATABASE_INFO.dev.PORT,
	user: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.USER:config.DATABASE_INFO.dev.USER,
	password: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.PASSWORD:config.DATABASE_INFO.dev.PASSWORD,
  database: process.env.NODE_ENV=='production'?config.DATABASE_INFO.pro.DATABASE:config.DATABASE_INFO.dev.DATABASE,
	expiration: 86400000, // The maximum age of a valid session; milliseconds:
};
let sessionStore = new MySQLStore(options);

app.use(session({
	key: 'S_DATA',
  secret: 'FFAFDSA#$$$ghewirEhdgoanfrhk@!',
	store: sessionStore,
	resave: false,
	saveUninitialized: true
}));

// 세션을 담아놓는다.
app.use(function (req, res, next) {
  if (typeof req.session.auth !== 'undefined'){
      res.locals.isLogin = (req.session.auth > 0);
      res.locals.auth = req.session.auth;
      res.locals.memberInfo = req.session.memberInfo; 
  } else {
      res.locals.isLogin = false;
      res.locals.auth = req.session.auth;
      res.locals.memberInfo = {};
  }
  next();
});

// settings for page layout
app.use('/front/*', function (req, res, next) {
  app.set('layout', 'frnt_layout');
  app.set('views', path.join(__dirname, 'views/front'));
  next();
});

app.use('/admin/*', function (req, res, next) {
  app.set('layout', 'ad_layout');
  app.set('views', path.join(__dirname, 'views/admin'));
  next();
});

app.use('/admin/popup/*', function (req, res, next) {
  app.set('layout', 'partner_fee_popup');
  app.set('views', path.join(__dirname, 'views/admin/popup'));
  next();
});

// 로그인 관련 처리 auth 
let zThorizer = require('./modules/authenticate');
app.use(function (req, res, next) {
    let authTestResult = zThorizer.authenticate(req);
    console.log(`authTestResult=[${authTestResult}]`);
    switch (authTestResult) {
        case 1 :
            //승인
            next();
            break;
        case 0 :
            //권한없음
            res.redirect('/');
            break;
        case -1 :
            //로그인필요
            res.redirect('/');
            break;
    }
});

// settings for routes
let routes = glob.sync('routes/**/*.js');
routes.forEach(function (file) {
    let route = file.substr(6, file.length - 9);
    route = route.replace('index', '');
    app.use(route, require('./' + file)(app));
});

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

let passport = require('passport');
app.use(passport.initialize())
app.use(passport.session())

module.exports = app;