var assert = require('assert');
var httpMocks = require('node-mocks-http');
var controller = require('../controller');

describe('response', function(){

	it('should return welcome',function(){
		var request = httpMocks.createRequest({method: 'GET'});
		var response = httpMocks.createResponse();

		controller(request, response);
		assert.equal(200, response.statusCode);
		assert.equal('welcome', response._getData());
	});

	it('should return 404 for given url vista',function(){
		var request = httpMocks.createRequest({
			method: 'GET',
			url:'/vista'
		});

		var response = httpMocks.createResponse();
		controller(request, response);
		assert.equal(404, response.statusCode);
		assert.equal('File not found', response._getData());
	});
});