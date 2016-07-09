// HomeController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

angular.module('mostPopularListingsApp.home', ['ngRoute', 'ngMaterial'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'components/views/homeView.html'
	});
}])

// Controller definition for this module
.controller('HomeController', ['$scope', '$location', '$http', function($scope, $location, $http) {
		var twitchalerts = {
				url: 'https://www.twitchalerts.com/api/v1.0',
				clientId: 'qx0vm0jgb3xPLjl6FR7AKIM9X5GVtEEx9zaDqpuG',
				cientSecret: 'elgU6YVKa3HiXoMvlh7wYCjGZ3i6r3yFjKmyXNu1',
				redirectUri: 'http://localhost:3000',
				authCode: $location.search()['code']
			};

		$scope.transaction = {};

	$scope.getAuthCode = function () {
		$http({
			url: '/getAuthCode',
			method: 'GET',
			params: {
				response_type: 'code',
				client_id: twitchalerts.clientId,
				redirect_uri: twitchalerts.redirectUri,
				scope: 'donations.create'
			}
		});
	}

	$scope.getAccessToken = function (code) {
			$scope.simplifyTransactionSuccess = true;
	};

	$scope.twitchalerts = function  (t) {
		console.log(t);
	}

}]);