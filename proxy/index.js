var request = require('request');
var http = require('http');

var server = http.createServer().listen(8080);

function notFound (res) {
  res.statusCode = 404;
  res.end('404 Error');
}

server.on('request', function (req, res) {
  var url = req.url;

  var test = {
    proxy: /^\/proxy\/(.+)$/,
    hosts: /^https?:\/\/(geotrigger\.)?arcgis\.com\//
  };

  var matchProxy = url.match(test.proxy);

  if (!matchProxy) {
    return notFound(res);
  }

  var target = matchProxy[1];
  var matchHosts = target.match(test.hosts);

  if (!matchHosts) {
    return notFound(res);
  }

  var headers = req.headers;
  var method = req.method;

  delete headers.host;

  req.pipe(request({
    url: target,
    headers: headers,
    method: method
  })).pipe(res);

});

console.log('proxy server running on port 8080');