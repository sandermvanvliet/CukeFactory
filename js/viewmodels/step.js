var Step = function(type, text) {
	var self = this;
	self.type = ko.observable(type);
	self.text= ko.observable(text);
	self.parameters = ko.observableArray([]);
	self.lines = ko.observableArray([]);
	self.rows = ko.observableArray([]);
};
