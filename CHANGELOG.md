# 0.0.2
* Removes `session.get(method, options)` and `session.post(method, options)` methods. Use `session.request(method, options)` instead.
* All requests now use POST to talk to the API.
* `token` is set in request bodies (was sending authorization header previously)
* Stop trying to refresh token after 3 failed attempts.
* Less confusing invocation of callback if provided.
* Should work in IE8 and IE9 but will not refresh tokens or register devices with ArcGIS
* You can no longer set `accessToken` when creating a session. Use `token` instead.
* Passing `session` when creating a session no longer works. Instead anything you set on the options object passed into `new Geotriggers.Session(options)` will be merged into the session. This means that going `session.toJSON()` will give you the proper options object to restore a session.

# 0.0.1
Initial Release
