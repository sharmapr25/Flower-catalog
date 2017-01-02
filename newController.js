var fs = require('fs');
var path = require('path');

var commentsList = [];

var type = {'.html':'text/html',
	'.css':'text/css',
	'.jpg':'image/jpg',
	'.gif':'image/gif',
	'.js':'application/js',
	'.pdf':'application/pdf',
	'.txt':'text/plain',
	'.ico':'image/ico'
};

var redirectToIndex=function(req,res) {
	res.writeHead(303,{Location:'/index.html'});
	res.statusCode = 303;
	res.end();
}


var getComments = function(req, res){
	res.statusCode = 200;
	res.end(JSON.stringify(commentsList));
}

var urls = {
	'/':redirectToIndex,
	'previous':getComments
}

var Controller = function(fileSystem){
	this.fileSystem = fileSystem;
	this.foobar="This is inside the Controller object";
}

Controller.prototype = {
	renderFile:function(req,res){
		var file = path.format({
			dir: './public',
			base:req.url
		});


		this.fileSystem.readFile(file,"utf8",function(error,content){
			if(error){
			 	res.statusCode = 404;
				res.end('File not found');
				return;
			}

			var contentType = type[path.extname(req.url)];
			res.setHeader('content-type',contentType);
			res.statusCode=200;
			res.end(content);
			
		});
	},

	handle:function(req, res){
		if(urls[req.url])
			return urls[req.url](req, res);
		return this.renderFile(req,res);

	}
};

module.exports = Controller;