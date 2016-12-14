var http = require('http');
var server = http.createServer(function(req, res){
	console.log(req);
	req.setEncoding('utf8');
	var name = '';
	req.on('data',function(chunk){
		name += chunk;
	})

	req.on('end',function(){
		res.setHeader('Content-Type','text/plain');
		res.end("hello"+name);
	})
	
});


server.listen(8080);