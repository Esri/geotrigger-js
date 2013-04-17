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

    // loop over the shorter array and make sure the corresponding key in the longer array matches
    for(var key in ref) {
      if(typeof ref[key] === typeof test[key]) {

       // if the keys represent an object make sure that it matches
        if(typeof ref[key] === "object" && typeof test[key] === "object") {
          if(!objectSignaturesMatch(ref[key], test[key])){
            return false;
          }
        }

        // if the keys represent an array make sure that it matches
        if(typeof ref[key] === "array" && typeof test[key] === "array") {
          if(!arrySignaturesMatch(ref[key],test[key])){
            return false;
          }
        }

      }
    }
    return true;
  }

  // do the keys in object 1 match object 2?
  function objectSignaturesMatch(object1, object2){

    // because typeof null is object we need to check for it here before Object.keys
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

    // this expects an object to loosely match another object's signature
    objectToLooselyMatch: function(obj){
      return objectSignaturesMatch(this.actual, obj);
    },

    // this expects an array to loosely match another object's signature
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
