if(typeof module === "object" && !Geotriggers){
  var Geotriggers = require("../../src/geotriggers");
}

describe("geotriggers.js", function() {

  it("should throw an error if initialized without an application_id", function(){
    expect(function(){
      Geotriggers.configure({
        device_secret: "xxx"
      });
    }).toThrow();
  });

  it("should throw an error if initialized with an application_secret and device_secret", function(){
    expect(function(){
      Geotriggers.configure({
        application_id: "xxx",
        application_secret: "xxx",
        device_secret: "xxx"
      });
    }).toThrow();
  });

  it("should fire an `init` event after the initializes successfully", function(){
    var callback = jasmine.createSpy();

    Geotriggers.configure({
      application_id: "xxx",
      application_secret: "xxx"
    });

    expect(callback).toHaveBeenCalled();

    this.after(function(){
      Geotriggers.destory();
    });
  });

  it("should return true if there is a application_id and application_secret in auth", function(){
    Geotriggers.configure({
      application_id: "xxx",
      application_secret: "xxx"
    });

    expect(Geotriggers.authenticated()).toBeTruthy();

    this.after(function(){
      Geotriggers.destory();
    });
  });

  it("should return true if there is a application_id and device_secret in auth", function(){
    Geotriggers.configure({
      application_id: "xxx",
      device_secret: "xxx"
    });

    expect(Geotriggers.authenticated()).toBeTruthy();

    this.after(function(){
      Geotriggers.destory();
    });
  });

  it("should return false if there is not a valid application_id and a device_secret or application_secret", function(){
    expect(Geotriggers.authenticated()).toBeFalsy();
  });

  describe("api request methods", function(){

    beforeEach(function(){
      Geotriggers.configure({
        application_id: "xxx",
        application_secret: "xxx"
      });
    });

    it("should make a GET request with a callback", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        Geotriggers.get("location/last").then(callback);
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
        Geotriggers.post("location/update", {
          latitude:  45,
          longitude: 45
        }).then(callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "POST request timed out", 2000);

      runs(function(){
        expect(callback).toHaveBeenCalledWithArgsLike({
          application_id: "xxx",
          application_secret: "xxx",
          latitude:  45,
          longitude: 45
        }, null);
      });
    });

    it("should make a GET request and use an xhr object in the callback", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        Geotriggers.request("GET", "location/last").then(callback);
      });

      waitsFor(function(){
        return callback.callCount;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(callback.mostRecentCall.args[0] instanceof XMLHttpRequest);
      });
    });

    it("should make a POST request and use an xhr object in the callback", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        Geotriggers.request("POST", "location/update", {
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

    it("should make a successful request with no parameters", function(){
      var callback = jasmine.createSpy();

      runs(function(){
        Geotriggers.get("location/last", callback);
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
});
