var express = require('express');
var router = express.Router();
var request = require('request');
var azure = require('azure-storage');
var dateFormat = require('dateformat');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB
});

connection.connect();

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase =  "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect";

const imagePath =
    'C:/Users/Pipe/Documents/2018-1/SinLimites/Node_Face_Analisys/myapp/public/images/holi.jpg';

const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'emotion'
};


/* GET home page. */
router.post('/', function(req, res) {
	console.log(req.query.token);
	if(req.query.token==process.env.API_TOKEN)
	{
		var filename = req.query.filename;
		var id = req.query.id;
		var date = dateFormat(new Date(req.query.date),'yyyy-mm-dd hh:MM:ss');

		console.log(date);
		//console.log(filename);
		//console.log(req.files);

		if (!req.files)
		return res.status(400).send('No files were uploaded.');

		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		let sampleFile = req.files.foto;
		//console.log(sampleFile.mimetype);  

		// Use the mv() method to place the file somewhere on your server
		sampleFile.mv('files/Photo-'+id+'-'+filename+'.jpg', function(err) {
		if (err)
		  return res.status(500).send(err);

			var blobService = azure.createBlobService();

		  blobService.createBlockBlobFromLocalFile('images', 'Photo-'+id+'-'+filename+'.jpg', 'files/Photo-'+id+'-'+filename+'.jpg', function(error, result, response) {
			  if (!error) {
			  	console.log("FILE UPLOADED TO STORAGE");

			  	var imageUrl = "https://storageaccountcognitivo.blob.core.windows.net/images/Photo-"+id+"-"+filename+".jpg";

			  	const options = {
				    uri: uriBase,
				    qs: params,
				    body: '{"url": ' + '"' + imageUrl + '"}',
				    headers: {
				        'Content-Type': 'application/json',
				        'Ocp-Apim-Subscription-Key' : process.env.FACE_API_SUBSCRIPTION_KEY
				    }
				};

				request.post(options, (error, response, body) => {
				  if (error) {
				    console.log('Error: ', error);
				    return;
				  }
				  let jsonResponse = JSON.parse(body);
				  console.log('JSON Response\n');


				  if(jsonResponse[0]!=null)
				  {
				  	var query_string = 'INSERT INTO image_analysis (person_id, date, anger, contempt, disgust, fear, happiness, neutral, sadness, surprise) VALUES ('+id+',\''+date+'\','+jsonResponse[0].faceAttributes.emotion.anger+','+jsonResponse[0].faceAttributes.emotion.contempt+','+jsonResponse[0].faceAttributes.emotion.disgust+','+jsonResponse[0].faceAttributes.emotion.fear+','+jsonResponse[0].faceAttributes.emotion.happiness+','+jsonResponse[0].faceAttributes.emotion.neutral+','+jsonResponse[0].faceAttributes.emotion.sadness+','+jsonResponse[0].faceAttributes.emotion.surprise+');'
				  	console.log(query_string);
				  	connection.query(query_string, function (error, results, fields) {
						if (error) throw error;
				  		res.status(200).send('ANALYSIS SAVED');
					});

					//connection.end();
				  }else
				  {
				  	var query_string ='INSERT INTO image_analysis (person_id, date, anger, contempt, disgust, fear, happiness, neutral, sadness, surprise) VALUES ('+id+',\''+date+'\',0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0);';
				  	console.log(query_string);
				  	connection.query(query_string, function (error, results, fields) {
						if (error) throw error;
				  		res.status(200).send('ANALYSIS SAVED');
					});

					//connection.end();
				  }


				});
			    
			  }
			  else
			  	console.log(error);
		  });
		});
	}
	else
	{
		res.status(400).send('bad token')
	}
});

module.exports = router;




/*
request.post(options, (error, response, body) => {
  if (error) {
    console.log('Error: ', error);
    return;
  }
  let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
  console.log('JSON Response\n');
  console.log(jsonResponse);
});*/