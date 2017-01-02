var assert = require('assert');
var Controller = require('../controller');
var sinon = require('sinon');

describe('myController', function(){
	var controller = new Controller();
	var fs;

	var makeResponse = function(){
		return {
			statusCode:0,
			end:function(){},
			setHeader:function(){},
			writeHead:function(){}
		};
	};

	beforeEach(function(){
		fs = {readFile:function(){}};
	})

	it('should return response and 200 status code for given url /',function(){
		var res = makeResponse();
		var req = {url:'/'};
		var stubbedRes = sinon.stub(res);
		
		var controller=new Controller(fs);
		controller.handle(req, stubbedRes);
		
		assert.equal(res.statusCode, 303);
		assert.ok(res.writeHead.calledWith(303, {Location:'/index.html'}));
	});


	it('should return 404 status code for given invalid url',function(){
		var res = makeResponse();
		var req = {url:'hello'};
		var stubbedRes = sinon.stub(res);

		sinon.stub(fs,"readFile").callsArgWith(1,true,'');

		var controller=new Controller(fs);
		controller.handle(req,stubbedRes);
		
		assert.equal(res.statusCode, 404);
		assert.ok(res.end.calledWith('File not found'));
	});	

	it('should return content and 200 status code for given url',function(){
		var res = makeResponse();
		var req = {url:'index.html'};
		var stubbedRes = sinon.stub(res);

		sinon.stub(fs, "readFile").callsArgWith(1, false, 'Welcome');

		var controller = new Controller(fs);
		controller.handle(req,stubbedRes);

		assert.equal(res.statusCode, 200);
		assert.ok(res.end.calledWith('Welcome'));
	});

	it('should return response for given url',function(){
		var res = makeResponse();
		var req = {url:'css/index.css'};
		var stubbedRes = sinon.stub(res);

		sinon.stub(fs, "readFile").callsArgWith(1, false, 'Css is here');

		var controller = new Controller(fs);
		controller.handle(req,stubbedRes);

		assert.equal(res.statusCode,200);
		assert.ok(res.setHeader.calledWith('content-type','text/css'));
		assert.ok(res.end.calledWith('Css is here'));
	});
});










