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
			source: self.dataSource.ttAdapter(),
			templates: {
				empty: [
					'<div class="empty-message">',
					'unable to find any matches',
					'</div>'
				].join(''),
				suggestion: Handlebars.compile('<p class="cuke-type">{{type}} - {{text}}</p>')
			},
			engine: Handlebars
		});
		
		if(callback !== undefined) {
			promise.on('typeahead:selected', callback);
		}
	};
};
