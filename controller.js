var fs = require('fs');
var RouteHandler = require('./routeHandler');

var commentsList = [];

var redirectToIndex=function(req,res) {
	res.writeHead(303,{Location:'/index.html'});
	res.statusCode = 303;
	res.end();
}

var updateCommentList = function(req, res){
	var data = '';
	req.on('data',function(chunk){
		data += chunk;
	})	
	req.on('end',function(){
		commentsList.unshift(JSON.parse(data));
		res.end(data);
	})
}

var getComments = function(req, res){
	res.statusCode = 200;
	res.end(JSON.stringify(commentsList));
}

var Controller = function(fileSystem){
	this.fileSystem = fileSystem;
}

Controller.prototype.handle = function(req, res){
	var routeHandler = new RouteHandler(this.fileSystem);
	routeHandler.addRoute('/','GET',redirectToIndex);
	routeHandler.addRoute('/previous', 'GET', getComments);
	routeHandler.addRoute('/updated', 'POST', updateCommentList);
	routeHandler.handle(req, res);
}

module.exports = Controller;