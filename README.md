# geotrigger.js

An API client for the [ArcGIS Geotrigger Service](https://developers.arcgis.com/en/geotrigger-service/).

1. [Features](#features)
1. [Examples](#examples)
  * [Authenticating as an application](#as-an-application-with-clientid-and-clientsecret)
  * [Authenticating as an existing device](#as-an-existing-device)
  * [Authenticating as a new device](#as-a-new-device)
1. [Documentation](#documentation)
  1. [Geotrigger.Session(options)](#geotriggersessionoptions)
    * [Options](#session-options)
    * [Methods](#session-methods)
    * [Properties](#session-properties)
    * [Events](#session-events)
    * [Persisting Authentication](#persisting-authentication)
    * [Expiring Tokens](#expiring-tokens)
1. [Browser Support and Proxies](#browser-support)
1. [Development Instructions](#development-instructions)
1. [Resources](resources)
1. [Issues](#issues)
1. [Contributing](#contributing)
1. [Licensing](#licensing)

## Features

* CORS support
* No dependencies
* Handles authentication, persisting and refreshing sessions
* Works in browsers and in Node.js

## Examples

### As an application with clientId and clientSecret

The method is best for server side applications or any clint side application where you dont mind giving total access to your applicaiton to the user.

```js
var geotriggers = new Geotrigger.Session({
  clientId: "ABC",
  clientSecret: "XZY"
});

geotriggers.request("trigger/list", {
  tags: ["portland"]
}, function(error, response, xhr){
  console.log(error, response, xhr);
});
```

**BE EXTEMELY CAREFUL EXPOSING YOUR CLIENT SECRET!** If a user gains access to your client secret they have access to your **ENTIRE** Geotrigger based application and can do whatever they want. As a result this is generally best for server side applications that can hide the `clientSecret` from potentially malicous users.

### As an existing device

If you have a `refreshToken` for a device you can pass that to create a new session. `token`, `expiresOn`, and `deviceId` are all optional but will give Geotrigger JS more information to work with so they should be passed if availble.

```js
var geotriggers = new Geotrigger.Session({
  clientId: "ABC",
  refreshToken: "A VALID REFRESH TOKEN FOR THE DEVICE",
  token: "A TOKEN FOR THE DEVICE",
  expiresOn: "THE TOKEN EXPIRATION DATE",
  deviceId: "THE DEVICE ID"
});

geotriggers.request("device/info", function(error, response, xhr){
  console.log(error, response, xhr);
});
```

This kind of workflow would be idea for applications where users can edit their own triggers on the web. A sever would store the `refeshToken` and pass it to the page where a session could be initiated.

### As a new device

Geotrigger JS can also automatically register a new device for you. This approch is similar to the mobile SDKs for iOS and Android which will register an anonymous device that can access the API

```js
var geotriggers = new Geotrigger.Session({
  clientId: "ABC"
});

geotriggers.request("device/info", function(error, response, xhr){
  console.log(error, response, xhr);
});
```

## Documentation

### Geotrigger.Session(options)

the core object of Geotrigger JS is the `Session` object. You can itialize a session in a variety of way depending on the kind of application you are trying to create.

* [As An Application](#as-an-application-with-clientid-and-clientsecret)
* [As An Existing Device](#as-an-existing-device)
* [As A New Device](#as-a-new-device)

#### Session Options

Option | Type | Default | Description
--- | --- | --- | ---
`clientId` **Required** | `String` | `undefined` | The `clientId` for your application. To get a client is you need to [register an applicaiton](https://developers.arcgis.com/en/applications/#new) on the ArcGIS Developers website.
`clientSecret` | `String` |`undefined` | The `clientSecret` for this application. If you set this this session be authenticated as your application with full permissions.
`persistSession` | `Boolean` | `true` | If `true` Geotrigger JS will persist this session to a cookie or localStorage depending on browser capabilities.
`preferLocalStorage` | `Boolean` | `true` | If `true` the browser will prefer to use localStorage over cookies if available.
`automaticRegistation` | `Boolean` | `true` | If `true` and there is no `refreshToken` or `clientSecret` passed a new device will be registered and used for this session.
`refreshToken` | `String` | `undefined` | This should be the refresh token for the device. It will be used to get a new token if the passed `token` is expired or not passed.
`token` | `String` | `undefined` | When authenticating as an existing device this can be set as a valid token for the device. If this is invalid the `refreshToken` will be used to get a new token.
`expiresOn` | `Date` | `undefined` | The expiration date for `token`. Used to help determine if the `token` is valid.
`proxy` | `String` | `undefined` | If you are using a proxy for IE 8 and 9 support this should be the path to your proxy. See [browser support] for more information.

#### Session Methods

##### Session.request(method, params, callback)

This is the primary method for interacting with the Geotrigger Service. It accepts a `method` the corresponds with the method you would like to call on teh Geotrigger API. an optional object of `parameters` and finally a `callback` function.

Before you can use request you will need a valid [`Geotrigger.Session`](#geotriggersessionoptions) object.

```js
var geotriggers = new Geotrigger.Session({
  clientId: "ABC",
  clientSecret: "XZY"
});
```

Now that you have a session you can use the `request` method.

```js
// list all triggers tagged "portland"
geotriggers.request("trigger/list", {
  tags: ["portland"]
}, function(error, response, xhr){
  console.log(error, response, xhr);
});
```

```js
// if you dont need to pass parameters you can omit the "parameters" object
geotriggers.request("trigger/list", function(error, response, xhr){
  console.log(error, response, xhr);
});
```

```js
// create a trigger
geotriggers.request("trigger/create", {
  condition: {
    direction: "enter",
    geo: {
      latitude: 45.5165,
      longitude: -122.6764,
      distance: 240
    }
  },
  action: {
    notification: {
      text: "Welcome to Portland"
    }
  }
},function(error, response, xhr){
  console.log(error, response, xhr);
});
```

##### Session.authenticated()

This function will check if a user is authenticated and has a token. It should be noted that this may return false in some cases like the following as Geotrigger JS is still getting a token.

```js
var geotriggers = new Geotrigger.Session({
  clientId: "ABC",
  clientSecret: "XZY"
});

// technically geotriggers is still getting a valid token so it's not authenticated

geotriggers.authenticated() // false
```

If you want to run a  function as soon as a Session is authenticated you can use [`Session.queue`](sessionqueuefunction) method or listen to the `authentication:success` event.

##### Session.queue(function)

This will run the passed function right away if the session is authenticated or run it immediatly after authentication occurs.

```js
// create a new session by automatically registering a new device
var geotriggers = new Geotrigger.Session({
  clientId: "ABC"
});

// add an item to be called as soon as we have a new device
geotriggers.queue(function(){
  console.log(geotriggers.deviceId);
});
```

##### Session.refresh()

Manually refresh the session and persist it to a cookie or localStorage if applicable. This is used internally and generally you will not have to call this method.

##### Session.persist()

Persist it to a cookie or localStorage. This is used internally and generally you will not have to call this method.

##### Session.destroy()

This will destory the cookie or localStorage item essentially logging the user out and destorying the token.

##### Session.on(event, callback)

Used to listen to events on the session.

```js
// create a new session by automatically registering a new device
var geotriggers = new Geotrigger.Session({
  clientId: "ABC"
});

// this will be called every time geotriggers gets new credentials
geotriggers.on("authentication:success", function(){
  console.log(geotriggers.deviceId);
});
```

##### Session.off(event, callback)

Remove bound events on the session.

```js
// this would remove the event we added above
geotriggers.on("authentication:success", function(){
  console.log(geotriggers.deviceId);
});
```

#### Session Properties

Property | Description
--- | ---
`authenticatedAs` | Returns the type of authentication, either `application` if a `clientSecret` was passed or `device` if the sesson is for a device.
`deviceId` | If the session is authenticated as a device this will be that devices ID.
`key` | The unique key for persisting the session. Will generally looks like `_geotriggers_{{device|application}}_{{clientId}}`.
`refreshToken` | If the session is authenticated as a device this be the current refresh token.
`token` | The token for this session.

#### Session Events

Event Name | Description
--- | ---
`authentication:success` | Fired when Geotrigger JS has successfully authenticated as a device or application.
`authentication:error` | Fired when something went wrong with authenticaing or reauthenticing.

#### Persisting Authentication

Geotrigger JS will attempt to keep a session persisted for you. When you create a new `Session` it will check to see is a session already exists for the passed `clientId` ina  cookie or in localStorage if a session exists Geotrigger JS will use that session.

To disable this behavior set `persistSession` to false.

By default Geotrigger JS will try to store the session in localStorage. If you would prefer to use cookies to store your session set `preferLocalStorage` to false.

#### Expiring Tokens

Geotrigger JS will handle when your token expires and automatically get a new token for you and rerun your request. You can listen to the `authentication:success` and `authentication:error` events to know when Geotrigger JS is requesting new authentication.

## Browser Support
Geotrigger.js supports any browser that supports [CORS](http://caniuse.com/cors). IE 8 and 9 are  supported but requires the use a proxy to work around limitations with [XDomainRequest](http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx).

A Node.js proxy is supplied in the `proxy` folder. To create your own proxy to support IE 8 and 9 you can use that that proxy as a sample. Your proxy will need to foreward requests POST requests like `/proxy/http://geotrigger.arcgis.com/trigger/list` to `http://geotrigger.arcgis.com/trigger/list` with all headers intact.

## Development Instructions

1. [Fork and clone Geotrigger JS](https://help.github.com/articles/fork-a-repo)
1. `cd` into the `geotrigger-js` folder
1. Instal the dependancies with `npm install`
1. Run the tests with `npm test` or `grunt test`
1. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Resources

* [ArcGIS for Developers](https://developers.arcgis.com)
* [ArcGIS Geotrigger Service](https://developers.arcgis.com/en/geotrigger-service/)
* [@esripdx](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).


## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet/master/license.txt) file.

[](Esri Tags: Geotrigger)
[](Esri Language: JavaScript)
