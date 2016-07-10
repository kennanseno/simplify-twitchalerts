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



    /**
	 * TWITCHALERTS FUNCTIONALITY
     */
	$scope.donation = {};
	$scope.authCode = $location.search()['code'];
	$scope.authLink = twitchalerts.url + '/authorize?' +
		              'response_type=code&' +
	 				  'client_id=qx0vm0jgb3xPLjl6FR7AKIM9X5GVtEEx9zaDqpuG&' +
		              'redirect_uri=' + twitchalerts.redirectUri + '&' +
		              'scope=donations.create';

	/**
	 * Wait for Auth code then get access token
	 */
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
					$scope.transaction.token = response.data;
					if(angular.isDefined($scope.transaction.token.access_token)){
						console.log('Twitchalerts token: ' + $scope.transaction.token.access_token);
						$scope.showDonationPanel = true;
					}
				});
			}
	});

	/**
	 * process twitchalerts donation
	 * @param donation
     */
	$scope.donate = function(donation) {
		$http({
			url: '/processDonation',
			method: 'GET',
			params: {
				access_token: $scope.transaction.token.access_token,
				name: donation.name,
				identifier: donation.email,
				amount: donation.amount,
				currency: 'USD',
				message: donation.message
			}
		}).then(function success(response) {
			console.log(response.data);
		});
	}

}]);



