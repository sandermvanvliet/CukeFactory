module.exports.CukeParser = function() {
	var Gherkin = require('gherkin');

	var self = {
		parse: function parse(data) {
						 var lexer = new (Gherkin.Lexer('en'))({
								comment: function() { },
								background: self.handleBackground,
						 		doc_string: self.handleDocString,
								eof: function() { },
								feature: self.handleFeature,
								row: function(cells, line) { },
								scenario: self.handleScenario,
								step: self.handleStep,
								tag: self.handleTag,
								scenario_outline: function(keyword, name, description, line) { },
								examples: function(keyword, name, description, line) { }
						 });

						 lexer.scan(data);
					 },
		handleBackground: function(keyword, name, description, line) {
												self.feature.background = { steps: [] };
											},
		handleFeature: function(keyword, name, description, line) {
										 self.feature = { name: name, description: description, scenarios: [], tags: self.featureTags, background: null, file: '' };
									 },
		handleScenario: function(keyword, name, description, line) { 
											self.currentScenario = { name: name, steps: [], tags: [] };
											self.feature.scenarios.push(self.currentScenario);
										},
		handleStep: function(keyword, name, line) { 
									var steps = self.currentScenario == null ? self.feature.background.steps : self.currentScenario.steps;
									keyword = keyword.trim();
									// Handle the 'And' keyword
									if(keyword.toLowerCase() === 'and') {
										keyword = steps[steps.length-1].type;
									}
									steps.push({ type: keyword.trim(), text: name.trim(), lines: [] });
								},
			handleTag: function(value, line) {
									 if(self.currentScenario == null) {
										 if(self.feature == null) {
											 self.featureTags.push(value);
										 }
										 else {
											 self.feature.tags.push(value);
										 }
									 }
									 else {
										 self.currentScenario.tags.push(value);
									 }
								 },
			handleDocString: function(contentType, string, line) { 
									var steps = self.currentScenario == null ? self.feature.background.steps : self.currentScenario.steps;
									steps[steps.length-1].lines.push(string);
								},
			feature: null,
			currentScenario: null,
			featureTags: []
	};

	return self;
};
