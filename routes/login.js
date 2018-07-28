var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB
});

connection.connect();

router.post('/create', function(req, res, next) {
	if(req.body.token==process.env.API_TOKEN)
	{
		if (req.body.email && req.body.username && req.body.password) {

				  	bcrypt.genSalt(10, function(err, salt) {
					    bcrypt.hash(req.body.password, salt, function(err, hash) {
					        // Store hash in your password DB.
					        connection.query('INSERT INTO user (ID, username, password, email) VALUES (3,\''+req.body.username+'\',\''+hash+'\',\''+req.body.email+'\');', function (error, results, fields) {
							  if (error) throw error;
				  				res.status(200).send('USER CREATED');
							});

							connection.end();
					    });
					});
		}else{res.status(400).send('missing or error in params')}
	}
	else
	{
		res.status(400).send('bad token')
	}
		

});

module.exports = router;