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


	$scope.authCode = $location.search()['code'];
	$scope.name = 'sdasdas';
	$scope.show = true;


	$scope.getAccessToken = function (code) {
			$scope.simplifyTransactionSuccess = true;
	};

	$scope.twitchalerts = function  () {

	}

}]);