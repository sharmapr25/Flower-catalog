var type = {'.html':'text/html',
	'.css':'text/css',
	'.jpg':'image/jpg',
	'.gif':'image/gif',
	'.js':'application/js',
	'.pdf':'application/pdf',
	'.txt':'text/plain',
	'.ico':'image/ico'
};

var path = require('path');

var RouteHandler = function(fileSystem){
	this.fileSystem = fileSystem;
	this.table = {};
};

RouteHandler.prototype = {
	handle: function(req, res){
		if(this.table[req.url])
			this.table[req.url][req.method](req, res);
		else
			this.renderFile(req, res);
	},

	addRoute: function(url, method, action){
		this.table[url] = {};
		this.table[url][method] = action;
	},

	renderFile : function(req, res){
		var file = './public'+req.url;

		this.fileSystem.readFile(file,function(error,content){
			if(error){
			 	res.statusCode = 404;
				res.end('File not found');
				return;
			};

			var contentType = type[path.extname(req.url)];
			res.setHeader('content-type',contentType);
			res.statusCode=200;
			res.end(content);
			
		});
	}
};

module.exports = RouteHandler;