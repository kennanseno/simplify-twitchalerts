var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var Simplify = require("simplify-commerce");

var TwitchAlerts = {
		client_id: 'yN6soTt3oyZCmqAyz5ulogTkUcvsDkQUJi875ht8',
		client_secret: 'm2dI3MVrDWw3ptaTa5gUBmtDekpqzO7A6ziVqJNd'
	},
	client = Simplify.getClient({
		publicKey: 'sbpb_MmVmOGUyNDgtNThjYy00MTZhLWI4YTMtNTIzMDVkZGE5Mjlh',
		privateKey: 'Tw5A8JfQwsAk8b8KrohVCeBNLEWQR2QO4eq6AudJx295YFFQL0ODSXAOkNtXTToq'
	});

app.use(bodyParser());
app.use(express.static('public'));

app.get('/', function (req, res) {

});

app.get('/processTransaction', function(req, res) {

	var transaction_data = {
		amount : req.query.amount,
		description : req.query.description,
		card : {
			expMonth : req.query.expMonth,
			expYear : req.query.expYear,
			cvc: req.query.cvc,
			number : req.query.number
		},
		currency : req.query.currency
	};

	client.payment.create(transaction_data, function(errData, data){

		if(errData){
			console.error("Error Message: " + errData.data.error.message);

			res.send("Payment Status: " + JSON.stringify(errData));
        // handle the error
        return;
    }

    console.log("Payment Status: " + data.paymentStatus);

    res.send(data.paymentStatus);
	});
});

app.get('/accessToken', function(req, res) {
	var data = {
		grant_type: req.query.grant_type,
		client_id: TwitchAlerts.client_id,
		client_secret: TwitchAlerts.client_secret,
		redirect_uri: req.query.redirect_uri,
		code: req.query.code
	};

	var options = {
		method: 'POST',
		url: 'https://www.twitchalerts.com/api/v1.0/token',
		headers:
		{ 	'content-type': 'application/x-www-form-urlencoded',
			'cache-control': 'no-cache' },
		form: data
	};

	request(options, function (error, response, body) {
		if (error){
			res.send(error);
			throw new Error(error);
		}
		res.send(body);
	});
});

app.get('/processDonation',function(req, res) {
	var data = {
		access_token: req.query.access_token,
		name: req.query.name,
		identifier: req.query.identifier,
		amount: req.query.amount,
		currency: req.query.currency,
		message: req.query.message
	};

	var options = {
		method: 'POST',
		url: 'https://www.twitchalerts.com/api/v1.0/donations',
		headers:
		{ 	'content-type': 'application/x-www-form-urlencoded',
			'cache-control': 'no-cache' },
		form: data
	};

	request(options, function (error, response, body) {
		if (error){
			res.send(error);
			throw new Error(error);
		}
		res.send(body);
	});
});

app.get('/getNewToken', function(req, res) {
	var data = {
		grant_type: req.query.grant_type,
		client_id: TwitchAlerts.client_id,
		client_secret: TwitchAlerts.client_secret,
		redirect_uri: req.query.redirect_uri,
		refresh_token: req.query.refresh_token
	};

	var options = {
		method: 'POST',
		url: 'https://www.twitchalerts.com/api/v1.0/token',
		headers:
		{ 	'content-type': 'application/x-www-form-urlencoded',
			'cache-control': 'no-cache' },
		form: data
	};

	request(options, function (error, response, body) {
		if (error){
			res.send(error);
			throw new Error(error);
		}
		res.send(body);
	});
});

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});

