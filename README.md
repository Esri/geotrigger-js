# geotriggers.js

A lightweight, dependency-free library for interacting with the Geotriggers platform.

## Features

* CORS support
* No dependancies
* Clean, simple API
* Handles authentication, persisting and refreshing sessions
* AMD and Node support

# Config Options

```js
geotriggers = new Geotriggers.Session({
  session: {}, // required or applicationId - the result of a previous geotriggers.toJSON() to restore a session.
  applicationId: "XXX", // required or session - this is the application id from developers.arcigs.com
  applicationSecret: "XXX", // optional - this will authenticate as your application with full permissions
  persistSession: true, // optional - will attempt to persist the session and reload it on future page loads
  preferLocalStorage: true, // if localstorage is available persist the session to local storage
  geotriggersUrl: "https://geotriggersdev.arcgis.com", // optional - the url to geotriggers
  tokenUrl: "https://devext.arcgis.com/sharing/oauth2/token", // optional - the url to the token endpoint
  registerUrl: "https://devext.arcgis.com/sharing/oauth2/registerDevice", // optional - url to register device endpoint
  automaticRegistation: true // optional - when true this will automatically register a device with ArcGIS Online to get a token
});
```

# Request Options

```js
geotriggers.get("trigger/list", {
  params: {}, // the parameters object will be sent along with your request
  callback: function(error, response){}, // a node style callback to be executed on completion
  returnXHR: false // if true will return the instance of XMLHttpRequest in the callback or deferred insteed of the parsed JSON response
});
```

```js
geotriggers.post("trigger/create", {
  params: {}, // the parameters object will be sent along with your request
  callback: function(error, response){}, // a node style callback to be executed on completion
  returnXHR: false // if true will return the instance of XMLHttpRequest in the callback or deferred insteed of the parsed JSON response
});
```


```js
geotriggers.request({
  type: "GET", // the type of HTTP request to make
  method: "trigger/list", // the geotriggers method to request
  params: {}, // the parameters object will be sent along with your request
  callback: function(error, response){}, // a node style callback to be executed on completion
  returnXHR: true // if true will return the instance of XMLHttpRequest in the callback or deferred insteed of the parsed JSON response
});
```

# Deferreds

geotriggers-js ships with its own deferred object built in. An instance of `Geotriggers.Deferred` will be returned by any method that makes an asynchronous request.

Standard `then(successFunction, errorFunction)` is supported as well as jQuery style `success(function)` and `error(function)`;

```js
geotriggers.get("trigger/list", options).then(successFunction, errorFunction);
```

```js
geotriggers.get("trigger/list", options).success(function(response){
  //deal with the response
}).error(function(error){
  //deal with the error
});
```

# Examples

## Using from a browser

This use case is ideal for single page javascript applications.

```js
//this will create a session persisted to localstorage or cookies that be reloaded automatically every page load.
//a new device will be registed with ArcGIS Online to get an access token
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
});

// do stuff with `geotriggers`
geotrigger.get("device/list").success(function(deviceInfo){
  console.log(deviceInfo);
});
```

## Using with a server

If you want to store session details in a database or accosiate them with your own user data you can handle session
persitance yourself.

```js
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
  session: // the saved session from your server or an empty object
});

// when you are ready to persist the session convert it to JSON
// Store this JSON object somewhere and pass it as the `session`
// parameter with your initalize your `Geotriggers.Session`
geotriggers.toJSON()

// when you need to reinitialize a session make a new session and
// pass the stored JSON in.
geotriggers = new Geotriggers.Session({
  session: storedJson
});
```

## Using with a refresh token and access token

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

If you don't have an `access_token` the Geotriggers SDK will automatically register an anonymous device with ArcGIS Online.

This will get you an `access_token` and `refresh_token` for the new device. If `persistSession` is true this session will
be persisted and reloaded on every page load so another device will not be created.

## Node Tests

If you want to run the node tests just `npm test`

## Browser Tests

Testing is done via [Grunt](http://gruntjs.com/) and [Phantom JS](http://phantomjs.org/). To install these just run...

If you want to run the tests in a browser with `grunt` or `grunt jasmine` you will need to install Phantom JS and grunt.

* `npm install grunt-cli -g`
* `brew install phantomjs`

Once these are installed you can now run the tests with `grunt jasmine`.

## Building

Make sure you have all the testing dependancies installed then run `grunt` from the command line. If the files lints and passes all the tests it will be concatenated and minified to the `dist` folder.

## Todos

* HTML5 geolocation helpers for `location/update`
* Batching and deferred lists

### Using with Node

By default the `persistSession` flag is set to false in node to prevent the library from attempting to persist the session to a cookie or localStorage. You should use the `geotriggers.toJSON()` method to create a JSON object to persist and restore a saved session by passing your stored session later.

```js
var Geotriggers = require("geotriggers");

var geotriggers = new Geotriggers.Session({
  applicationId: "XXX"
});

// store this somewhere
var sessionInfo = geotriggers.toJSON();

// restore the session later
var geotriggers = new Geotriggers.Session({
  session: sessionInfo,
  applicationId: "XXX"
});
```

### Using with AMD

You can also use geotriggers js as an AMD module. This is useful for frameworks and libraries that use AMD like require.js and dojo.

```js
require([
  "geotriggers.js"
], function(Geotriggers){
  var geotriggers = new Geotriggers.Session({
    applicationId: "XXX"
  });
})
```
