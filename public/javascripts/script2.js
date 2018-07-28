'use strict';

const request = require('request');
var fs = require('fs');
var jpeg = require('jpeg-js');


// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = "d3052460685d4367a9a0387b8efebd89";

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase =  "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect";

const imagePath =
    'C:/Users/Pipe/Documents/2018-1/SinLimites/Node_Face_Analisys/myapp/public/images/holi.jpg';

// Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
        'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
};

const options = {
    uri: uriBase,
    qs: params,
    body: '{"file": ' + '"' + imagePath + '"}',
    headers: {
        'Content-Type': 'application/octet-stream',
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
};

/*
request.post(options, (error, response, body) => {
	if (error) {
		console.log('Error: ', error);
		return;
	}

	console.log(base64_encode(imagePath));

	const options = {
	    uri: uriBase,
	    qs: params,
	    body: '{"data": ' + '"' + makeBlob(base64_encode(imagePath)) + '"}',
	    headers: {
	        'Content-Type': 'application/octet-stream',
	        'Ocp-Apim-Subscription-Key' : subscriptionKey
	    }
	};

	let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
	console.log('JSON Response/n');
	console.log(jsonResponse);
});*/

var dataURItoBuffer = function (dataURL, callback) {
    var buff = new Buffer(dataURL.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
    callback(buff);
};

var sendImageToMicrosoftDetectEndPoint = function (imageData, callback) {
    console.log('Entered helper');
    dataURItoBuffer(imageData, function (buff) {
        request.post({
            url: keyConfig.microsoftDetectURL,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': keyConfig.microsoftApiKey
            },
            data: buff
        }, function (err, httpResponse, body) {
            console.log(body);
        });
    })
}