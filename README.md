instagram-oauth-demo
=============

A very simple / dumb demo showing at a low level what happens when you authenticate with Instagram using OAuth.

All the intelligence happens on server.js.

For this to work, you must have a registered Instagram account, and the following environment variables:

    export INSTAGRAM_CLIENT_KEY=XXXXX
    export INSTAGRAM_CLIENT_SECRET=XXXX

To run:

    node web.js


## OAuth authentication flow

A simplified overview of what happens here: http://instagram.com/developer/authentication/

*Step 1: Click to Login*

The base URL should take you to a screen with a single "Authenticate" button.

When you click this, you should be redirected to Instagram's Auth site to confirm access

```javascript
    app.get('/authenticate', function(req, res) {
      var url = "https://api.instagram.com/oauth/authorize/?client_id=" + 
                    CLIENT_ID +
                    "&redirect_uri=" + 
                    REDIRECT_URL + 
                    "&response_type=code";

      res.redirect(url);
    });
```

*Step 2: Confirm Access*

This is an Instagram page. You can confirm access or deny. If you confirm, you go on to next step.

*Step 3: Receive Code / Get Access Token*

If approved, you are redirected to the URL you have registered with Instagram, with a "code" parameter added to the redirect. You can post this along with your ID and secret to get 

```javascript
    app.get('/oauthredirect', function(req, res) {
        
      var code = req.query.code;
      
      console.log("Code: " + code);
      
      var options = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        grant_type: "authorization_code",
        code: code
      };
      
      var url = 'https://api.instagram.com/oauth/access_token';
      
      request.post(url, {form: options}, function (e, r, body) {
        serverio.sockets.emit('response', body);
      });
      
      res.render('code', { title: 'Oauth Response' });
    });
```

In this code, once the access token is received, the websocket sends the information to the client. (Doing it like this is not a typical use-case, but it displays what is going on.)

*Step 4: Display results*

In this demo, when we get the message from the server, we render it to the page:

```javascript
    socket.on('response', function (json_text) {
      var json = $.parseJSON(json_text);
      $('#access_token').html("<h2>Access token</h2><p>" + json['access_token'] + "</p>");
      $('#username').html("<h2>Username</h2><p>" + json['user']['username'] + "</p>");
      $('#full_name').html("<h2>Full Name</h2><p>" + json['user']['full_name'] + "</p>");
      $('#user_id').html("<h2>User ID</h2><p>" + json['user']['id'] + "</p>");
      $('#pic').html("<h2>Profile Picture</h2><p><img src='" + json['user']['profile_picture'] + "'></p>");
    });
```


