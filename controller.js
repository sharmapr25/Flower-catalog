var type = {'.html':'text/html',
	'.css':'text/css',
	'.jpg':'image/jpg',
	'.gif':'image/gif',
	'.js':'application/js',
	'.pdf':'application/pdf',
	'.txt':'text/plain'
	};	// '.ico':'image/ico'};


var read = function(file){
	return fs.readFileSync(file,'utf8');
}

var comment = [];

var fs = require('fs');
var path = require('path');




var controller = function(req, res){
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

	if(req.url == '/contentOfFlower'){
		var content = read('./public/text/content.txt');
		res.end(content);
	}

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
}


module.exports = controller;