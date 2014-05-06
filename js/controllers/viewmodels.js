var Feature = function(name) {
	var self = this;
	self.name = ko.observable(name)
	self.scenarios = ko.observableArray([]);
	self.addScenario = function(scenario) {
		self.scenarios.push(scenario);
	};
};
var Scenario = function(name) {
	var self = this;
	self.name = ko.observable(name);
	self.givens = ko.observableArray([]);
	self.whens = ko.observableArray([]);
	self.thens = ko.observableArray([]);
	self.steps = ko.computed(function() {
		return self.givens().concat(self.whens()).concat(self.thens());
	});
	self.addStep = function(step) {
		var stepType = step.type().toLowerCase();
		if(stepType == 'given') {
			self.givens.push(step);
		}
		else if(stepType == 'when') {
			self.whens.push(step);
		}
		else if(stepType == 'then') {
			self.thens.push(step);
		}
	};
};
var Step = function(type, text) {
	var self = this;
	self.type = ko.observable(type);
	self.text= ko.observable(text);
	self.parameters = ko.observableArray([]);
};
var FeaturesViewModel = function() {
	var self = this;
	self.features = ko.observableArray([]);
	self.selectedFeature = ko.observable();
	self.newScenario = ko.observable();
	self.onNewScenario = function() { };
	self.createNewScenario = function() {
		var scenario = new Scenario("New Scenario");
		self.selectedFeature(null);
		self.newScenario(scenario);
		self.onNewScenario();
	};
	self.selectFeature = function(feature) {
		self.selectedFeature(feature);
		self.newScenario(null);
	};
	self.loadFeatures = function() {
		$.getJSON('data/features.json', function(data) {
			$.each(data.features, function(index,elem) {
				var feature = new Feature(elem.name);
				$.each(elem.scenarios, function(index,scenarioData) {
					var scenario = new Scenario(scenarioData.name);
					$.each(scenarioData.steps, function(index,stepData) {
						var step = new Step(stepData.type, stepData.text);
						scenario.addStep(step);
					});
					feature.addScenario(scenario);
				});
				self.features.push(feature);
			});
		}).error(function(jqXHR, textStatus, errorThrown) { console.log('error: ' + textStatus);
	 console.log(jqXHR.responseText);	});
	};
	self.allSteps = ko.computed(function() {
		return $.map(self.features(), function(feature) {
			return $.map(feature.scenarios(), function(scenario) {
				return $.map(scenario.steps(), function(step) {
					return step;
				})
			})
		});
	});
};
