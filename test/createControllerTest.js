var assert = require('assert');
var Controller = require('../createController');
var sinon = require('sinon');
var fs = require('fs');

var stubbedRes, res;

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

describe('generate a controller',function(){
	
	describe('should generate a new general controller',function(){
		
		var printHello = function(){
			return {code:200,
				content:'Hello'};
		};

		var isValidUrl = function(url){
			return url == '/';
		};

		var printError = function(){
			return {code:404,
				content:'Invalid url'};
		}

		var controller= new Controller(isValidUrl, printHello, printError);

		it('should return hello for given url /',function(){
			var req = {url:'/'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('Hello'));
		});

		it('should return invalid url for given url /print',function(){
			var req = {url:'/print'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 404);
			assert.ok(res.end.calledWith('Invalid url'));
		});	
	});	

	describe('should generate a controller for accepting two urls',function(){
		var printInstruction = function(){
			return {code:200,
				content:'This is an instruction page'};
		};

		var printWelcome = function(url){
			if(url == '/'){
				return {code:200,
					content:'welcome'};
			}
			return printInstruction();
		};
		
		var printError = function(){
			return {code:404,
				content:'Given url is invalid'};
		};

		var isValidUrl = function(url){
			return (url == '/' || url == '/instruction');
		}

		var controller = new Controller(isValidUrl, printWelcome, printError);

		it('should return 200 and welcome for given url /',function(){
			var req = {url:'/'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('welcome'));
		});

		it('should return 200 for given url /instruction', function(){
			var req = {url:'/instruction'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 200);
			assert.ok(res.end.calledWith('This is an instruction page'));
		});

		it('should return an error for given url /url',function(){
			var req = {url:'/url'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 404);
			assert.ok(res.end.calledWith('Given url is invalid'));
		});
	});

	describe('generate a controller for reading file for given url',function(){
		var getContent = function(){
			return {code:303,
				content:fs.readFileSync('./test/data/hello.txt','utf-8')};
		};

		var printError = function(){
			return {code:404,
				content:'File not found'};
		};

		var isValidUrl = function(url){
			return url == '/hello';
		};

		var controller = new Controller(isValidUrl, getContent, printError);

		it('should return content of a file for given url /hello',function(){
			var req = {url:'/hello'};
			var expectedMessage = 'Hello, This is a home page.';

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 303);
			assert.ok(res.end.calledWith(expectedMessage));

		});

		it('should return an error for given url /foobar',function(){
			var req = {url:'/foobar'};

			controller.handle(req, stubbedRes);

			assert.equal(res.statusCode, 404);
			assert.ok(res.end.calledWith('File not found'));
		});
	});
});
