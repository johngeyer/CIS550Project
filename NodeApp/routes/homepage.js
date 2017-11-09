var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host :'baseballdata.cu9ww8beiiup.us-east-2.rds.amazonaws.com',
  user     : 'johngeyer',
  password : '10370Buxton!',
  database : 'CIS550'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'homepage.html'));
});

router.get('/player', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'player.html'));
});

router.get('/team', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'team.html'));
});

// This method is to get the players data based on the query
router.get('/player/:name', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  console.log("inside player name");
  var query = 'SELECT P.nameFirst, P.nameLast FROM Players P';
  // you may change the query during implementation
  var name = req.params.name;
  if (name != 'undefined') query = query + ' WHERE P.nameFirst = "' + name + '"' ;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});

/* This method is to get the players data based on the query
router.get('/player/:name', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log("inside person email");
  var query = 'SELECT P.login, P.name, P.sex, P.relationshipStatus, P.birthyear, Count(F.friend) AS numberOfFriends from Person P';
  query = query + ' LEFT JOIN Friends F ON P.login = F.login';
  // you may change the query during implementation
  var email = req.params.email;
  if (email != 'undefined') query = query + ' WHERE P.login ="' + email + '"' ;
  query = query + ' GROUP BY P.login, P.name, P.sex, P.relationshipStatus, P.birthyear';
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});
*/



module.exports = router;
