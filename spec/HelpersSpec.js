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