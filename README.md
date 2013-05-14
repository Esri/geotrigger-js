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
  applicationId: "XXX", // required or session - this is the application id from developers.arcigs.com
  applicationSecret: "XXX", // optional - this will authenticate as your application with full permissions
  persistSession: true, // optional - will attempt to persist the session and reload it on future page loads
  preferLocalStorage: true, // if localstorage is available persist the session to local storage
  geotriggersUrl: "https://geotriggersdev.arcgis.com", // optional - the url to geotriggers
  tokenUrl: "https://devext.arcgis.com/sharing/oauth2/token", // optional - the url to the token endpoint
  registerUrl: "https://devext.arcgis.com/sharing/oauth2/registerDevice", // optional - url to register device endpoint
  automaticRegistation: true // optional - when true this will automatically register a device with ArcGIS Online to get a token
  token: "XXX" // if you have a token from a previous session (session.toJSON()) you can pass it in here
  refreshToken: "XXX" // if you have a refresh token from a previous session (session.toJSON()) you can pass it in here
  expiresOn: "XXX"  // if your token has an expiration date you should pass it in
});

# Request Options

```js
geotriggers.request("trigger/list", {
  params: {}, // the parameters object will be sent along with your request
  callback: function(error, response, XHR){}, // a node style callback to be executed on completion
});
```

```js
geotriggers.request("trigger/create", {
  params: {}, // the parameters object will be sent along with your request
  callback: function(error, response, XHR){}, // a node style callback to be executed on completion
});
```


```js
geotriggers.request("location/last", {
  params: {}, // the parameters object will be sent along with your request
  callback: function(error, response, XHR){}, // a node style callback to be executed on completion
});
```

# Deferreds

geotriggers-js ships with its own deferred object built in. An instance of `Geotriggers.Deferred` will be returned by any method that makes an asynchronous request.

Standard `then(successFunction, errorFunction)` is supported as well as jQuery style `success(function)` and `error(function)`;

```js
successFunction = function(data, XHR){};
errorFunction = function(error, XHR){};

geotriggers.request("trigger/list", options).then(successFunction, errorFunction);
```

```js
geotriggers.request("trigger/list", options).success(function(data, XHR){
  //deal with the data
}).error(function(error, XHR){
  //deal with the error
});
```

# Examples

## Using from a browser

This use case is ideal for single page javascript applications.

```js
// this will create a session persisted to localstorage or cookies that be reloaded automatically every page load.
// a new device will be registed with ArcGIS Online to get an access token
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
});

// do stuff with `geotriggers`
geotriggers.request("device/list").success(function(deviceInfo){
  console.log(deviceInfo);
});
```

## Using with a server

If you want to store session details in a database or accosiate them with your own user data you can handle session
persitance yourself.

```js
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
});

// when you are ready to persist the session convert it to JSON
// Store this JSON object and use it to initalize your session later
mySession = JSON.stringify(geotriggers.toJSON())

// when you need to reinitialize a session make
// a new session from the stored JSON in.
geotriggers = new Geotriggers.Session(JSON.parse(mySession));
```

## Using with a refresh token and access token

If you have an access token and a refresh token from another source, like your applicaitons server you can initalize the Geotriggers library with it.

```js
geotriggers = new Geotriggers.Session({
  applicationId: "XXX", // set your application id
  token: "XXX",
  refreshToken: "XXX",
  persistSession: false // dont persist the session, since you want to handle it yourself
});
```

# Anonymous usage

If you don't have an `token` the Geotriggers SDK will automatically register an anonymous device with ArcGIS Online.

This will get you an `token` and `refresh_token` for the new device. If `persistSession` is true this session will
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