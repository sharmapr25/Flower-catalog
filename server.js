var http = require('http');
var fs = require('fs');
var Controller = require('./controller');
var controller = new Controller(fs);

var server = http.createServer(controller.handle.bind(controller));

server.listen(8080);