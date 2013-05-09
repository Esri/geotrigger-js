if(typeof module === "object" && !Geotriggers){
  var Geotriggers = require("../src/geotriggers");
}

var ApplicationId = "MpwWGenqaSCMSMii";
var ApplicationSecret = "520b13154c0f474caa6f5193a1aa122f";

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
          }]
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
            tags: ["deviceTag", "foo"],
            properties: {
              foo: "bar"
            },
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

    it("should chain deferreds", function(){
      var spy1 = jasmine.createSpy();
      var spy2 = jasmine.createSpy();

      runs(function(){
        geotriggers.request({
          method: "device/update",
          type: "POST",
          params: {
            addTags: ["test"]
          }
        }).then(spy1).success(spy2);
      });

      waitsFor(function(){
        return spy1.callCount || spy2.callCount;
      }, "Did not run at least one callback", 3000);

      runs(function(){
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
      });
    });

    it("should be able to update location", function(){
      var successSpy = jasmine.createSpy("success");
      var errorSpy = jasmine.createSpy("error");

      runs(function(){
        geotriggers.request({
          method: "location/update",
          type: "POST",
          params: {
            locations: [{
              "timestamp": "2012-05-09T16:03:53-0700",
              "planet":    "earth",
              "latitude":  45.51294827744629,
              "longitude": -122.66232132911682,
              "accuracy":  10.0,
              "speed":     null,
              "altitude":  0,
              "bearing":   null,
              "verticalAccuracy": null,
              "properties": {}
            }]
          }
        }).then(successSpy, errorSpy);
      });

      waitsFor(function(){
        return successSpy.callCount || errorSpy.callCount;
      }, "Did not run at least one callback", 3000);

      runs(function(){
        expect(errorSpy).not.toHaveBeenCalled();
        expect(successSpy).toHaveBeenCalled();
      });
    });

    it("should be able to update location", function(){
      var successSpy = jasmine.createSpy("success");
      var errorSpy = jasmine.createSpy("error");

      runs(function(){
        geotriggers.request({
          method: "trigger/create",
          type: "POST",
          params: {
            condition: {
              direction: "enter",
              geo:  {
                geojson: {
                  type: "Polygon",
                  coordinates: [
                    [ [-122.65, 45.55], [-122.65, 45.50], [-122.62, 45.50], [-122.62, 45.55], [-122.65, 45.55] ]
                  ]
                }
              }
            },
            action: {
              message: "At some random polygon in portland"
            }
          }
        }).then(successSpy, errorSpy);
      });

      waitsFor(function(){
        return successSpy.callCount || errorSpy.callCount;
      }, "Did not run at least one callback", 3000);

      runs(function(){
        expect(errorSpy).not.toHaveBeenCalled();
        expect(successSpy).toHaveBeenCalled();
      });
    });

  });
});
