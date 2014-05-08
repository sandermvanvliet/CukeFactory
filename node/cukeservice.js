var restify = require('restify');
var async = require('async');

var configuration = {
	listen_ip_addr: '127.0.0.1',
	listen_port: '8080',
	name: 'cukeservice',
	cukesPath: '../data/cukes',
	rawCukeFile: '../data/simplecuke.feature'
	
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
	var self = this;
	res.setHeader('Access-Control-Allow-Origin', '*');

	var fs = require('fs');
	var response = { features: [] };

	fs.readdir(configuration.cukesPath, function(err, files) {
		if(err) throw err;

		async.each(files, function(cuke, callback) {
			var type = cuke.slice(-7).toLowerCase();
			console.log('type: ' + type);
			if(type == 'feature') { 
				var data = fs.readFileSync(configuration.cukesPath + '/' + cuke, 'utf8');

				var parserInst = require('./CukeParser.js').CukeParser();
				parserInst.parse(data);

				response.features.push(parserInst.feature);
			}

			callback();
		},
		function(err) {
			if(err) throw err;

			console.log('responding with ' + response.features.length + ' cukes');

			res.send(200, response);
		});
	});
}
