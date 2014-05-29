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


require(['jquery', 'jquery-ui'],
  function($) {

    var loc = window.location;
    var url = location.protocol + '//' + location.hostname + ':' + location.port;

    $.ajax({url: url + "/clientid"}).done(function(data) {

        var url = "https://api.instagram.com/oauth/authorize/?client_id=" + 
                data['client_id'] +
                "&redirect_uri=" + 
                data['redirect_uri'] +
                "&response_type=token";

        window.location = url;

    });

});


