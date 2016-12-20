var assert = require('assert');
var controller = require('../controller');
var sinon = require('sinon');

describe('File handler for response', function(){
	var fileHandler = controller.fileHandlerForResponse;
	it('should return file not found when given error is true',function(){
		var res = {
			statusCode:200,
			end:function(){},
			setHeader:function(){}
		};
		var stubbedRes = sinon.stub(res);
		var getContent = fileHandler(stubbedRes,'');
		getContent(true, 'welcome');
		assert.equal(res.statusCode, 404);
		assert.ok(res.end.called);
		assert.ok(res.end.calledWith('File not found'));
		assert.ok(!res.setHeader.called);
	})
});