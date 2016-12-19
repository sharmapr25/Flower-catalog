var fs = require('fs');
var path = require('path');

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

var getComment = function(){
	return JSON.stringify(comment);
};

var getContent = function(){
	return read('./public/text/content.txt');
}

var urls = {'/previous': getComment,
	'/contentOfFlower':getContent}

var controller = function(req, res){
	console.log('let see path ',path.isAbsolute(req.url));
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
	if(urls[req.url]){
		res.end(urls[req.url]());
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
}


module.exports = controller;