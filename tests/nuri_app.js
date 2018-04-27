var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var mustache = require('mustache');
var fs = require('fs');
var constData = require('./const');

var app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test123",
  database: "test"
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


app.listen(3001,function () {
  console.log("Server running... on port 3001");
});
