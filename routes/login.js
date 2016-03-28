var express = require('express');

var router = express.Router();

router.get('/', function(req, res){
  res.render('login.html');
});

router.get('/truck.jpg', function(req, res) {
  res.sendFile('truck.jpg');
});

module.exports = router;