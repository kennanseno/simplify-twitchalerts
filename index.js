var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var Simplify = require("simplify-commerce"),
	client = Simplify.getClient({
		publicKey: 'sbpb_MmVmOGUyNDgtNThjYy00MTZhLWI4YTMtNTIzMDVkZGE5Mjlh',
		privateKey: 'Tw5A8JfQwsAk8b8KrohVCeBNLEWQR2QO4eq6AudJx295YFFQL0ODSXAOkNtXTToq'
	});

app.use(bodyParser());
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.send('Hello World!');
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

app.get('/getAuthCode', function(request, response) {
	response.send('SUCCESS');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

