var http = require('http');

var outcome = function(res){
	res.setEncoding('utf8');
	var result = "";
	res.on('data', function(chunk){
		result += chunk; 
	});

	res.on('end',function(){
		console.log(result);
	})
};

var req = http.request('http://localhost:8080',outcome);
req.end();
