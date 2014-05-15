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
