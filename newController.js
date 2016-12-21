var fs = require('fs');
var path = require('path');

var Controller = function(fileSystem){
	this.fileSystem = fileSystem;
}

Controller.prototype = {
	renderFile: function(req,res){
		var file = path.format({
			dir: './public',
			base:req.url
		});

		this.fileSystem.readFile(file,"utf8",function(error,content){
			console.log("Error is ",error);
			if(error){
			 	res.statusCode = 404;
				res.end('File not found');
				return;
			}
			res.statusCode=200;
			res.end(content);
		});

	},

	handle:function(req, res){
		if(req.url == '/'){
			res.statusCode = 200;
			res.end('welcome');	
		}
		this.renderFile(req,res);
	}

};

module.exports = Controller;