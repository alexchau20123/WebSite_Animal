var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var mustache = require('mustache');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

var con = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test123",
  database: "test"
});

app.listen(3000,function () {
  console.log("Server running... on port 3000")
});
