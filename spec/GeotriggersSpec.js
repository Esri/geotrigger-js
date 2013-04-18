if(typeof module === "object" && !Geotriggers){
  var Geotriggers = require("../../src/geotriggers");
}

var ApplicationId = "XXX";
var ApplicationSecret = "XXX";

describe("geotriggers.js", function() {

  it("should throw an error if initialized without an application_id or session", function(){
    expect(function(){
      new Geotriggers.Session();
    }).toThrow();
  });

  it("should fire an `authenticated` event after the initializes successfully with an application id and secret", function(){
    var spy = jasmine.createSpy();
    var geotriggers;

    runs(function(){
      geotriggers = new Geotriggers.Session({
        applicationId: ApplicationId,
        applicationSecret: ApplicationSecret,
        persistSession: false
      });

      geotriggers.on("authenticated", spy);
    });

    waitsFor(function(){
      return geotriggers.authenticated();
    }, "Did not auth", 3000);

    runs(function(){
      expect(spy).toHaveBeenCalled();
      expect(geotriggers.authenticated()).toBeTruthy();
    });
  });

  it("should fire an `authenticated` event after the initializes successfully with an application id", function(){
    var spy = jasmine.createSpy();
    var geotriggers;

    runs(function(){
      geotriggers = new Geotriggers.Session({
        applicationId: ApplicationId,
        persistSession: false
      });

      geotriggers.on("authenticated", spy);
    });

    waitsFor(function(){
      return geotriggers.authenticated();
    }, "Did not auth", 3000);

    runs(function(){
      expect(spy).toHaveBeenCalled();
      expect(geotriggers.authenticated()).toBeTruthy();
    });
  });

  describe("api request methods", function(){
    var geotriggers = new Geotriggers.Session({
      applicationId: ApplicationId,
      persistSession: false
    });

    it("should make a GET request with a callback", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.get("device/list",{}).success(spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not make request for device/list", 3000);

      runs(function(){
        expect(spy).toHaveBeenCalledWithArgsLike({
          devices: [{
            deviceId: "xxx",
            deviceSecret: null,
            createdOn: "date",
            tags: ["deviceTag"],
            updatedAt: null
          }],
          envelope: null
        });
      });
    });

    it("should make a POST request with a callback", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.post("device/update",{
          params: {
            addTags: ["foo"],
            properties: {
              foo: "bar"
            }
          }
        }).success(spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not make request for device/update", 3000);

      runs(function(){
        expect(spy).toHaveBeenCalledWithArgsLike({
          devices: [{
            deviceId: "xxx",
            tags: ["deviceTag"],
            trackingProfile: null,
            lastSeen: "date"
          }]
        });
      });
    });

    it("should make a GET request and use an xhr object in the callback", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.request({
          type: "GET",
          method: "device/list"
        }).then(spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "GET request timed out", 2000);

      runs(function(){
        expect(spy.mostRecentCall.args[0] instanceof XMLHttpRequest);
      });
    });

    it("should make a POST request and use an xhr object in the callback", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.request({
          method: "device/update",
          type: "POST",
          params: {
            addTags: ["foo"],
            properties: {
              foo: "bar"
            }
          }
        }).success(spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not make request for device/update", 3000);

      runs(function(){
        expect(spy.mostRecentCall.args[0] instanceof XMLHttpRequest);
      });
    });

  });
});