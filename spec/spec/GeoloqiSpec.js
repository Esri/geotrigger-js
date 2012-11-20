beforeEach(function() {

  // do the types of arguments in each array match?
  function arrySignaturesMatch(array1, array2){
    // setup variables
    var ref, test;

    // we want to use the shorter array if one is longer
    if (array1.length >= array2.length) {
      ref = array2;
      test = array1;
    } else {
      ref = array1;
      test = array2;
    }

    // loop over the shorter array and make sure the coorestponding key in the longer array matches
    for(var key in ref) {
      if(typeof ref[key] === typeof test[key]) {
        
       // if the keys represent an object make sure that it matches.
        if(typeof ref[key] === "object" && typeof test[key] === "object") {
          if(!objectSignaturesMatch(ref[key], test[key])){
            return false;
          }
        }

        // if the keys represent an array make sure it matches
        if(typeof ref[key] === "array" && typeof test[key] === "array") {
          if(!arrySignaturesMatch(ref[key],test[key])){
            return false;
          }
        }

      }
    }
    return true;
  }

  // do the keys in object1 match object 2?
  function objectSignaturesMatch(object1, object2){
    
    // becuase typeof null is object we need to check for it here before Object.keys
    if(object1 === null && object2 === null){
      return true;
    }

    // if the objects have different lengths of keys we should fail immediatly
    if (Object.keys(object1).length !== Object.keys(object2).length) {
      return false;
    }
    
    // loop over all the keys in object1 (we know the objects have the same number of keys at this point)
    for(var key in object1) {

      // if the keys match keep checking if not we have a mismatch
      if(typeof object1[key] === typeof object2[key]) {

        if(typeof object1[key] === null && typeof object2[key] === null) {

        }

        // if the keys represent an object make sure that it matches.
        else if(object1[key] instanceof Array && object2[key] instanceof Array) {
          if(!arrySignaturesMatch(object1[key],object2[key])){
            return false;
          }
        }

        // if the keys represent an array make sure it matches
        else if(typeof object1[key] === "object" && typeof object2[key] === "object") {
          if(!objectSignaturesMatch(object1[key],object2[key])){
            return false;
          }
        }

      }
    }
    return true;
  }

  this.addMatchers({
  
    // this is a lazy matcher for jasmine spies.
    // it checks that the arguments for the last call made match all the
    // arguments that are passed into the function, but does not care if the
    // values match only that they are the same type.
    //
    // in short this only cares that all teh keys are the same and the types
    // of values are the same, not the values themselves
    toHaveBeenCalledWithArgsLike: function() {
      var refArgs = Array.prototype.slice.call(arguments);
      var calledArgs = this.actual.mostRecentCall.args;
      var arg;

      for(arg in refArgs){
        var ref = refArgs[arg];
        var test = calledArgs[arg];
                
        // if the types of the objects dont match
        if(typeof ref !== typeof test) {
          return false;
        // if ref and test are objects make then
        } else if(typeof ref === "object" && typeof test === "object") {
          if(!objectSignaturesMatch(ref, test)){
            return false;
          }
        } else if(typeof ref === "array" && typeof test === "array") {
          if(!arrySignaturesMatch(ref, test)){
            return false;
          }
        }
      }
      return true;
    },

    // this expects an objec to loosly match another objects signature
    objectToLooselyMatch: function(obj){
      return objectSignaturesMatch(this.actual, obj);
    },

    // this expects an array to loosly match another objects signature
    arrayToLooselyMatch: function(arr){
      return arrySignaturesMatch(this.actual, arr);
    },

    // match two arbitrary objects signatures
    objectSignaturesMatch: function(obj1, obj2) {
      objectSignaturesMatch(obj1, obj2);
    },
    // match two arbitrary objects signatures
    arrySignaturesMatch: function(array1, array2) {
      arrySignaturesMatch(array1, array2);
    },

    // expect the object to be of type
    toBeOfType: function(type){
      return typeof this.actual === type;
    },

    // expect the object to be of a certain instance
    toBeInstanceOfClass: function(classRef){
      return this.actual instanceof classRef;
    }
  });
});

if(typeof module === "object" && !geoloqi){
  var geoloqi = require("../../src/geoloqi");
}

describe("custom spec helpers", function(){

  it("should match two objects with the same keys but different values", function(){
    expect({
      foo: "bar",
      baz: 1
    }).objectToLooselyMatch({
      foo: "woot",
      baz: 3
    });
  });

  it("should be false on two objects with different keys", function(){
    expect().not.objectSignaturesMatch({
      foo: "bar",
      baz: 1,
      lol: "cats"
    }, {
      foo: "woot",
      baz: 3
    });
  });

  it("should match two arrays with the same types of objects in the same order", function(){
    expect(["one", "two", 3, {four: 4}]).arrayToLooselyMatch(["foo", "bar", 2, {four: 4}]);
  });

  it("should match two objects with the same nested structure", function(){
    expect({
      foo: "bar",
      baz: 1,
      nest: {
        bird: "sparrow"
      }
    }).objectToLooselyMatch({
      foo: "woot",
      baz: 3,
      nest: {
        bird: "seagull"
      }
    });
  });

  it("should match two objects that contain arrays", function(){
    expect({
      tags: ["foo", "bar"]
    }).objectToLooselyMatch({
      tags: ["foo"]
    });
  });

  it("should match two arrays with the same nested structure", function(){
    expect([[1,1], [0,0], [2,2]]).arrayToLooselyMatch([[2,2], [1,1], [3,3]]);
  });

  it("should match these two crazy objects", function(){
    expect({
      foo: "bar",
      baz: 1,
      nest: {
        bird: "sparrow",
        eggs: [{
          name: "Chirp",
          hatched: false
        }]
      },
      tags: ["foo", "bar", "baz"]
    }).objectToLooselyMatch({
      foo: "woot",
      baz: 3,
      nest: {
        bird: "seagull",
        eggs: [{
          name: "Sammy",
          hatched: true
        }, {
          name: "Bobby",
          hatched: true
        }]
      },
      tags: ["foo"]
    });

  });
});

describe("geoloqi.js", function() {

  it("should throw an error if initialized without an app_id", function(){
    expect(function(){
      geoloqi.configure({
        device_secret: "xxx"
      });
    }).toThrow();
  });

  it("should throw an error if initialized with an app_secret and device_secret", function(){
    expect(function(){
      geoloqi.configure({
        app_id: "xxx",
        app_secret: "xxx",
        device_secret: "xxx"
      });
    }).toThrow();
  });

  it("should fire an `init` event after the initializes successfully", function(){
    var callback = jasmine.createSpy();
    
    geoloqi.on("init", callback);

    geoloqi.configure({
      app_id: "xxx",
      app_secret: "xxx"
    });

    expect(callback).toHaveBeenCalled();
    
    this.after(function(){
      geoloqi.destory();
      geoloqi.off('init', callback);
    });
  });

  it("should return true if there is a app_id and app_secret in auth", function(){
    geoloqi.configure({
      app_id: "xxx",
      app_secret: "xxx"
    });

    expect(geoloqi.authenticated()).toBeTruthy();
    
    this.after(function(){
      geoloqi.destory();
    });
  });

  it("should return true if there is a app_id and device_secret in auth", function(){
    geoloqi.configure({
      app_id: "xxx",
      device_secret: "xxx"
    });

    expect(geoloqi.authenticated()).toBeTruthy();
    
    this.after(function(){
      geoloqi.destory();
    });
  });

  it("should return false if there is not a valid app_id and a device_secret or app_secret", function(){
    expect(geoloqi.authenticated()).toBeFalsy();
  });

  it("should pass custom data in events", function(){
    var callback = jasmine.createSpy();
    geoloqi.on("woot", callback);
    geoloqi.fire("woot", "foo", ["bar"], {baz:"foo"});
    expect(callback).toHaveBeenCalledWith("foo", ["bar"], {baz:"foo"});
  });

  describe("api request methods", function(){

    beforeEach(function(){
      geoloqi.configure({
        app_id: "xxx",
        app_secret: "xxx"
      });
    });

    it("should make a GET request with a callback", function(){
      var callback = jasmine.createSpy();
      
      runs(function(){
        geoloqi.get("location/last", {}, callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback).toHaveBeenCalledWithArgsLike({
          latitude: 45,
          longitude: 45
        }, null);
      });
    });

    it("should make a POST request with a callback", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.post("location/update", {
          latitude:  45,
          longitude: 45
        }, callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "POST request timed out", 2000);

      runs(function(){
        expect(callback).toHaveBeenCalledWithArgsLike({
          app_id: "xxx",
          app_secret: "xxx",
          latitude:  45,
          longitude: 45
        }, null);
      });
    });

    it("should make a GET request and use an xhr object in the callback", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.request("GET", "location/last", {}, callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback.mostRecentCall.args[0] instanceof XMLHttpRequest);
      });
    });

    it("should make a GET request with an object as a parameter", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.get({
          method: "location/last",
          callback: callback
        });
      });

      waitsFor(function(){
        return callback.callCount;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback).toHaveBeenCalledWithArgsLike({
          latitude: 12,
          longitude: 12
        }, null);
      });
    });

    it("should make a POST request with an object as a parameter", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.post({
          method: "location/update",
          data: {
            latitude: 12,
            longitude: 12
          },
          callback: callback
        });
      });

      waitsFor(function(){
        return callback.callCount;
      }, "POST request timed out", 2000);

      runs(function(){
        expect(callback).toHaveBeenCalledWithArgsLike({
          app_id: "xxx",
          app_secret: "xxx",
          latitude:  45,
          longitude: 45
        }, null);
      });
    });

    it("should make a request with an object as a parameter", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.request("POST", {
          method: "location/update",
          data: {
            latitude: 12,
            longitude: 12
          },
          callback: callback
        });
      });

      waitsFor(function(){
        return callback.callCount;
      }, "POST request timed out", 2000);

      runs(function(){
        expect(callback.mostRecentCall.args[0] instanceof XMLHttpRequest);
      });
    });


    it("should make a POST request and use an xhr object in the callback", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.request("POST", "location/update", {
          latitude:  45,
          longitude: 45
        }, callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "POST request timed out", 2000);

      runs(function(){
        expect(callback.mostRecentCall.args[0] instanceof XMLHttpRequest);
      });
    });

    it("should fire started, completed and success events on a successful call", function(){
      var callback = jasmine.createSpy();

      geoloqi.on("request:started", callback);
      geoloqi.on("request:success", callback);
      geoloqi.on("request:completed", callback);

      runs(function(){
        geoloqi.get("location/last", {}, function(){});
      });

      waitsFor(function(){
        return callback.callCount >= 3;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback.callCount).toEqual(3);
      });

      this.after(function(){
        geoloqi.off("request:started", callback);
        geoloqi.off("request:success", callback);
        geoloqi.off("request:completed", callback);
      });
    });

    it("should fire started, completed and error events on a unsuccessful call", function(){
      var callback = jasmine.createSpy();

      geoloqi.on("request:started", callback);
      geoloqi.on("request:error", callback);
      geoloqi.on("request:completed", callback);

      runs(function(){
        geoloqi.get("error", {}, function(){});
      });

      waitsFor(function(){
        return callback.callCount >= 3;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback.callCount).toEqual(3);
      });

      this.after(function(){
        geoloqi.off("request:started", callback);
        geoloqi.off("request:error", callback);
        geoloqi.off("request:completed", callback);
      });
    });

    it("should make a successful request with a context object", function(){
      geoloqi.testing = {};
      geoloqi.testing.fakeCallback = function(){
        geoloqi.testing.withscope = this.test;
      };
      spyOn(geoloqi.testing, "fakeCallback").andCallThrough();

      runs(function(){
        scope = {
          test: "function run in custom scope"
        };
        geoloqi.get("location/last", geoloqi.testing.fakeCallback, scope);
      });

      waitsFor(function(){
        return geoloqi.testing.fakeCallback.callCount;
      }, "GET request timed out", 1000);

      runs(function(){
        expect(geoloqi.testing.fakeCallback).toHaveBeenCalledWithArgsLike({
          latitude: 123,
          longitude: 123
        }, null);
        expect(geoloqi.testing.withscope).toEqual("function run in custom scope");
      });
    });

    it("should make a successful request with no parameters", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        geoloqi.get("location/last", callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback).toHaveBeenCalledWithArgsLike({
          latitude: 45,
          longitude: 45
        }, null);
      });
    });

  });

  describe("library integrations", function(){

    it("should automatically configure an integration when Dojo and/or jQuery is present", function(){
      geoloqi.configure({
        app_id: "xxx",
        app_secret: "xxx"
      });

      if(typeof jQuery === "function" && typeof dojo === "object") {
        expect(geoloqi.config.integration == jQuery);
      } else if (typeof jQuery === "function") {
        expect(geoloqi.config.integration == jQuery);
      } else if (typeof dojo === "object") {
        expect(geoloqi.config.integration == dojo);
      } else {
        expect(geoloqi.config.integration).toBeFalsy();
      }
    });
    
    if(typeof dojo === "object" || typeof jQuery === "function"){
      it("should run a method without a callback or params and use deferreds", function(){
        geoloqi.configure({
          app_id: "xxx",
          app_secret: "xxx"
        });

        var callback = jasmine.createSpy();

        runs(function(){
          geoloqi.get("location/last").then(callback);
        });

        waitsFor(function(){
          return callback.callCount;
        }, "GET request timed out", 2000);


        runs(function(){
          expect(callback).toHaveBeenCalledWithArgsLike({
            latitude: 0,
            longitude: 0
          });
        });
      });

      it("should run a method without a callback and use deferreds", function(){
        geoloqi.configure({
          app_id: "xxx",
          app_secret: "xxx"
        });

        var callback = jasmine.createSpy();

        runs(function(){
          geoloqi.post("location/update", {
            latitude: 123,
            longitude: 123
          }).then(callback);
        });

        waitsFor(function(){
          return callback.callCount;
        }, "GET request timed out", 2000);


        runs(function(){
          expect(callback).toHaveBeenCalledWithArgsLike({
            app_id: "foo",
            app_secret: "bar",
            latitude: 0,
            longitude: 0
          });
        });
      });
    } else {
      describe("skipping deferred tests, dojo or jQuery was not present", function(){
        it("", function(){
          expect(true).toBeTruthy();
        });
      });
    }
    
    if(typeof dojo === "object"){
      describe("Dojo integration", function(){

        beforeEach(function(){
          geoloqi.configure({
            app_id: "xxx",
            app_secret: "xxx",
            integration: dojo
          });
        });

        it("should use a Dojo deferred to run a callback after a successful GET request", function(){
          var callback = jasmine.createSpy();

          runs(function(){
            geoloqi.get("location/last", {}).then(callback);
          });

          waitsFor(function(){
            return callback.callCount;
          }, "GET request timed out", 2000);


          runs(function(){
            expect(callback).toHaveBeenCalledWithArgsLike({
              latitude: 0,
              longitude: 0
            });
          });
        });

        it("should use a Dojo deferred to run a callback after a successful POST request", function(){
          var callback = jasmine.createSpy();

          runs(function(){
            geoloqi.post("location/update", {
              latitude: 1,
              longitude: 1
            }).then(callback, callback);
          });

          waitsFor(function(){
            return callback.callCount;
          }, "POST request timed out", 2000);


          runs(function(){
            expect(callback).toHaveBeenCalledWithArgsLike({
              app_id: "xxx",
              app_secret: "xxx",
              latitude: 45,
              longitude: 45
            });
          });
        });

        it("should use a Dojo deferred to run a callback after a successful request", function(){
          var callback = jasmine.createSpy();

          runs(function(){
            geoloqi.request("GET", "location/last", {}).then(callback);
          });

          waitsFor(function(){
            return callback.callCount;
          }, "request timed out", 2000);


          runs(function(){
            expect(callback.mostRecentCall.args[0] instanceof XMLHttpRequest);
          });
        });

        it("should use a Dojo deferred to run an error callback after a unsuccessful request", function(){
          var errorCallback = jasmine.createSpy();
          var successCallback = jasmine.createSpy();

          runs(function(){
            geoloqi.get("error", {}).then(successCallback, errorCallback);
          });

          waitsFor(function(){
            return errorCallback.callCount || successCallback.callCount;
          }, "GET request timed out", 2000);

          runs(function(){
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalledWithArgsLike({
              type: "something_went_wrong",
              message: "something went wrong we dont know what"
            });
          });
        });

      });
    } else {
      describe("Skipping Dojo integration tests, dojo was not defined", function(){
        it("", function(){
          expect(true).toBeTruthy();
        });
      });
    }

    if(typeof jQuery === "function") {

      describe("jQuery integration", function(){
         
         beforeEach(function(){
          geoloqi.configure({
            app_id: "xxx",
            app_secret: "xxx",
            integration: jQuery
          });
        });

        it("should use a jQuery deferred to run a callback after a successful GET request", function(){
          var callback = jasmine.createSpy();

          runs(function(){
            geoloqi.get("location/last", {}).done(callback);
          });

          waitsFor(function(){
            return callback.callCount;
          }, "GET request timed out", 2000);


          runs(function(){
            expect(callback).toHaveBeenCalledWithArgsLike({
              latitude: 0,
              longitude: 0
            });
          });
        });

        it("should use a jQuery deferred to run a callback after a successful POST request", function(){
          var callback = jasmine.createSpy();

          runs(function(){
            geoloqi.post("location/update", {
              latitude: 1,
              longitude: 1
            }).done(callback);
          });

          waitsFor(function(){
            return callback.callCount;
          }, "POST request timed out", 2000);


          runs(function(){
            expect(callback).toHaveBeenCalledWithArgsLike({
              app_id: "xxx",
              app_secret: "xxx",
              latitude: 45,
              longitude: 45
            });
          });
        });

        it("should use a jQuery deferred to run a callback after a successful request", function(){
          var callback = jasmine.createSpy();

          runs(function(){
            geoloqi.request("GET", "location/last", {}).done(callback);
          });

          waitsFor(function(){
            return callback.callCount;
          }, "request timed out", 2000);


          runs(function(){
            expect(callback.mostRecentCall.args[0] instanceof XMLHttpRequest);
          });
        });

        it("should use a jQuery deferred to run an error callback after a unsuccessful request", function(){
          var errorCallback = jasmine.createSpy();
          var successCallback = jasmine.createSpy();

          runs(function(){
            geoloqi.get("error", {}).done(successCallback).fail(errorCallback);
          });

          waitsFor(function(){
            return errorCallback.callCount || successCallback.callCount;
          }, "GET request timed out", 2000);

          runs(function(){
            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalledWithArgsLike({
              type: "something_went_wrong",
              message: "something went wrong we dont know what"
            });
          });
        });

      });
    } else {
      describe("skipping jQuery integration tests, jQuery was not defined", function(){
        it("", function(){
          expect(true).toBeTruthy();
        });
      });
    }
  });
});