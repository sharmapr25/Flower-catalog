var assert = require('assert');
var Controller = require('../createController');
var sinon = require('sinon');

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
})

describe('should generate a general new controller',function(){
		var printHello = function(){
			return 'Hello';
		};

		var isValidUrl = function(url){
			return url == '/';
		};

		var printError = function(){
			return 'Invalid url';
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
