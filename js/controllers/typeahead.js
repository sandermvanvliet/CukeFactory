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
			valueKey: 'text',
			source: self.dataSource.ttAdapter(),
			templates: {
				suggestion: Handlebars.compile('<p><span class="cuke-type">{{type}}</span> - {{text}}</p>'),
			},
			engine: Handlebars
		});
		
		if(callback !== undefined) {
			promise.on('typeahead:selected', callback);
		}

		promise.on('typeahead:opened', function() {
			var dropdown = $('.tt-dropdown-menu');

			var windowWidth = $(window).width();
			var dropdownWidth = dropdown.outerWidth() + 4;
			var textboxPosition = $(this).offset().left;

			var left = ((textboxPosition + dropdownWidth) - windowWidth) * -1;

			dropdown.css('left', left + 'px');
		});
	};
};
