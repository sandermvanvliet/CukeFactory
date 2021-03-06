var Feature = function(name, scenarios) {
	this.name = ko.observable(name);
	this.scenarios = ko.observableArray(scenarios);
};

var Scenario = function(name, spec)
{
		var self = this;
		self.name = ko.observable(name);
		self.spec = ko.observable(spec);
		self.specSyntaxed = ko.computed(function() {
			return syntaxify(self.spec());
		});
		self.steps = ko.observableArray([]);
		self.addStep = function(text) {
			self.steps.push(new Step(text));
		}
}
var Step = function(text)
{
		var self = this;
		self.stepText = ko.observable(text);
}

function FeaturesViewModel() {
	var self = this;
	self.features = ko.observableArray([
		new Feature("Browsing to Google", [ 
			new Scenario("Browsing to Google when the Internet is down", "Given the date is today\nAnd the internet is down\nWhen I browse to Google\nThen I see an error message"),
			new Scenario("Successfully browsing to Google", "Given the date is today\nAnd the internet is up\nWhen I browse to Google\nThen I see the Google start page") ]),
		new Feature("Showing features", [
			new Scenario("If there are no features the list is empty",
				"Given there are no stored scenarios\nWhen I view the list\nThen the list is empty"),
			new Scenario("There are four features",
				"Given there are four features\nWhen I view the list\nThen the list contains four features"),
			new Scenario("A feature contains four scenarios",
				"Given a feature with four scenarios\nWhen I view the list\nThen the feature item indicates four scenarios")
		])
	]);
	self.selectedFeatureScenarios = ko.observableArray([]);
	self.selectFeatureClick = function(feature) {
		self.selectedFeatureScenarios(feature.scenarios());
	}
	self.newScenario = ko.observable(new Scenario("New Scenario", ""));
};

// Helper
function syntaxify(text) {
	text = text.replace(/\n/g, '<br />');
	text = text.replace(/Given/g, '<span class="cuke-keyword">Given</span>');
	text = text.replace(/When/g, '<span class="cuke-keyword">When</span>');
	text = text.replace(/Then/g, '<span class="cuke-keyword">Then</span>');
	text = text.replace(/And/g, '<span class="cuke-keyword">And</span>');

	return text;
}
