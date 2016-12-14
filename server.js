var http = require('http');
var fs = require('fs');

var getContent = function(req){
	if(req.url == '/')
		return 'hello';
	return fs.readFileSync('.'+req.url);
}

var callGetMethod = function(req, res){
	res.end(getContent(req));
};

var callPostMethod = function(req, res){
	var result = '';
	req.on('data', function(chunk){
		result += chunk;
	})

	req.on('end',function(){
		res.end('hello'+result);
	})
}

var server = http.createServer(function(req, res){
	if(req.method == 'GET'){
		callGetMethod(req,res);
	}
	callPostMethod(req, res);
	

});


server.listen(8080);