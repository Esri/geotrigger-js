```js

// Will look for a cookie or localstorage entry to restore a session from
// if this cannot find a previous session this will make a new session by
// calling registerDevice and persist it.
geotriggers = new Geotriggers.Session({
  session: sessionJSON, //required or applicationID
  applicationId: "XXX", // required or session
  applicationSecret: "XXX", // optional - auth as your application
  preferLocalStorage: true, // optional
  persistSession: true, // optional - persist this session to cookie or localStorage. If you make a new session with the same applicaiton ID later we will restore automatically
  geotriggersUrl: "https://geotriggersdev.arcgis.com", // optional
  tokenUrl: "https://devext.arcgis.com/sharing/oauth2/token", // optional
  registerUrl: "https://devext.arcgis.com/sharing/oauth2/registerDevice", // optional
  automaticRegistation: true
});

// will make a GET request to the API. If there is no token yet it will wait for
// registerDevice to finish up. If the response is expired_token will use the refresh
// token to get a new token.
geotriggers.get("trigger/list", options).then(success, fail);

// same thing for a POST request
geotriggers.post("trigger/create", options).then(success, fail);

// returns of bool if token exists
geotriggers.authenticated();

// returns current auth details
geotriggers.authentication();

// destroy the current session
geotriggers.destroy();
```

# Using from a browser

This use case is ideal for single page javascript applications.

```js
//this will create a session persisted to localstorage or cookies that be reloaded automatically every page load.
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
});

// do stuff with `geotriggers`
```

# Using with a server

If you want to store session details in a database or accosiate them with your own user data you can handle session
persitance yourself.

```js
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
  session: // the saved session from your server or an empty object
  persistSession: false // dont persist the session, since you want to handle it yourself
});

// when you are ready to persist the session convert it to JSON
// Store this JSON object somewhere and pass it as the `session`
// parameter with your initalize your `Geotriggers.Session`
geotriggers.toJSON()
```

# Using with a refresh token and access token

If you have an access token and a refresh token from another source, like your applicaitons server you can initalize the Geotriggers library with it.

```js
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
  accessToken: "XXX",
  refreshToken: "XXX",
  persistSession: false // dont persist the session, since you want to handle it yourself
});
```

# Anonymous usage

If you don't have an access_token the Geotriggers SDK will automatically register an anonymous device with ArcGIS Online.

This will get you an `access_token` and `refresh_token` for the new device. If `persistSession` is true this session will
be persisted and reloaded on everypage load so anoter device will not be created.
