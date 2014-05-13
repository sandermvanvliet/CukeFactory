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
server.get({path : '/searchindex', version: '0.0.1' }, searchIndex);

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
			if(type == 'feature') { 
				var data = fs.readFileSync(configuration.cukesPath + '/' + cuke, 'utf8');

				console.log('parsing ' + cuke);
				var parserInst = require('./CukeParser.js').CukeParser();
				parserInst.parse(data);

				response.features.push(parserInst.feature);
			}

			callback();
		},
		function(err) {
			if(err) throw err;

			self.currentFeatures = response.features;

			res.send(200, response);
		});
	});
}
function searchIndex(req, res, next) {
	var self = this;

	res.setHeader('Access-Control-Allow-Origin', '*');

	var response = [];

	self.currentFeatures.forEach(function(feature, index, array) {
		response.push({ text: feature.name, type: 'feature' });
		if(feature.scenarios !== undefined) {
			feature.scenarios.forEach(function(scenario, index, array) {
				response.push({ text: scenario.name, type: 'scenario' });
				if(scenario.steps !== undefined) {
					scenario.steps.forEach(function(step, index, array) {
						response.push({ text: step.text, type: 'step' });
					});
				}
			});
		}
	});

	var dedupe = require('dedupe');

	var dedupedResponse = dedupe(response);

	res.send(200, dedupedResponse);
}
