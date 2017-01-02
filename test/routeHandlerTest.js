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

describe('generated routeHandler',function(){
	
	describe('add customize routes to routeHandler',function(){
		//spying printHello function
		var printHello = sinon.spy(function(req, res){
			res.statusCode = 200,
			res.end('Hello');
		});

		//stubbing fs's readFile method
		sinon.stub(fs,'readFile').callsArgWith(1,true,'');

		//creating a table of url and setting in routeHandler
		var routeHandler= new RouteHandler(fs);
		routeHandler.addRoute('/','GET',printHello);

		it('should return exact response to given url',function(){
			//setup for request object
			var req = {url:'/', method:'GET'};

			//invoking handle with request and stubbed response
			routeHandler.handle(req, stubbedRes);

			//testing printHello call and response
			assert.ok(printHello.calledWith(req, stubbedRes));
			assert.equal(200, res.statusCode);
			assert.ok(res.end.calledWith('Hello'));
		});

		it('should return an error for invalid url',function(){
			//creating request object
			var req = {url:'/print', method:'GET'};

			//invoking handle with request and stubbed response
			routeHandler.handle(req, stubbedRes);

			//testing response status and response end
			assert.equal(404, res.statusCode);
			assert.ok(res.end.calledWith('File not found'));
		});	
	});

	describe('should add customize routes for accepts two urls',function(){
		//Creating two functions and spying them
		var printInstruction = sinon.spy(function(req, res){
			res.statusCode = 200;
			res.end('This is an instruction page');
		});

		var printWelcome = sinon.spy(function(req, res){
			res.statusCode = 200;
			res.end('welcome');
		});

		//Creating routeHandler with stubbed fs
		var routeHandler = new RouteHandler(fs);

		//Adding given above two functions to the routes table of routeHandler
		routeHandler.addRoute('/', 'GET', printWelcome);
		routeHandler.addRoute('/instruction','GET', printInstruction);

		it('should return 200 and welcome for given url',function(){
			//setup of request object
			var req = {url:'/', method:'GET'};

			//invoking handle method of routeHandler with req and stubbedResponse
			routeHandler.handle(req, stubbedRes);

			//testing response statusCode and response end
			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('welcome'));
		});

		it('should return instruction message for given url', function(){
			//creating request object with url and mehtod
			var req = {url:'/instruction',method:'GET'};

			//invoking handle method of routeHandler with req and stubbed res
			routeHandler.handle(req, stubbedRes);

			//testing response status code for instrction page
			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('This is an instruction page'));
		});

		it('should return an error for not valid url',function(){
			//setup for request object
			var req = {url:'/url', method:'GET'};

			//invoking handle method with request and stubbed response
			routeHandler.handle(req, stubbedRes);

			//testing response statusCode and end for invalid url
			assert.equal(res.statusCode, 404);
			assert.ok(res.end.calledWith('File not found'));
		});
	});

	describe('add customize routes for redirect',function(){
		//Creating two functions with spy them
		var homePage = sinon.spy(function(req, res){
			res.statusCode = 200;
			res.end('Hello');
		});

		var rediretToHomePage = sinon.spy(function(req,res){
			res.writeHead(303,{Location:'/'});
			res.statusCode = 303;
			res.end();
		})

		//Creating routeHandler with stubbed fs
		var routeHandler = new RouteHandler(fs);

		//Adding given above functions with url in routes Table of routeHandler
		routeHandler.addRoute('/', 'GET', homePage);
		routeHandler.addRoute('/redirectTo','GET',rediretToHomePage);

		it('should redirect to a specific url for given url',function(){
			//setup of request object
			var req = {url:'/redirectTo', method:'GET'};

			//invoking handle method with request and stubbed response
			routeHandler.handle(req, stubbedRes);

			//testing response status Code and writeHead method for redirection
			assert.equal(303, res.statusCode);
			assert.ok(res.writeHead.calledWith(303,{Location:'/'}));

		});
	});
});
