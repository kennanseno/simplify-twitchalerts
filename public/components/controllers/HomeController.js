// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('mostPopularListingsApp.home', ['ngRoute'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'components/views/homeView.html'
	});
}])

// Controller definition for this module
.controller('HomeController', ['$scope', '$location', '$http', function($scope, $location, $http) {


	var authLink = 'https://www.twitchalerts.com/api/v1.0/authorize',
		cientSecret = 'elgU6YVKa3HiXoMvlh7wYCjGZ3i6r3yFjKmyXNu1',
		redirectUri= 'http://localhost:3000',
		authCode = $location.search()['code'],
		transaction = {};



	$scope.processSimplifyTransaction = function () {

	};

	$scope.processTwitchalerts = function  () {
	
	}

}]);