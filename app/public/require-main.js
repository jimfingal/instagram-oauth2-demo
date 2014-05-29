require.config({
    'baseUrl': '.',
    'paths': {
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'socket.io' : 'bower_components/socket.io-client/dist/socket.io.min',
    },
    'shim': {
        'jquery': {
            exports: 'jQuery'
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'bootstrap': {
          deps: ['jquery']
        }
    },
});

require(['socket.io', 'jquery', 'jquery-ui', 'bootstrap'],
  function(io, $) {

    var loc = window.location;
    var url = location.protocol + '//' + location.hostname + ':' + location.port;

    var socket = io.connect(url);

    socket.on('disconnect', function () {
     console.log('Socket disconnected.');
    });

    socket.on('connect', function () {
     console.log('Socket connected.');
    });

    $("#login").click(function() {
        window.location = url + '/authenticate';
    });

    socket.on('response', function (json_text) {
      var json = $.parseJSON(json_text);
      $('#access_token').html("<h2>Access token</h2><p>" + json['access_token'] + "</p>");
      $('#username').html("<h2>Username</h2><p>" + json['user']['username'] + "</p>");
      $('#full_name').html("<h2>Full Name</h2><p>" + json['user']['full_name'] + "</p>");
      $('#user_id').html("<h2>User ID</h2><p>" + json['user']['id'] + "</p>");
      $('#pic').html("<h2>Profile Picture</h2><p><img src='" + json['user']['profile_picture'] + "'></p>");
    });

    var hash = $(location).attr('hash');

    if (hash) {
      var parts = hash.split('=');
      $('#access_token').html("<h2>Access token</h2><p>" + parts[1] + "</p>");
    };

});

