# The new geoloqi.js library.

* CORS Support
* No Dependancies
* Clean Simple API
* Handles Authentication and Persisting Sessions
* IE 8 and 9 support

# Tests

Testing is done via [Grunt](http://gruntjs.com/) and [Phantom JS](http://phantomjs.org/). To install these just run...

If you want to run the tests in a browser with grunt you will need to install Phantom JS.

`brew install phantomjs`

Once these are installed you can now run the tests with `grunt jasmine`.

If you do not want to run tests from the command line just open up `spec/SpecRunner.html` in your browser.

#### Notes on tests

* You will also need to change the location of the mock server if you want to use a different server from the Heroku hosted one.
* Right now both jQuery and Dojo are being loaded. You should also test without then loaded. Just comment out lines 14-15 in /spec/javascripts/support/jasmine.yml, restart the test server and rerun the tests.
* You might get timeout errors if the Heroku server is idled just rerun the tests.

#### Start Mock Server (Optional)

Currently there is a small mock Sinatra server that will serve requests and help test CORS support. It is hosted on Heroku so you this step is optional.

`$ ruby spec/test_server.rb`

#### Edit Hostfile

Add this to your host file for the test server. YOu need to do this because localhost is barred from making cross domain requests so you need to put the tests at a real url.

`127.0.0.1 test.local`

# Building

Make sure you have all the testing dependancies installed then run `grunt` from the command line. If the files lints and passes all the tests it will be concatinated and minified to the `dist` folder.

# Todos
* Session persistance
* HTML5 Geolocation Helpers
* Batching and deferred lists
* Socket helpers (socket.io and native websockets)

# geoloqi.get() and geoloqi.post()

`geoloqi.get(method, data, callback, context);`
`geoloqi.get(method, callback);`
`geoloqi.get(method, callback, context);`

`data` and `callback` are optional, if you define a `callback` you can optionally declare a `context` for your callback to be run under.

If you want to use a syntax similar to jQuery or other libraries you can also pass an object.

```
geoloqi.post({
  method: "trigger/create",
  data: {
    condition: {
      direction: "entering",
      geo: GeoJSON
    },
    action: {
      message: "You have arrived"
    },
    tags: ["geoloqiHQ"]
  },
  callback: callbackFunction
});
```

# geoloqi.request();
`geoloqi.request()` is the same as `geoloqi.get()` and `geoloqi.post()` but there is a new first parameter that specifies the type of request. This method also returns the `XMLHttpRequest` or `XDomainRequest` object in the callback insteed of `response` and `error`.

```
geoloqi.request("POST", "location/update", {
  latitude:  45,
  longitude: 45
}, function(xhr){
  console.log(xhr);
});
```

```
geoloqi.request("POST", {
  method: "location/update",
  data: {
    latitude: 12,
    longitude: 12
  },
  callback: function(xhr){
    console.log(xhr);
  }
});
```