

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
 

// 	client.payment.create({
// 		amount : req.body.amount,
// 		description : "payment description",
// 		token: req.body.simplifyToken
// 	}, function(errData, data){

// 		if(errData){
// 			console.error("Error Message: " + errData.data.error.message);

// 			res.send("Payment Status: " + JSON.stringify(errData));
//         // handle the error
//         return;
//     }


//     console.log("Payment Status: " + data.paymentStatus);

//     res.send("Payment Status: " + data.paymentStatus);
// 	});
// });

//below is what the above block was changed to, removal of the token block



app.get('/processSimplify', function(req, res) {
	var sdata = {
	    amount : req.query.amount,
	    description : req.query.description,
	    card : {
	       expMonth : req.query.expMonth,
	       expYear : req.query.expYear,
	       cvc : req.query.cvc,
	       number : req.query.cardnumber
	    },
	    currency : 'USD'
	}

	var sdata = {
	    amount : "123123",
	    description : "payment description",
	    card : {
	       expMonth : "11",
	       expYear : "19",
	       cvc : "123",
	       number : "5555555555554444"
	    },
	    currency : 'USD'
	}


	console.log(sdata);

	// console.log(req.query.amount);	
	// console.log(req.query.expMonth);
	// console.log(req.query.expYear);
	// console.log(req.query.cvc);
	// console.log(req.query.cardnumber);
	// console.log(req.query.currency);
	// console.log(req.query.description);

client.payment.create(sdata, function(errData, data){
    if(errData){
        console.error("Error Message: " + errData.data.error.message);
        // handle the error
        return;
    }
    console.log("Payment Status: " + data.paymentStatus);
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

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

