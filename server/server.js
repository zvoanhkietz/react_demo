var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(5000);

var users = ['nhoang', 'ttuan', 'pan', 'krol', 'lno', 'dan', 'hquyen'];

app.get('/updateResult', function (req, res) {
  var rank = {
    username:req.query.username,
    question: req.query.question,
    grade: parseInt(req.query.grade)
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(rank));
  io.emit('update ranking', rank);
});


app.get('/ranking', function (req, res) {
  var xRank = [];
  users.forEach(function(user){
      var tmp = {};
      tmp.username = user;
      tmp.q1 = 0;
      tmp.q2 = 0;
      tmp.q3 = 0;
      tmp.q4 = 0;
      tmp.total = 0;
      xRank.push(tmp);
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(JSON.stringify({data: xRank}));
});
