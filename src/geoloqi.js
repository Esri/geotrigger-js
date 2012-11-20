(function (root, factory) {

  if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  }

  // Browser globals (root is window)
  if(window && navigator) {
    root.geoloqi = factory();
  }

}(this, function() {
  /* Configuration Variables */
  var version        = "2.0.0-alpha1";
  var apiPath        = "http://cors-server.herokuapp.com/";
  var exports        = {};
  var auth           = {};
  var eventListeners = {};
  var config         = {};

  /** Initialize the geoloqi.js library */
  var init = function(options){
    if(!options.app_id) {
      throw "geoloqi: You must pass an app_id to geoloqi.init()";
    }
    
    if(options.app_secret && options.device_secret) {
      throw "geoloqi: You cannot pass `app_secret` AND `device_secret` to geoloqi.init()";
    }

    // setup the auth object that gets merged into every request
    auth.app_id = options.app_id;
    if(options.app_secret){
      auth.app_secret = options.app_secret;
    }
    if(options.device_secret){
      auth.device_secret = options.device_secret;
    }

    // if for some reason we have both jquery and dojo defined use whichever is passed or jQuery
    if(window.jQuery && window.dojo){
      config.integration = options.integration || window.jQuery;
    } else {
      config.integration = window.jQuery || window.dojo;
    }

    events.fire("init");
  };
  exports.init = init;
  exports.config = config;

  /** Destroys the current authentication */
  var destory = function(){
    auth = exports.auth = {};
  };
  exports.destory = destory;

  /** Boolean check for authentication */
  var authenticated = function(){
    return auth.app_id && (auth.app_secret || auth.device_secret);
  };
  exports.authenticated = authenticated;

  /* Internal handler for all requests */
  var makeRequest = function(http_method, method, data, callback, context, xhrCallback) {
    var args = [].splice.call(arguments,0);

    //makeRequest(object);
    if(typeof args[1] === "object"){
      method = args[1].method;
      data = args[1].data;
      callback = args[1].callback;
      context = args[1].context;
    }

    if(typeof args[2] === "function"){
      callback = args[2];
      context = args[3];
    }

    if(typeof args[2] === "undefined" && typeof args[3] === "undefined" && typeof args[1] !== "object"){
      data = {};
    }

    if(!http_method){
      throw "geoloqi: requires a http_method parameter";
    }

    if(!method){
      throw "geoloqi: requires a method parameter";
    }

    events.fire("request:started", http_method, method, data);
    var httpRequest;
    var callbackContext  = (context) ? context : window;
    var deferred = (config.integration) ? new config.integration.Deferred() : null;

    var handleSuccessfulResponse = function(){
      var json = JSON.parse(httpRequest.responseText);
      var response = (json.error) ? null : json;
      var error = (json.error) ? json.error : null;
      
      // do we need to return an xhr object to the request?
      if(xhrCallback){
        // do we call a callback?
        if(callback){
          callback.call(callbackContext, httpRequest);
        }

        // do we call a deferred?
        if (deferred && !error) {
          deferred.resolve(httpRequest);
        } else if (deferred && error) {
          deferred.reject(httpRequest);
        }

      } else {
        // do we call a callback
        if(callback){
          callback.call(callbackContext, response, error);
        }
        // do we call a deferred
        if (deferred && !error) {
          deferred.resolve(response);
        } else if (deferred && error) {
          deferred.reject(error);
        }
      }
      
      if(!error){
        events.fire("request:success", response);
      } else {
        events.fire("request:error", error);
      }
      events.fire("request:completed", response, error);
    };

    var handleErrorResponse = function(){
      var error = {
        type: "http_error",
        message: "your request could not be completed"
      };
      if(callback){
        callback.call(callbackContext, null, error);
      }
      if(deferred) {
        deferred.reject(error);
      }
      events.fire("request:error", error);
      events.fire("request:completed", error);
    };

    var handleStateChange = function(){
      if(httpRequest instanceof XMLHttpRequest && httpRequest.readyState === 4 && httpRequest.status < 400){
        handleSuccessfulResponse();
      } else if(httpRequest instanceof XMLHttpRequest && httpRequest.readyState === 4 && httpRequest.status >= 400) {
        handleErrorResponse();
      } else if(httpRequest instanceof XMLHttpRequest) {
        // die and do nothing to avoid an error when we check for XDomainRequest in browsers that dont have it
      } else if (httpRequest instanceof XDomainRequest) {
        handleSuccessfulResponse();
      }
    };

    if (window.XDomainRequest) {
      httpRequest = new XDomainRequest();
      httpRequest.onload = handleStateChange;
      httpRequest.onerror = handleErrorResponse;
      httpRequest.ontimeout = handleErrorResponse;
    } else if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = handleStateChange;
    }

    // Merge data into the authentication object
    var dataWithAuth = (data) ? util.merge(auth, data) : auth;

    // Convert data to query string
    var queryString = util.toQueryString(dataWithAuth);
    
    switch (http_method) {
      case "GET":
        httpRequest.open("GET", apiPath + method + "?" + queryString);
        httpRequest.send(null);
        break;
      case "POST":
        httpRequest.open("POST", apiPath + method);
        if(httpRequest instanceof XMLHttpRequest){
          httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        httpRequest.send(queryString);
        break;
    }

    return deferred;
  };

  /* generic request method */
  var request = function(http_method, method, data, callback, context){
    return makeRequest(http_method, method, data, callback, context, true);
  };
  exports.request = request;

  /* GET method */
  var get = function(method, data, callback, context){
    return makeRequest("GET", method, data, callback, context, false);
  };
  exports.get = get;

  /* POST method */
  var post = function(method, data, callback, context){
    return makeRequest("POST", method, data, callback, context, false);
  };
  exports.post = post;

  /* Event Utils */
  var events = {
    addListener: function(type, listener){
      if (typeof eventListeners[type] === "undefined"){
        eventListeners[type] = [];
      }

      eventListeners[type].push(listener);
    },
    fire: function(type){
      var args = [].splice.call(arguments,1);
      if (eventListeners[type] instanceof Array){
        var listeners = eventListeners[type];
        for (var i=0, len=listeners.length; i < len; i++){
          listeners[i].apply(exports, args);
        }
      }
    },
    removeListener: function(type, listener){
      if (eventListeners[type] instanceof Array){
        var listeners = eventListeners[type];
        for (var i=0, len=listeners.length; i < len; i++){
          if (listeners[i] === listener){
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  };
  //exports._events = eventListeners;
  exports.fire = events.fire;
  exports.on = events.addListener;
  exports.addListener = events.addListener;
  exports.off = events.addListener;
  exports.removeListener = events.removeListener;


  /* Internal Utils */
  var util = {
    /* Merge Object 1 and Object 2. Properties from Object 2 will override properties in Ojbect 1 */
    merge: function(obj1, obj2){
      var obj3 = {};
      for (var obj1attr in obj1) {
        if(obj1.hasOwnProperty(obj1attr)){
          obj3[obj1attr] = obj1[obj1attr];
        }
      }
      for (var obj2attr in obj2) {
        if(obj2.hasOwnProperty(obj2attr)){
          obj3[obj2attr] = obj2[obj2attr];
        }
      }
      return obj3;
    },
    s4: function(){
      return Math.floor(Math.random() * 0x10000).toString(16);
    },
    guid: function(){
      return (util.S4() + util.S4() + "-" + util.S4() + "-" + util.S4() + "-" + util.S4() + "-" + util.S4() + util.S4() + util.S4());
    },
    log: function(){
      if(window.console && window.console.log){
        var args = [].splice.call(arguments,0);
        console.log("geoloqi:", args);
      }
    },
    toQueryString: function(obj, parentObject) {
      if( typeof obj !== 'object' ){
        return '';
      }
      var rv = '';
      for(var prop in obj) {
        if (obj.hasOwnProperty(prop)) {

          var qname = (parentObject) ? parentObject + '.' + prop : prop;

          // Expand Arrays
          if (obj[prop] instanceof Array) {
            for( var i = 0; i < obj[prop].length; i++ ){
              if( typeof obj[prop][i] === 'object' ){
                rv += '&' + util.toQueryString( obj[prop][i], qname );
              } else{
                rv += '&' + encodeURIComponent(qname) + '=' + encodeURIComponent( obj[prop][i] );
              }
            }
          // Expand Dates
          } else if (obj[prop] instanceof Date) {
            rv += '&' + encodeURIComponent(qname) + '=' + obj[prop].getTime();

          // Expand Objects
          } else if (obj[prop] instanceof Object) {
            // If they're String() or Number() etc
            if (obj.toString && obj.toString !== Object.prototype.toString){
              rv += '&' + encodeURIComponent(qname) + '=' + encodeURIComponent( obj[prop].toString() );
            // Otherwise, we want the raw properties
            } else{
              rv += '&' + util.toQueryString(obj[prop], qname);
            }
          // Output non-object
          } else {
            rv += '&' + encodeURIComponent(qname) + '=' + encodeURIComponent( obj[prop] );
          }
        }
      }
      return rv.replace(/^&/,'');
    }
  };

  return exports;
}));