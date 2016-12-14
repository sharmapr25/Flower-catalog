var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req, res){
	var content = fs.readFileSync('.'+req.url);
	res.write(content);
	res.end();
	
});


server.listen(8080);