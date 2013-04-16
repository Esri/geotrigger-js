Geotriggers = require("./src/Geotriggers.js");

g = new Geotriggers.Session({
  applicationId:"0y7X3Af0WS1CRONB",
  applicationSecret: "c748ee76473f44c4a4ac78e3a804069b",
  persistSession: false,
  debug: true
});

g.get("trigger/list", {
  tags: "test"
}).then(function(err, resp){
  console.log("finish");
  console.log(err, resp);
});

setTimeout(function(){}, 10000);