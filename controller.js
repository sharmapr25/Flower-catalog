 var controllers = {};
var fs = require('fs');
var path = require('path');
var url=require('url');

var type = {'.html':'text/html',
	'.css':'text/css',
	'.jpg':'image/jpg',
	'.gif':'image/gif',
	'.js':'application/js',
	'.pdf':'application/pdf',
	'.txt':'text/plain',
	'.ico':'image/ico'};

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

var redirectToIndex=function(req,res) {
	res.writeHead(303,{Location:'/index.html'});
	res.end();
}

var urls = {
	'/previous': getComment,
	'/updated': updateCommentList,
	'/': redirectToIndex
};

controllers.fileHandlerForResponse=function(res, contentType) {
	return function(error, content){
		if(error){
			res.statusCode = 404;
			res.end('File not found');
		}
		else{
			res.setHeader('content-type',contentType);
			res.end(content,'utf8');
		}
	}
}

var renderFile=function(filePath,req,res) {
	var contentType = type[path.extname(filePath)];
	fs.readFile(filePath, controllers.fileHandlerForResponse(res, contentType));	
}

controllers.controller = function(req, res){
	var filePath="./public";

	var pathToCheck=url.parse(req.url).pathname;

	if(urls[pathToCheck]){
		urls[pathToCheck](req,res);
	};

	filePath += pathToCheck;
	renderFile(filePath,req,res);
		
}


module.exports = controllers;