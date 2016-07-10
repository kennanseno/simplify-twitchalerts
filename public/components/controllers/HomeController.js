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
.controller('HomeController', ['$scope', '$location', '$http', '$window', function($scope, $location, $http, $window) {

	$scope.transaction = {};






    /**
	 * TWITCHALERTS FUNCTIONALITY
     */
	var twitchalerts = {
		url: 'https://www.twitchalerts.com/api/v1.0',
		redirectUri: 'http://localhost:3000'
	};
	$scope.donation = {};
	$scope.authCode = $location.search()['code'];
	$scope.authLink = twitchalerts.url + '/authorize?' +
		              'response_type=code&' +
	 				  'client_id=qx0vm0jgb3xPLjl6FR7AKIM9X5GVtEEx9zaDqpuG&' +
		              'redirect_uri=' + twitchalerts.redirectUri + '&' +
		              'scope=donations.create';

	/**
	 * Process twitchalerts donation
	 * @param donation
	 */
	$scope.donate = function(donation) {
		if(angular.isDefined($scope.authCode)) {
			processDonation(donation, $scope.transaction.token);
		}else {
			$window.location.href = $scope.authLink;
		}
	};

	/**
	 * Wait for Auth code then get access token
	 */
	$scope.$watch(function() { return $scope.authCode; },
		function(authValue) {
			if(angular.isDefined(authValue)) {
				requestToken($scope.authCode);
			}
	});

	/**
	 * Function to request token
	 * @param authValue
     */
	function requestToken(authValue) {
		$http({
			url: '/accessToken',
			method: 'GET',
			params: {
				grant_type: 'authorization_code',
				redirect_uri: twitchalerts.redirectUri,
				code: authValue
			}
		}).then(function success(response) {
			$scope.transaction.token = response.data;
			console.log('Twitchalerts token: ' + $scope.transaction.token.access_token);
		});
	}

	/**
	 * Function to process donation
	 * @param donation
	 * @param token
     */
	function processDonation(donation, token) {
		$http({
			url: '/processDonation',
			method: 'GET',
			params: {
				access_token: token.access_token,
				name: donation.name,
				identifier: donation.email,
				amount: donation.amount,
				currency: 'USD',
				message: donation.message
			}
		}).then(function success(response) {
			console.log('Donation succeeded: ', JSON.stringify(response.data));
			refreshUsedToken(token.refresh_token);
		});
	}

	/**
	 * Function to request new token once existing one is used
	 * @param refreshToken
     */
	function refreshUsedToken(refreshToken) {
		$http({
			url: '/getNewToken',
			method: 'GET',
			params: {
				grant_type: 'refresh_token',
				redirect_uri: twitchalerts.redirectUri,
				refresh_token: refreshToken
			}
		}).then(function success(response) {
			$scope.transaction.token = response.data;
			console.log('New token generated: ' + $scope.transaction.token.access_token);
		});
	}
}]);



