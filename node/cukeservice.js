var restify = require('restify');

var ip_addr = '127.0.0.1';
var port = '8080';

var server = restify.createServer({
		name : "cukeservice"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var PATH = '/cukes'
var cukesFile = '../data/features.json';

server.get({path : PATH, version: '0.0.1' }, listAllCukes);

server.listen(port, ip_addr, function() {
	console.log('%s listening at %s', server.name, server.url);
});

function listAllCukes(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	var fs = require('fs');
	fs.readFile(cukesFile, 'utf8', function(err, data) {
		if(err) throw err;

		var jsObjData = JSON.parse(data);

		res.send(200, jsObjData);
	});
}
