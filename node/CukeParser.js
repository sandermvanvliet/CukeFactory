module.exports.CukeParser = function() {
	var Gherkin = require('gherkin');

	var self = {
		parse: function parse(data) {
						 var lexer = new (Gherkin.Lexer('en'))({
								comment: function() { },
								background: function(keyword, name, description, line) { console.log('background'); },
								doc_string: function(contentType, string, line) { console.log('doc_string: ' + line); },
								eof: function() { },
								feature: self.handleFeature,
								row: function(cells, line) { console.log('row: ' + cells); },
								scenario: self.handleScenario,
								step: self.handleStep,
								tag: function(tag, line) { console.log('tag: ' + tag); },
								scenario_outline: function(keyword, name, description, line) { console.log('scenario_outline'); },
								examples: function(keyword, name, description, line) { console.log('examples'); }
						 });

						 lexer.scan(data);
					 },
		handleFeature: function(keyword, name, description, line) {
										 self.feature = { name: name, description: description, scenarios: [] };
									 },
		handleScenario: function(keyword, name, description, line) { 
											self.currentScenario = { name: name, steps: [] };
											self.feature.scenarios.push(self.currentScenario);
										},
		handleStep: function(keyword, name, line) { 
									keyword = keyword.trim();
									// Handle the 'And' keyword
									if(keyword.toLowerCase() === 'and') {
										keyword = self.currentScenario.steps[self.currentScenario.steps.length-1].type;
									}
									self.currentScenario.steps.push({ type: keyword.trim(), text: name.trim() });
								},
			feature: null,
			currentScenario: null
	};

	return self;
};
