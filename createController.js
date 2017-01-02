var Controller = function(conditionFor, callbackOnTrue, callbackOnFalse){
	this.conditionFor = conditionFor;
	this.callbackOnTrue = callbackOnTrue;
	this.callbackOnFalse = callbackOnFalse;
};

Controller.prototype.handle = function(req, res){
	if(this.conditionFor(req.url)){
		res.statusCode = 200;
		res.end(this.callbackOnTrue());
	}
	else{
		res.statusCode = 404;
		res.end(this.callbackOnFalse());
	}
}

module.exports = Controller;