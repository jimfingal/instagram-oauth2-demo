requirejs(['socket.io', 'jquery', 'jquery-ui', 'bootstrap'],
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


});
