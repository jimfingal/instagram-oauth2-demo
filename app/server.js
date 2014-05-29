var express = require('express'),
  http = require('http'),
  path = require('path'),
  request = require('request'),
  io = require('socket.io');



var CLIENT_ID = process.env.INSTAGRAM_CLIENT_KEY;
var CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
// This must be redirect URL set with Instagram
var REDIRECT_URI = 'http://localhost:3000/oauthredirect';

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.render('index', { title: 'Oauth Test' });
});

app.get('/clientid', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI }));
});

app.get('/clientside', function(req, res) {
  res.render('clientside', { title: 'Oauth Test' });
});


var server = http.createServer(app);
var serverio = io.listen(server).set('log level', 2);


app.get('/authenticate', function(req, res) {
  var url = "https://api.instagram.com/oauth/authorize/?client_id=" + 
                CLIENT_ID +
                "&redirect_uri=" + 
                REDIRECT_URI + 
                "&response_type=code";

  res.redirect(url);
});


app.get('/oauthredirect', function(req, res) {

  console.log(req.query);
  var code = req.query.code;
  var token = req.query.access_token;

  if (code) {

    console.log("Code: " + code);

    var options = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      code: code
    };

    var url = 'https://api.instagram.com/oauth/access_token';

    request.post(url, {form: options}, function (e, r, body) {
      serverio.sockets.emit('response', body);
    });

  }

  res.render('code', { title: 'Oauth Response' });
});


serverio.sockets.on('connection', function(socket) {  
  console.log("Connected to socket: " + socket);
});



server.listen(app.get('port'));
console.log('listening on port ' + app.get('port'));



