var assert = require('assert');
var RouteHandler = require('../routeHandler');
var sinon = require('sinon');

var stubbedRes, res;
var fs = {readFile:function(){}};

//making response object
var makeResponse = function(){
	return {
		statusCode:0,
		end:function(){},
		setHeader:function(){},
		writeHead:function(){}
	};
};

beforeEach(function(){
	//stubbing response
	res = makeResponse();
	stubbedRes = sinon.stub(res);
});

describe('routeHandler',function(){
	var printHello = sinon.spy(function(req, res){
		res.statusCode = 200;
		res.end('Hello');
	});

	describe('add customize routes to routeHandler',function(){
		//======================SETUP==========================
		var routeHandler;

		before(function(){
			sinon.stub(fs,'readFile').callsArgWith(1,true,'');

			routeHandler = new RouteHandler(fs);
			routeHandler.addRoute('/','GET',printHello);
		});

		//========================TESTS==============================

		it('should return exact response to given url',function(){
			var req = {url:'/', method:'GET'};

			routeHandler.handle(req, stubbedRes);

			assert.equal(200, res.statusCode);
			assert.ok(res.end.calledWith('Hello'));
			assert.ok(printHello.calledWith(req, stubbedRes));
		});

		it('should return an error for invalid url',function(){
			var req = {url:'/print', method:'GET'};

			routeHandler.handle(req, stubbedRes);

			assert.equal(404, res.statusCode);
			assert.ok(res.end.calledWith('File not found'));
		});	
	});


	describe('should add customize routes for accepts two urls',function(){
		//=========================SETUP=============================
		var routeHandler;
		var printInstruction = sinon.spy(function(req, res){
			res.statusCode = 200;
			res.end('This is an instruction page');
		});

		var printWelcome = sinon.spy(function(req, res){
			res.statusCode = 200;
			res.end('welcome');
		});

		before(function(){
			routeHandler = new RouteHandler(fs);
			routeHandler.addRoute('/', 'GET', printWelcome);
			routeHandler.addRoute('/instruction','GET', printInstruction);
		});

		//=======================TESTS===================================

		it('should return 200 and welcome for given url',function(){
			var req = {url:'/', method:'GET'};

			routeHandler.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('welcome'));
		});

		it('should return instruction message for given url', function(){
			var req = {url:'/instruction',method:'GET'};

			routeHandler.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('This is an instruction page'));
		});

		it('should return an error for not valid url',function(){
			var req = {url:'/url', method:'GET'};

			routeHandler.handle(req, stubbedRes);

			assert.equal(res.statusCode, 404);
			assert.ok(res.end.calledWith('File not found'));
		});
	});


	describe('add customize routes for redirect',function(){
		//========================SETUP===========================
		var routeHandler;

		var rediretToHomePage = sinon.spy(function(req,res){
			res.writeHead(303,{Location:'/'});
			res.statusCode = 303;
			res.end();
		});

		before(function(){
			routeHandler = new RouteHandler(fs);
			routeHandler.addRoute('/', 'GET', printHello);
			routeHandler.addRoute('/redirectTo','GET',rediretToHomePage);
		});

		//=========================TESTS===============================

		it('should redirect to a specific url for given url',function(){
			var req = {url:'/redirectTo', method:'GET'};

			routeHandler.handle(req, stubbedRes);

			assert.equal(303, res.statusCode);
			assert.ok(res.writeHead.calledWith(303,{Location:'/'}));
		});
	});
});
