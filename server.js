var http = require('http');
var server = http.createServer(function(req, res){
	console.log(req.headers);
	res.setHeader('Content-Type','text/plain');
	res.end("hello");
});


server.listen(8080);