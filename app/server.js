var express = require('express'),
  http = require('http'),
  path = require('path'),
  request = require('request'),
  io = require('socket.io');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.compress());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res) {
  res.render('index', { title: 'Oauth Test' });
});


var server = http.createServer(app);
var serverio = io.listen(server).set('log level', 2);

var Instagram = require('instagram-node-lib');
var _ = require('underscore');

Instagram.set('client_id', process.env.INSTAGRAM_CLIENT_KEY);
Instagram.set('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
Instagram.set('redirect_uri', 'http://localhost:3000/oauthredirect');


// http://instagram.com/developer/authentication/

app.get('/authenticate', function(req, res) {
  var url = "https://api.instagram.com/oauth/authorize/?client_id=" + 
                Instagram._config['client_id'] +
                "&redirect_uri=" + 
                Instagram._config['redirect_uri'] + 
                "&response_type=code";

  res.redirect(url);
});


app.get('/oauthredirect', function(req, res) {

  var code = req.query.code;

  console.log("Code: " + code);

  var options = {
    client_id: Instagram._config['client_id'],
    client_secret: Instagram._config['client_secret'],
    redirect_uri: Instagram._config['redirect_uri'],
    grant_type: "authorization_code",
    code: code
  };

  console.log(options)

  var url = 'https://api.instagram.com/oauth/access_token';

  request.post(url, {form: options}, function (e, r, body) {
    serverio.sockets.emit('response', body);
  });

  res.render('code', { title: 'Oauth Test' });
});


serverio.sockets.on('connection', function(socket) {  
  console.log("Connected to socket: " + socket);
});




server.listen(app.get('port'));
console.log('listening on port ' + app.get('port'));



