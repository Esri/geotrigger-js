# The new geoloqi.js library.

* CORS Support
* No Dependancies
* Clean Simple API
* Handles Authentication and Persisting Sessions
* IE 8 and 9 support

# Tests

This is going to be extensivly testing to make cross browser compatibility easier.

* `$ bundle install`
* `$ rake jasmine` or `$ rake jasmine:ci`

# Test Server

Currently there is a small mock Sinatra server that will serve requests and help test CORS support.

#### 1. Edit Hostfile

Add this to your host file for the test server.

`127.0.0.1 test.local`

#### 2. Start Mock Server

`$ ruby spec/test_server.rb`

#### Notes on tests

Right now both jquery and dojo are being loaded. You should also test without then loaded. Just comment out lines 14-15 in /spec/javascripts/support/jasmine.yml, restart the test server and rerun the tests.

# Todos

* Alternate method signatures (see below)
* Session persistance
* Tests for the context object
* Support context for deferreds
* HTML5 Geolocation Helpers
* Batching
* Socket helpers (socket.io and native websockets)

### Alternate Method Syntax

#### As an object

We should support passing an object to the `get`, `post` and `request` methods. Perhaps a good way to approach this is to make `makeRequest` take an object but transform anything passed to it into an object.

```javascript
geoloqi.get({
  method: "location/history",
  parms: {
    count: 10,
    accuracy: 100,
    thinning: 100
  },
  callback: function(){},
  context: this
});

geoloqi.get(object);
```

#### With optional params

We should make parms optional, this is good for things link `location/last`.

```javascript
geolqoi.get(method, callback)
geolqoi.get(method, callback, context)
```

#### With optional callback (deferreds)

We should make callbacks optional, this would encourage use of deferreds.

```javascript
geolqoi.get(method)
geolqoi.get(method, data)
geolqoi.get(method, parms, context)
```

# Docs

# geoloqi.get() and geoloqi.post()

`geoloqi.get(method, data, callback, context);`
`geoloqi.get(method, callback);`
`geoloqi.get(method, callback, context);`

Params and callback are optional, if you define a callback you can optionally declare a context for your callback to be run under.

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