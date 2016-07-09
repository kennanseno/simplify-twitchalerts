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
			redirectUri: 'http://localhost:3000'
		};

	$scope.transaction = {};
	$scope.authCode = $location.search()['code'];

	$scope.getAuthCode = function () {
		$http({
			url: '/getAuthCode',
			method: 'GET',
			params: {
				response_type: 'code',
				redirect_uri: twitchalerts.redirectUri,
				scope: 'donations.create'
			}
		}).then(function success(response) {

		});
	};

	//wait for auth code then gets access token
	$scope.$watch(function() { return $scope.authCode; },
		function(authValue) {
			if(angular.isDefined(authValue)) {
				$http({
					url: '/accessToken',
					method: 'GET',
					params: {
						grant_type: 'authorization_code',
						redirect_uri: twitchalerts.redirectUri,
						code: authValue
					}
				}).then(function success(response) {
					$scope.transaction.accessToken = response.data.access_token;
					console.log('Twitchalerts token: ' + $scope.transaction.accessToken)
				});
			}
	});
}]);



