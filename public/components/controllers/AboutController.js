// AboutController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('mostPopularListingsApp.about', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/about', {
		controller: 'AboutController',
		templateUrl: 'components/views/aboutView.html'
	});
}])

// Controller definition for this module
.controller('AboutController', ['$scope', function($scope) {

	$scope.hasPaid= true;
	$scope.user = {};

	function init(){
	
	};
	
	
	
	init();
}]);