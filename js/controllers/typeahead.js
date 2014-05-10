var TypeAhead = function(selector) {
	var self = this;
	self.selector = selector;

	self.initialize = function(data,callback)
	{
		self.dataSource = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: data
			});

		self.dataSource.initialize();

		var promise = $(self.selector).typeahead({
			hint: true,
			highlight: true,
			minLength: 1
		},
		{
			name: 'searchResults',
			displayKey: 'text',
			source: self.dataSource.ttAdapter()
		});
		
		if(callback !== undefined) {
			promise.on('typeahead:selected', callback);
		}
	};
};
