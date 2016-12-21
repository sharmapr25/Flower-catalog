var assert = require('assert');
var Controller = require('../newController');
var sinon = require('sinon');

describe('myController', function(){
	var controller = new Controller();
	var fs;

	var makeResponse = function(){
		return {
			statusCode:0,
			end:function(){}
		};
	};

	beforeEach(function(){
		fs = {readFile:function(){}};
	})

	it('should return welcome and 200 status code for given url /',function(){
		var res = makeResponse();
		var req = {url:'/'};
		var stubbedRes = sinon.stub(res);
		
		var controller=new Controller(fs);
		controller.handle(req, stubbedRes);
		
		assert.equal(res.statusCode, 200);
		assert.ok(res.end.calledWith('welcome'));
	});


	it('should return 404 status code for given invalid url',function(){
		var res = makeResponse();
		var req = {url:'hello'};
		var stubbedRes = sinon.stub(res);

		sinon.stub(fs,"readFile").callsArgWith(2,true,'');

		var controller=new Controller(fs);
		controller.handle(req,stubbedRes);
		
		assert.equal(res.statusCode, 404);
		assert.ok(res.end.calledWith('File not found'));
	});	

	it('should return content and 200 status code for given url',function(){
		var res = makeResponse();
		var req = {url:'index.html'};
		var stubbedRes = sinon.stub(res);

		sinon.stub(fs, "readFile").callsArgWith(2, false, 'Welcome');

		var controller = new Controller(fs);
		controller.handle(req,stubbedRes);

		assert.equal(res.statusCode, 200);
		assert.ok(res.end.calledWith('Welcome'));
	});
});










