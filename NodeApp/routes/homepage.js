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

router.get('/search_player', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'search_player.html'));
});

router.get('/player', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'player.html'));
});

router.get('/team', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'team.html'));
});

// This method is to get the players that match the prefix of the name
router.get('/search_player/:name', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  console.log("inside player name");
  var query = 'SELECT P.playerID, P.name, P.birthYear FROM Players P';
  // you may change the query during implementation
  var name = req.params.name;
  if (name != 'undefined') query = query + ' WHERE P.name LIKE "' + name + '%"' ;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        //console.log(rows);
        res.json(rows);
    }  
    });
});

// This method is to get all the player data based on the playerID
router.get('/player/:playerID/:startYear/:endYear', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  console.log("inside player ID");
  
  var query = 'SELECT P.name, P.birthYear, B.yearID, B.teamID, B.G, B.AB, B.R, B.H, B.Doubles, B.Triples, B.HR, B.RBI, B.SB, B.CS, B.BB, B.SO, B.IBB, B.HBP, B.SH, B.SF, B.GIDP ';
  query = query + ' FROM Players P INNER JOIN Batting B ON P.playerID = B.playerID';
  // you may change the query during implementation
  var playerID = req.params.playerID;
  query = query + ' WHERE P.playerID = "' + playerID + '"' ;
  var startYear = req.params.startYear;
  var endYear = req.params.endYear;

  if (startYear != 'undefined') query = query + ' AND B.yearID >= "' + startYear + '"' ;
  if (endYear != 'undefined') query = query + ' AND B.yearID <= "' + endYear + '"' ;

  query = query + ' ORDER BY B.yearID ASC' ;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });

});




module.exports = router;
