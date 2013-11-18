if(typeof module === "object"){
  var Geotriggers = require("../geotriggers");
}

var ClientId = "ABC";
var ClientSecret = "XYZ";

describe("geotriggers.js", function() {

  it("should throw an error if initialized without an application_id or session", function(){
    expect(function(){
      var geotriggers = new Geotriggers.Session();
    }).toThrow();
  });

  it("should fire an `authenticated` event after the initializes successfully with an application id and secret", function(){

    var spy = jasmine.createSpy();
    var geotriggers;

    runs(function(){
      geotriggers = new Geotriggers.Session({
        clientId: ClientId,
        clientSecret: ClientSecret,
        persistSession: false
      });

      geotriggers.on("authentication:success", spy);
    });

    waitsFor(function(){
      return geotriggers.authenticated();
    }, "Did not auth", 6000);

    runs(function(){
      expect(spy).toHaveBeenCalled();
    });
  });

  it("should fire an `authenticated` event after the initializes successfully with an application id", function(){
    var spy = jasmine.createSpy();
    var geotriggers;

    runs(function(){
      geotriggers = new Geotriggers.Session({
        clientId: ClientId,
        persistSession: false
      });

      geotriggers.on("authentication:success", spy);
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
      clientId: ClientId,
      persistSession: false
    });

    it("should get a list of devices with a callback", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.request("device/list", spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not make request for device/list", 3000);

      runs(function(){
        var callbackArgs = spy.mostRecentCall.args;
        expect(callbackArgs[0]).toBeFalsy();
        expect(callbackArgs[1]).objectToLooselyMatch({
          devices: [{
            deviceId: "xxx",
            deviceSecret: null,
            createdOn: "date",
            tags: ["deviceTag"],
            updatedAt: null
          }]
        }, null, {});
        expect(callbackArgs[2]).toBeInstanceOf(XMLHttpRequest);
      });
    });

    it("should update a device and use a deferred", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.request("device/update", {
          addTags: ["foo"],
          properties: {
            foo: "bar"
          }
        }, spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not make request for device/update", 3000);

      runs(function(){
        expect(spy).toHaveBeenCalledWithArgsLike(null, {
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


    it("should be able to update location", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.request("location/update", {
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
        }, spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not run callback", 3000);

      runs(function(){
        expect(spy).toHaveBeenCalled();
      });
    });

    it("should be able to create a trigger", function(){
      var spy = jasmine.createSpy();

      runs(function(){
        geotriggers.request("trigger/create", {
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
            notification:{
              text: "At some random polygon in portland"
            }
          }
        }, spy);
      });

      waitsFor(function(){
        return spy.callCount;
      }, "Did not run callback", 3000);

      runs(function(){
        expect(spy).toHaveBeenCalled();
      });
    });

  });
});
