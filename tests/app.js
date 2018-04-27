var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
var mustache = require('mustache');
var fs = require('fs');
var constData = require('./const');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session);

var identityKey = 'skey';
var users = require('./users').items;

var app = express();

var findUser = function(name, password){
    return users.find(function(item){
        return item.name === name && item.password === password;
    });
};

app.set('views', 'views/');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var con = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test123",
  database: "test"
});

var redisClient = redis.createClient(6379, '127.0.0.1', {auth_pass: 'password'});
app.use(session({
  name: identityKey,
  secret: 'ethgame',
  store: new RedisStore({client: redisClient}),
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: 1000 * 1000
  }
}));

var UI_tag = "<UI_tag></UI_tag>"
var UI_replace =
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">' +
    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">'
    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>' +
    '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>' +
    '<link rel="stylesheet" href="css/canvasCSS_testBootstrap.css">' +
    '<link rel="stylesheet" href="css/Bootstrap_customizeExtand.css">' +
    '<script type="text/javascript" src="http://code.jquery.com/jquery.min.js"></script>'
    ;

var header_tag = "<header></header>";
var header_replace =
'<header class="navbar bg-teal navbar-expand col-10 offset-1 navbar-expand-xs"> <!-- Brand/logo -->' +
    '<a class="navbar-brand mr-auto" href="#">' +
    '<img src="images/ethGame_logo.png" alt="logo">' +
    '<p class="black">CRYPTO</p><p class="white">ANIMAL</p>' +
    '</a>' +
    '<!-- Links -->' +
    '<ul class="navbar-nav">' +
      '<li class="nav-item">' +
        '<a class="nav-link black" href="#">SIGN IN</a>' +
      '</li>' +
      '<li class="nav-item">' +
        '<a class="nav-link white" href="#">MARKETPLACE</a>' +
      '</li>' +
    '</ul>' +
  '</header>';

app.get('/', function(req, res, next){
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    res.render('index', {
        isLogined: isLogined,
        name: loginUser || ''
    });
});

app.get('/main', function(req, res) {
  fs.readFile("./mainPageTest.html", "utf8", function(err, html) {
  //fs.readFile("./commonHTML.html", "utf8", function(err, html) {
    //var str = html.replace("<GG>","<QQ>");
    //res.write(str);
    res.write(html);
    res.end();
  });
});

app.get('/monster', function(req,res){
   fs.readFile("./canvasTest_v2.html", "utf8", function(err, html){
     //console.log(constData);
     var imagesList = { monsters: []};
     var imageURLs = {};
     var i;

     for(i = 0; i < req.query.num; i++){
            console.log(req.query.bg[i]);
      imageURLs = {
        num: i,
        bg: req.protocol + '://' + req.get('host') + '/images/bg/' + constData.BG[Math.floor(Math.random() * constData.BG.length)] + '_00_bg.jpg',
        shadow: req.protocol + '://' + req.get('host') + '/images/shadow/' + constData.SHADOW + '.png',
        b_deco: req.protocol + '://' + req.get('host') + '/images/b_deco/' + constData.B_DECO[Math.floor(Math.random() * constData.B_DECO.length)] + '_06_deco.png',
        tail: req.protocol + '://' + req.get('host') + '/images/char/tail/' + constData.CHAR[Math.floor(Math.random() * constData.CHAR.length)] + '_05_tail.png',
        hand: req.protocol + '://' + req.get('host') + '/images/char/feet/hand/' + constData.CHAR[Math.floor(Math.random() * constData.CHAR.length)] + '_03_hand.png',
        leg: req.protocol + '://' + req.get('host') + '/images/char/feet/leg/' + constData.CHAR[Math.floor(Math.random() * constData.CHAR.length)] + '_04_leg.png',
        body: req.protocol + '://' + req.get('host') + '/images/char/body/' + constData.CHAR[Math.floor(Math.random() * constData.CHAR.length)] + '_02_body.png',
        head: req.protocol + '://' + req.get('host') + '/images/char/head/' + constData.CHAR[Math.floor(Math.random() * constData.CHAR.length)] + '_01_head.png',
        f_deco: req.protocol + '://' + req.get('host') + '/images/f_deco/' + constData.F_DECO[Math.floor(Math.random() * constData.F_DECO.length)] + '_07_deco.png'
      }
      imagesList.monsters.push(imageURLs);
      console.log(imageURLs);
    }
     res.write(mustache.to_html(html, imagesList))
     res.end()
  })
})
//User Management
app.post('/auth/login', function(req,res,next){
  var sess = req.session;
  var user = findUser(req.body.name, req.body.password);

  if(user){
      req.session.regenerate(function(err) {
          if(err){
              return res.json({ret_code: 2, ret_msg: '登录失败'});
          }

          req.session.loginUser = user.name;
          res.json({ret_code: 0, ret_msg: '登录成功'});
      });
  }else{
      res.json({ret_code: 1, ret_msg: '账号或密码错误'});
  }
});

app.get('/auth/logout', function(req,res,next){
  req.session.destroy(function(err) {
      if(err){
          res.json({ret_code: 2, ret_msg: '退出登录失败'});
          return;
      }

      // req.session.loginUser = null;
      res.clearCookie(identityKey);
      res.redirect('/');
  });
});

app.get('/auth/user', function(req,res,next){

})

app.post('/auth/signup', function(req,res,next){

})

app.get('/me', function(req,res,next){

})

app.get('/me/collecton', function(req,res,next){

})
//End of User Management

//Game Management
app.get('/game/leaderboard', function(req,res,next){

})

app.get('/game/get_opponent', function(req,res,next){

})

app.post('/game/joinMatch', function(req,res,next){

})
//End of Game Management

app.listen(3001,function () {
  console.log("Server running... on port 3001");
});
