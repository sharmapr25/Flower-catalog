var Controller = function(conditionFor, callbackOnTrue, callbackOnFalse){
	this.conditionFor = conditionFor;
	this.callbackOnTrue = callbackOnTrue;
	this.callbackOnFalse = callbackOnFalse;
};

Controller.prototype.handle = function(req, res){
	if(this.conditionFor(req.url)){
		var truthyValue = this.callbackOnTrue(req.url);
		res.statusCode = truthyValue.code;
		res.end(truthyValue.content);
	}
	else{
		var falsyValue = this.callbackOnFalse(req.url);
		res.statusCode = falsyValue.code;
		res.end(falsyValue.content);
	}
}

module.exports = Controller;