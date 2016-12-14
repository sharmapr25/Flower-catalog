var http = require('http');
var fs = require('fs');

var callGetMethod = function(req, res){
	if(req.url == '/')
		return 'hello';
	var content = fs.readFileSync('.'+req.url);
	return content;
}

var server = http.createServer(function(req, res){
	if(req.method == 'GET'){
		res.end(callGetMethod(req, res));
	}
});


server.listen(8080);