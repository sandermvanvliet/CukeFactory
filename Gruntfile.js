'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <% pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			build: {
				files: {
					'js/cukefactory.min.js': [
		'js/viewmodels/step.js',
		'js/viewmodels/scenario.js',
		'js/viewmodels/feature.js',
//		'js/viewmodels/newscenario.js',
		'js/controllers/viewmodels.js'
					],
					'js/typeahead.min.js': [
		'js/controllers/typeahead.js'
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);
};
