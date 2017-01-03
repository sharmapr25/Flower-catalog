var assert = require('assert');
var Controller = require('../controller');
var sinon = require('sinon');
var fs, stubbedRes,res;

describe('Controller', function(){
	//================SETUP====================================================
	var makeResponse = function(){
		return {
			statusCode:0,
			end:function(){},
			setHeader:function(){},
			writeHead:function(){}
		};
	};

	beforeEach(function(){
		res = makeResponse();
		fs = {readFile:function(){}};
		stubbedRes = sinon.stub(res);
	})
	 //=============================TESTS=======================================
	it('should redirect to index page for given url /',function(){
		//Setup
		var req = {url:'/', method:'GET'}; 
		var controller = new Controller(fs);

		//Invoking handle method of controller
		controller.handle(req, stubbedRes);
		
		//Testing
		assert.equal(res.statusCode, 303);
		assert.ok(res.writeHead.calledWith(303, {Location:'/index.html'}));
	});


	it('should return 404 status code for invalid url',function(){
		//Setup
		var req = {url:'hello', method:'GET'};
		sinon.stub(fs,"readFile").callsArgWith(1,true,'');
		var controller = new Controller(fs);

		//Invoking handle method
		controller.handle(req, stubbedRes);
		
		//Testing
		assert.equal(res.statusCode, 404);
		assert.ok(res.end.calledWith('File not found'));
	});	

	it('should return content for given specific file',function(){
		//Setup
		var req = {url:'index.html'};
		sinon.stub(fs, "readFile").callsArgWith(1, false, 'Welcome');
		var controller = new Controller(fs);

		//Invoking handle method
		controller.handle(req, stubbedRes);

		//Testing
		assert.equal(res.statusCode, 200);
		assert.ok(res.end.calledWith('Welcome'));
	});

	it('should return content for specific file with content type',function(){
		//Setup
		var req = {url:'css/index.css'};
		sinon.stub(fs, "readFile").callsArgWith(1, false, 'Css is here')
		var controller = new Controller(fs);

		//Invoking handle method
		controller.handle(req, stubbedRes);

		//Testing
		assert.equal(res.statusCode,200);
		assert.ok(res.setHeader.calledWith('content-type','text/css'));
		assert.ok(res.end.calledWith('Css is here'));
	});
});










