var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var five = require("johnny-five")
  , board = new five.Board();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function(req, res, next){
  res.io = io;
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

board.on("ready", function() {
    // Get the imu data from the board here
    var imu = new five.IMU({
      controller: "BNO055"
    });

    imu.orientation.on("change", function() {
      console.log("orientation");
      console.log("  w            : ", this.quarternion.w);
      console.log("  x            : ", this.quarternion.x);
      console.log("  y            : ", this.quarternion.y);
      console.log("  z            : ", this.quarternion.z);

      console.log("  heading      : ", this.euler.heading);
      console.log("  roll         : ", this.euler.roll);
      console.log("  pitch        : ", this.euler.pitch);

      console.log("  acc x        : ", this.euler.heading);
      console.log("  acc y        : ", this.euler.roll);
      console.log("  acc z        : ", this.euler.pitch);

      console.log("--------------------------------------");
      yaw = this.euler.heading;
      roll = this.euler.roll;
      pitch = this.euler.pitch;
      
      // console.log(board.Accelerometer.board);

      io.emit("socketToMe", {yaw: yaw,roll: roll,pitch: pitch});
    });

    // this.i2cConfig(address: );
    // this.i2cRead(0x0A, 0, function(data) {
    //   console.log("  ✔ received data (exiting)");
    //   console.log("------------------------------");
    //   console.log(data);
    // });
    // new five.IMU({
    //   controller: "BNO055",
    //   address: 0x68, // optional
    //   freq: 100      // optional
    // });
});


module.exports = {app: app, server: server};