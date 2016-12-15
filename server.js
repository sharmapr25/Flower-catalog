var http = require('http');
var fs = require('fs');
var path = require('path');

var read = function(file){
	return fs.readFileSync(file);
}

var type = {'.html':'text/html',
	'.css':'text/css',
	'.jpg':'image/jpg',
	'.gif':'image/gif'
	};	// '.ico':'image/ico'};

var server = http.createServer(function(req, res){
	var filePath = '.'+req.url;
	if(filePath == './'){
		filePath = './public/index.html'
	}
	fs.readFile(filePath, function(error, content){
		console.log('filePath',filePath);
		if(error){
			res.statusCode = 404;
			res.end('File not found');
		};
		var contentType = type[path.extname(filePath)];
		res.setHeader('content-type',contentType);
		res.end(content,'utf8');
	});		
});



server.listen(8080);