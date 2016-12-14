var http = require('http');
var fs = require('fs');

var read = function(file){
	return fs.readFileSync('.'+file);
}

var server = http.createServer(function(req, res){
	res.setHeader('Content-Type','text/plain');
	console.log(req.url);
	if(req.url == '/')
		res.end('hello');
	else if(req.url == '/a.txt'){
		res.end(read(req.url));
	}
	res.statusCode = 404;
	res.end('jina hai toh command+q mar');
});


server.listen(8080);