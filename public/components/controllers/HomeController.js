'use strict';

angular.module('mostPopularListingsApp.home', ['ngRoute', 'ngCookies'])

// Routing configuration for this module
.config(['$routeProvider',function($routeprovider){
	$routeprovider.when('/', {
		controller: 'HomeController',
		templateUrl: 'components/views/homeView.html'
	});
}])

// Controller definition for this module
.controller('HomeController', ['$scope', '$location', '$http', '$window', '$cookies', function($scope, $location, $http, $window, $cookies) {

	var secret_token = $cookies.get('secret_token');
	var twitchalerts = {
		url: 'https://www.twitchalerts.com/api/v1.0',
		redirectUri: 'http://twitchify.xyz'
	};
	$scope.test = "TEST";
	$scope.donation = {
		name: 'Mike',
		amount: 19,
		email: 'simplify@test.com',
		message: 'I love your stream! Keep being awesome! #simplifyrocks'
	};
	$scope.transaction = {
		number: '5555555555554444',
		cvc: '123',
		expMonth: '12',
		expYear: '20'
	};
	$scope.authCode = $location.search()['code'];
	$scope.authLink = twitchalerts.url + '/authorize?' +
		'response_type=code&' +
		'client_id=yN6soTt3oyZCmqAyz5ulogTkUcvsDkQUJi875ht8&' +
		'redirect_uri=' + twitchalerts.redirectUri + '&' +
		'scope=donations.create';

	/**
	 * Initialize App
	 */
	function init() {
		if(angular.isDefined(secret_token)){
			refreshUsedToken(secret_token);
		}
		if((!angular.isDefined($scope.authCode) && !angular.isDefined(secret_token))) {
			console.log($scope.authCode);
			$window.location.href = $scope.authLink;
		}
	}

	init();

	/**
	 * TWITCHALERTS FUNCTIONALITY
	 *
	 * Process twitchalerts donation
	 * @param donation
	 */

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

			//Create token so as to remove auth process on the donation process
			var date = new Date();
			var exp = new Date(date.getFullYear(), date.getMonth()+6, date.getDate());
			//$cookies.put('secret_token', , {expires: exp} );
			document.cookie = "secret_token=" + $scope.transaction.token.refresh_token ;
		});
	}

	/**
	 * Function to process Simplify Transaction
	 * @param transaction
	 */
	$scope.processSimplifyTransaction= function(transaction, donation_data) {
		$scope.saving = true;

		$http({
			url: '/processTransaction',
			method: 'GET',
			params: {
				amount: parseInt(donation_data.amount) * 100,
				description : "Twitch Donation",
				number: transaction.number,
				expMonth: transaction.expMonth,
				expYear: transaction.expYear,
				cvc: transaction.cvc,
				currency: 'USD'
			}
		}).then(function success(response) {
			$scope.saving = false;
			
			console.log('Payment status: ' + response.data);
			if(response.data == 'APPROVED'){
				processDonation(donation_data, $scope.transaction.token);
			}

			$('#success').fadeIn();

		});
	};
}]);



