if(typeof module === "object" && !Geotriggers){
  var Geotriggers = require("../../src/geotriggers");
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
