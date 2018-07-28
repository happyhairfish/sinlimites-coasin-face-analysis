var video = document.getElementById('video');

console.log("asdasd")


if (navigator.mediaDevices.getUserMedia) {       
    navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    video.srcObject = stream;
  })
  .catch(function(err0r) {
    console.log("Something went wrong!");
  });
}

// Elements for taking the snapshot
var canvas = document.getElementById('canvas');
var user_id;
var password;
var context = canvas.getContext('2d');
var ticker;
var ticker_bool=false;
//var video = document.getElementById('video');
document.getElementById("id_enter").addEventListener("click", function() {
	user_id = document.getElementById("ID").value;
	document.getElementById("id_text").innerHTML = user_id;
});
document.getElementById("password_enter").addEventListener("click", function() {
	password = document.getElementById("password").value;
	document.getElementById("password_text").innerHTML = password;
});
document.getElementById("snap").addEventListener("click", function() {

	if(!ticker_bool)
	{
		ticker = setInterval(takePictureAndSendfromCanvas,2000);
		ticker_bool=true;
	}
});


// Trigger photo take
document.getElementById("snap").addEventListener("click", function() {

	if(!ticker_bool)
	{
		ticker = setInterval(takePictureAndSendfromCanvas,2000);
		ticker_bool=true;
	}
});

document.getElementById("stop").addEventListener("click", function() {
	if(ticker_bool)
	{
		clearInterval(ticker);
		ticker_bool=false;
	}
});
//Add file blob to a form and post
function postFile(file,id) {
    let formdata = new FormData();
    formdata.append("foto", file);
    let xhr = new XMLHttpRequest();

    var d = new Date();

    var filename = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+"_"+d.getMinutes()+"_"+d.getSeconds();
    var date = d.toString();

    xhr.open('POST', 'http://localhost:3000/upload?filename='+filename+'&id='+user_id+'&token='+password+'&date='+date, true);
    xhr.onload = function () {
        if (this.status === 200)
            console.log(this.response);
        else
            console.error(xhr);
    };
    xhr.send(formdata);
}

//Get the image from the canvas
function takePictureAndSendfromCanvas() {
   //Convert the canvas to blob and post the file
   context.drawImage(video, 0, 0, 640, 480);
   canvas.toBlob(postFile, 'image/jpeg');
}
