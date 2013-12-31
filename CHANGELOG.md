# Geotrigger.js Changelog

# 0.1.5
* Fixed a bug where a session created with `clientId` and a `refreshToken` would not properly reauthenticate with AGO if a session expired.
* add test config
* add `authentication:restored` event

## 0.1.4
* Fix bug where http errors without JSON responses would not be handled

## 0.1.3
* Fix bug where http errors would not be handled

## 0.1.2
* First public release

## 0.1.1
* Small bugfixes

## 0.1.0
* Bump verion to prep for beta release of the Geotrigger Service

## 0.0.4
* Fix incorrect reference to deviceId
* Add proxy support
* Add `queue` method
* Fix broken CORS check in IE 10

## 0.0.3
* Minor bugfixes.
* Remove deferreds. All `request` now only accepts callbacks.
* Remove context param from `request` to allow for other promise libaries ot promisify `request`

## 0.0.2
* Removes `session.get(method, options)` and `session.post(method, options)` methods. Use `session.request(method, options)` instead.
* All requests now use POST to talk to the API.
* `token` is set in request bodies (was sending authorization header previously)
* Stop trying to refresh token after 3 failed attempts.
* Less confusing invocation of callback if provided.
* Should work in IE8 and IE9 but will not refresh tokens or register devices with ArcGIS
* You can no longer set `accessToken` when creating a session. Use `token` instead.
* Passing `session` when creating a session no longer works. Instead anything you set on the options object passed into `new Geotrigger.Session(options)` will be merged into the session. This means that going `session.toJSON()` will give you the proper options object to restore a session.

## 0.0.1
Initial Release
