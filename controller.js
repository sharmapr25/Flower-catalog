var fs = require('fs');
var path = require('path');
var url=require('url');

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

var getComment = function(req, res){
	res.end(JSON.stringify(comment));
};

var updateCommentList = function(req, res){
	var data = '';
	req.on('data',function(chunk){
		data += chunk;
	})	
	req.on('end',function(){
		comment.unshift(JSON.parse(data));
		res.end(data);
	})
}

var urls = {'/previous': getComment,
	'/updated': updateCommentList
};

var controller = function(req, res){
	if(urls[req.url]){
		urls[req.url](req,res);
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