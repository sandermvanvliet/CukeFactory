var NewScenarioViewModel = function() {
	var self = this;

	// Bindables
	self.name = ko.observable('');
	self.availableSteps = ko.observableArray([]);
	self.givens = ko.observableArray([]);
	self.whens = ko.observableArray([]);
	self.thens = ko.observableArray([]);

	// Functions
	self.loadAvailableSteps = function() {
		self.availableSteps.push(new Step('Given', 'tralalala'));
	};
};
