var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var Simplify = require("simplify-commerce");

var TwitchAlerts = {
		client_id: 'qx0vm0jgb3xPLjl6FR7AKIM9X5GVtEEx9zaDqpuG',
		client_secret: 'elgU6YVKa3HiXoMvlh7wYCjGZ3i6r3yFjKmyXNu1'
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
	

	client.payment.create({
		amount : req.body.amount,
		description : "payment description",
		token: req.body.simplifyToken
	}, function(errData, data){

		if(errData){
			console.error("Error Message: " + errData.data.error.message);

			res.send("Payment Status: " + JSON.stringify(errData));
        // handle the error
        return;
    }

    console.log("Payment Status: " + data.paymentStatus);

    res.send("Payment Status: " + data.paymentStatus);
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
		form:
		{ grant_type: data.grant_type,
			client_id: data.client_id,
			client_secret: data.client_secret,
			redirect_uri: data.redirect_uri,
			code: data.code
		}
	};

	request(options, function (error, response, body) {
		if (error){
			res.send(error);
			throw new Error(error);
		}
		res.send(body);
	});
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

