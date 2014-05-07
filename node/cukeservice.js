var restify = require('restify');

var configuration = {
	listen_ip_addr: '127.0.0.1',
	port: '8080',
	name: 'cukeservice',
	cukesPath: '../data/features.json'
};

var server = restify.createServer({
		name : configuration.name
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var PATH = '/cukes'

server.get({path : PATH, version: '0.0.1' }, listAllCukes);

server.listen(configuration.listen_port, configuration.listen_ip_addr, function() {
	console.log('%s listening at %s', server.name, server.url);
});

function listAllCukes(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	var fs = require('fs');
	fs.readFile(configuration.cukesPath, 'utf8', function(err, data) {
		if(err) throw err;

		var jsObjData = JSON.parse(data);

		res.send(200, jsObjData);
	});
}
