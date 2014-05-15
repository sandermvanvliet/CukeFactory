var Feature = function(name) {
	var self = this;
	self.name = ko.observable(name)
	self.scenarios = ko.observableArray([]);
	self.addScenario = function(scenario) {
		self.scenarios.push(scenario);
	};
	self.file = ko.observable();
	self.selected = ko.observable(false);
	self.selectScenario = function(scenario) {
		self.scenarios().forEach(function(item) { item.selected(false); });
		if(scenario !== null) {
			scenario.selected(true);
		}
	};
};
