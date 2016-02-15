var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');
var ejs_mate = require('ejs-mate');
var MongoStore = require('connect-mongo/es5')(session);
var secret = require('./config/secret');
var Widget = require('./models/widget');
var User = require('./models/users');

var app = express();

mongoose.connect(secret.database, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log('connected to db')
  }
})



app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({url: secret.database , autoReconnect: true})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
  res.send('Hello World');
});

app.get('/widgets', function(req, res, next) {
  Widget.find({}, function(err, widgets) {
    res.status(200).send(widgets)
  });
});

app.get('/widgets/:id', function(req, res, next) {
  Widget.find({ _id: req.params.id }, function(err, widget) {
    if (err) return next(err);
    res.status(200).send(widget);
  });
});

app.put('/widgets/:id', function(req, res, next) {
  Widget.findOne({ _id: req.params.id }, function(err, widget) {
    if(err) return next(err);
    if(req.body.name) widget.name = req.body.name; 
    if(req.body.price) widget.price = req.body.price;
    if(req.body.color) widget.color = req.body.color;
    if(req.body.inventory) widget.inventory = req.body.inventory;
    if(req.body.melts) widget.melts = req.body.melts;
    widget.save(function(err){
      if(err) return next(err);
      res.status(200).send(widget);
    });
  });
});

app.post('/widgets', function(req, res, next) {
  var widget = new Widget();
  widget.name = req.body.name;
  widget.price = req.body.price;
  widget.color = req.body.color;
  widget.inventory = req.body.inventory;
  widget.melts = req.body.melts;

  widget.save(function(err){
    if (err) return next(err);
    res.status(200).send(widget);
  });
});

app.post('/users', function(req, res, next) {
  var user = new User();
  user.name = req.body.name;
  user.gravatar = user.picture();

  user.save(function(err) {
    if(err) return next(err);
    res.status(200).send(user);
  });
});

app.get('/users', function(req, res, next) {
  User.find({}, function(err, user) {
    if(err) return next(err);
    res.status(200).send(user);
  });
});

app.get('/users/:id', function(req, res, next) {
  User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) return next(err);
      res.status(200).send(user);
  });
});


app.listen(secret.port, function(err){
  if(err) throw err;
  console.log('Server Running ok')
});