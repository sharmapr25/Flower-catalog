var assert = require('assert');
var Controller = require('../createController');
var sinon = require('sinon');

var stubbedRes, res;
var fs = {readFile:function(){}};

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
	stubbedRes = sinon.stub(res);
});

describe('generated controller',function(){
	
	describe('add customize routes to controller',function(){
		
		var printHello = sinon.spy(function(req, res){
			res.statusCode = 200,
			res.end('Hello');
		});

		sinon.stub(fs,'readFile').callsArgWith(2,true,'');

		var controller= new Controller(fs);
		controller.addRoute('/','GET',printHello);

		it('should return exact response to given url',function(){
			var req = {url:'/', method:'GET'};

			controller.handle(req, stubbedRes);

			assert.ok(printHello.calledWith(req, stubbedRes));
			assert.equal(200, res.statusCode);
			assert.ok(res.end.calledWith('Hello'));
		});

		it('should return an error for invalid url',function(){
			var req = {url:'/print', method:'GET'};

			controller.handle(req, stubbedRes);

			assert.equal(404, res.statusCode);
			assert.ok(res.end.calledWith('invalid url'));
		});	
	});

	describe('should add customize routes for accepts two urls',function(){
		var printInstruction = function(req, res){
			res.statusCode = 200;
			res.end('This is an instruction page');
		};

		var printWelcome = function(req, res){
			res.statusCode = 200;
			res.end('welcome');
		};

		var controller = new Controller(fs);
		controller.addRoute('/', 'GET', printWelcome);
		controller.addRoute('/instruction','GET', printInstruction);

		it('should return 200 and welcome for given url',function(){
			var req = {url:'/', method:'GET'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('welcome'));
		});

		it('should return instruction message for given url', function(){
			var req = {url:'/instruction',method:'GET'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('This is an instruction page'));
		});

		it('should return an error for not valid url',function(){
			var req = {url:'/url', method:'GET'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 404);
			assert.ok(res.end.calledWith('invalid url'));
		});
	});

	describe('add customize routes for redirect',function(){
		var homePage = sinon.spy(function(req, res){
			res.statusCode = 200;
			res.end('Hello');
		});

		var rediretToHomePage = sinon.spy(function(req,res){
			res.writeHead(303,{Location:'/'});
			res.statusCode = 303;
			res.end();
		})

		var controller = new Controller(fs);
		controller.addRoute('/', 'GET', homePage);
		controller.addRoute('/redirectTo','GET',rediretToHomePage);

		it('should redirect to a specific url for given url',function(){
			
			var req = {url:'/redirectTo', method:'GET'};

			controller.handle(req, stubbedRes);

			assert.equal(303, res.statusCode);
			assert.ok(res.writeHead.calledWith(303,{Location:'/'}));
		});
	});
});
