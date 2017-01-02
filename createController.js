var Controller = function(fileSystem){
	this.fileSystem = fileSystem;
	this.table = {};
};

Controller.prototype = {
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
		this.fileSystem.readFile(req.url, function(error, content){
			if(error){
				res.statusCode = 404;
				res.end('invalid url');
				return;
			}
			else{
				res.statusCode = 200;
				res.end(content,'utf8');
			}
		});
	}
};

module.exports = Controller;