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

   fs.readFile("./canvasTest_v3.html", "utf8", function(err, html){
     //console.log(constData);

     var monsterPageString = "SELECT count(*) count FROM t_monsterList where userId = ? GROUP BY userId";
     var monsterPageValue = req.query.id;
     con.query(monsterPageString, monsterPageValue, function (err, pageData) {

          var monsterDataString = "SELECT bg, b_deco, tail, feet, body, head, f_deco FROM t_monsterList WHERE userId = ? LIMIT ? OFFSET ?";
          var pageSize = 10;
          var offset = (req.query.pageNum - 1) * pageSize;
          var monsterDataValue = [req.query.id, pageSize, offset];
          con.query(monsterDataString, monsterDataValue, function (err, monsterData) {

            var imagesList = { page: [], monsters: []};
            var imageURLs = {};
            var i;

            //console.log(pageData[0].count);
            // push page detail info in imagesList
            for (var j = 0; j < pageData[0].count /pageSize; j++) {
              var pc = "page-item";
              if (req.query.pageNum == j + 1) {
                pc = "page-item active";
              }

              var tmp = { pageClass:  pc, numOfPageLink: "/monster?id=" + req.query.id + "&pageNum=" + (j + 1), numOfPage: j + 1};
              //console.log(tmp);
              imagesList.page.push(tmp);
            }

            // push monster detail info in imageList
            for(i = 0; i < monsterData.length; i++){
               imageURLs = {
                 num: i,
                 bg: req.protocol + '://' + req.get('host') + '/images/bg/' + constData.BG[monsterData[i].bg] + '_00_bg.jpg',
                 shadow: req.protocol + '://' + req.get('host') + '/images/shadow/' + constData.SHADOW + '.png',
                 b_deco: req.protocol + '://' + req.get('host') + '/images/b_deco/' + constData.B_DECO[monsterData[i].b_deco] + '_06_deco.png',
                 tail: req.protocol + '://' + req.get('host') + '/images/char/tail/' + constData.CHAR[monsterData[i].tail] + '_05_tail.png',
                 hand: req.protocol + '://' + req.get('host') + '/images/char/feet/hand/' + constData.CHAR[monsterData[i].feet] + '_03_hand.png',
                 leg: req.protocol + '://' + req.get('host') + '/images/char/feet/leg/' + constData.CHAR[monsterData[i].feet] + '_04_leg.png',
                 body: req.protocol + '://' + req.get('host') + '/images/char/body/' + constData.CHAR[monsterData[i].body] + '_02_body.png',
                 head: req.protocol + '://' + req.get('host') + '/images/char/head/' + constData.CHAR[monsterData[i].head] + '_01_head.png',
                 f_deco: req.protocol + '://' + req.get('host') + '/images/f_deco/' + constData.F_DECO[monsterData[i].f_deco] + '_07_deco.png'
               }
             imagesList.monsters.push(imageURLs);
             //console.log(imageURLs);
             }
             res.write(mustache.to_html(html, imagesList));
             res.end();

          });
     });
  });
});


app.listen(48763,function () {
  console.log("Server running... on port 48763");
});
