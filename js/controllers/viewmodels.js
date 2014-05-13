var Feature = function(name) {
	var self = this;
	self.name = ko.observable(name)
	self.scenarios = ko.observableArray([]);
	self.addScenario = function(scenario) {
		self.scenarios.push(scenario);
	};
	self.file = ko.observable();
	self.selected = ko.observable(false);
};
var Scenario = function(name) {
	var self = this;
	self.type = ko.observable('Scenario');
	self.selected = ko.observable(false);
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
	self.scenarioClass = ko.computed(function() {
		var ret = self.selected() ? 'cuke-selected' : '';
		return ret + (self.type() == 'Background' ? ' cuke-feature-background' : '');
	});
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
	self.selectedScenario = ko.observable();
	self.newScenario = ko.observable();
	self.onNewScenario = function() { };
	self.createNewScenario = function() {
		var scenario = new Scenario("New Scenario");
		self.selectedFeature(null);
		self.newScenario(scenario);
		self.onNewScenario();
	};
	self.selectFeature = function(feature) {
		self.selectedScenario(null);
		self.newScenario(null);
		self.features().forEach(function(item) { item.selected(false); });
		feature.selected(true);
		feature.scenarios().forEach(function(item) { item.selected(false); });
		self.selectedFeature(feature);
	};
	self.selectScenario = function(scenario) {
		self.selectedScenario(scenario);
		self.selectedFeature().scenarios().forEach(function(item) { item.selected(false); });
		scenario.selected(true);
	};
	self.browseFeatures = function() {
		self.selectedFeature(null);
		self.selectedScenario(null);
		self.newScenario(null);
	};
	self.loadFeatures = function() {
		$.getJSON('http://localhost:8080/cukes', function(data) {
			var newFeatures = [];
			$.each(data.features, function(index,elem) {
				var feature = new Feature(elem.name);
				feature.file(elem.file);
				$.each(elem.scenarios, function(index,scenarioData) {
					var scenario = new Scenario(scenarioData.name);
					$.each(scenarioData.steps, function(index,stepData) {
						var step = new Step(stepData.type, stepData.text);
						scenario.addStep(step);
					});
					feature.addScenario(scenario);
				});
				if(elem.background !== undefined && elem.background !== null) {
					var background = new Scenario("Background");
					background.type('Background');
					$.each(elem.background.steps, function(index, stepData) {
						var step = new Step(stepData.type, stepData.text);
						background.addStep(step);
					});
					feature.scenarios.splice(0, 0, background);
				}
				newFeatures.push(feature);
			});
			self.features(newFeatures);
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
	self.searchBoxIndex = ko.observableArray();
	self.refreshSearchBox = function() {
		$.getJSON('http://localhost:8080/searchindex', function(data) {
				self.searchBoxIndex(data);
				});
	};
};
ko.bindingHandlers.intoView = 
	{
		update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
							var value = ko.unwrap(valueAccessor());
							if(value !== undefined) {
								$(element).scrollintoview();
							}
						}
	};
ko.bindingHandlers.expando ={
	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
					$(element).css('width', '0px');
				},
	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
						var value = ko.unwrap(valueAccessor());
						if(value !== undefined)
						{
							$(element).animate({ width:'400px'},500);
							$(element).prev().animate({width:'100px'},500);
							$(element).nextAll().animate({width:'0px'},500);
						}
						else
						{
							var e = $(element).siblings().eq(0);
							console.log(e);
							e.animate({width:'400px'},500);
						}
					}
};
