var express = require('express');
var router = express.Router();
var THREE = require('three');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// io.on("connection",function(socket){
//   console.log("yaw: " + yaw + ", roll: " + roll + ", pitch" + pitch);
//   socket.emit('orientation', {yaw: yaw,roll: roll,pitch: pitch});
// });

module.exports = router;