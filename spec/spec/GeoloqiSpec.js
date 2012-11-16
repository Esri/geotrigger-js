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
      geoloqi.init({
        device_secret: "xxx"
      });
    }).toThrow();
  });

  it("should throw an error if initialized with an app_secret and device_secret", function(){
    expect(function(){
      geoloqi.init({
        app_id: "xxx",
        app_secret: "xxx",
        device_secret: "xxx"
      });
    }).toThrow();
  });

  it("should fire an `init` event after the initializes successfully", function(){
    var callback = jasmine.createSpy();
    
    geoloqi.on("init", callback);

    geoloqi.init({
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
    geoloqi.init({
      app_id: "xxx",
      app_secret: "xxx"
    });

    expect(geoloqi.authenticated()).toBeTruthy();
    
    this.after(function(){
      geoloqi.destory();
    });
  });

  it("should return true if there is a app_id and device_secret in auth", function(){
    geoloqi.init({
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
      geoloqi.init({
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
      geoloqi.init({
        app_id: "xxx",
        app_secret: "xxx"
      });

      if(window.dojo && window.jQuery) {
        expect(geoloqi.config.integration == window.jQuery);
      } else if (window.jQuery) {
        expect(geoloqi.config.integration == window.jQuery);
      } else if (window.dojo) {
        expect(geoloqi.config.integration == window.dojo);
      } else {
        expect(geoloqi.config.integration).toBeFalsy();
      }
    });

    it("should run a method without a callback or params and use deferreds", function(){
      geoloqi.init({
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
      geoloqi.init({
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
    
    if(window.dojo){
      describe("Dojo integration", function(){

        beforeEach(function(){
          geoloqi.init({
            app_id: "xxx",
            app_secret: "xxx",
            integration: window.dojo
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

    if(window.jQuery) {

      describe("jQuery integration", function(){
         
         beforeEach(function(){
          geoloqi.init({
            app_id: "xxx",
            app_secret: "xxx",
            integration: window.jQuery
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