
var controller = function(req,res){
	if(req.url.length > 0){
		res.statusCode = 404;
		res.end('File not found');
	}
	else{
		res.statusCode = 200;
		res.end('welcome');
	}
	
}

module.exports = controller;