var http = require('http');
var fs = require('fs');
var path = require('path');
var comment = [];

var read = function(file){
	return fs.readFileSync(file);
}


var type = {'.html':'text/html',
	'.css':'text/css',
	'.jpg':'image/jpg',
	'.gif':'image/gif',
	'.js':'application/js',
	'.pdf':'application/pdf'
	};	// '.ico':'image/ico'};

var server = http.createServer(function(req, res){
	if(req.url =='/updated'){
		var data = '';
		req.on('data',function(chunk){
			data += chunk;
		})	
		req.on('end',function(){
			comment.unshift(JSON.parse(data));
			res.end(data);
		})
	}

	if(req.url == '/previous'){
		var data = '';	
		res.end(JSON.stringify(comment));
	};

	var filePath = '.'+req.url;

	if(filePath == './'){
		filePath = './public/index.html'
	}
	fs.readFile(filePath, function(error, content){
		console.log('filePath',filePath);
		if(error){
			res.statusCode = 404;
			filePath = './';
			res.end('File not found');
			
		}
		else{
			var contentType = type[path.extname(filePath)];
			res.setHeader('content-type',contentType);
			res.end(content,'utf8');
		}
		
	});		
});



server.listen(8080);