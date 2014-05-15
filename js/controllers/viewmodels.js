var FeaturesViewModel = function() {
	var self = this;
	self.features = ko.observableArray([]);
	self.selectedFeature = ko.observable(null);
	self.selectedScenario = ko.observable(null);
	self.newScenario = ko.observable(null);
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
		feature.selectScenario(null);
		self.selectedFeature(feature);
	};
	self.selectScenario = function(scenario) {
		self.selectedScenario(scenario);
		if(self.selectedFeature() !== null) {
			self.selectedFeature().selectScenario(scenario);
		}
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
						stepData.lines.forEach(function(l) { step.lines.push(l); });
						stepData.rows.forEach(function(r) { step.rows.push(r); });
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
		}).error(function(jqXHR, textStatus, errorThrown) { console.log('error: ' + textStatus);});
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
