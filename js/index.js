Function.prototype.bind = Function.prototype.bind || function(fixThis) {

	var func = this;

	return function() {

		return func.apply(fixThis, arguments)

	}
}

$(document).ready(function() {

	$.support.cors=true;	
	$.mobile.allowCrossDomainPages = true;
	document.body.addEventListener('touchmove', function(event) { event.preventDefault(); }, false);
	
	$(document).bind('deviceready', function() {

		navigator.geolocation.getCurrentPosition(geoOnSuccess, geoOnError);
			
	}); 
	
});

function Wall(latitude, longitude) {

	this.menuUp = false;
	this.fadeIn = true;
	this.mode = "walk";
	this.background = new Image();
	this.background.onload = this.backgroundPictureLoaded.bind(this);
	this.strokeLock = false;
	this.latitude = latitude;
	this.longitude = longitude;
	this.isDrawing = false;
	
	this.con = document.getElementById('con');
	this.canvas = document.getElementById('wallcanvas');
	this.context = this.canvas.getContext('2d');
	this.context.globalCompositeOperation = "none";
	
	this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
	this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
	this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
	
	this.menu = document.getElementById('menu');
	document.addEventListener("menubutton", this.doMenu.bind(this), false);
	
	$(window).on( "orientationchange", this.onOrientationChange.bind(this));
	
	this.startSession();	
	this.getBackground().bind(this);
}

Wall.prototype.onOrientationChange = function(event) {

	var top = window.innerHeight - 65;	
	$(this.menu).css("top", top.toString());
}

Wall.prototype.doMenu = function() {

	if(this.menuUp)
	{
		this.menuUp = false;
		
		$(this.menu).empty();
		$(this.menu).hide();
		
	} else {
	
		this.menuUp = true;
		
		$.get
		(
			"menu.html",
			this.setMenu.bind(this)
		);	
	}	
}

Wall.prototype.setMenu = function(data, textStatus, jqXHR) {

	var top = window.innerHeight - 65;	
	$(this.menu).css("top", top.toString());
	
	$(this.menu).html(data);
	
	$("#setPicture").on("tap", this.setPicture.bind(this));	
	$("#walk").on("tap", this.setWalk.bind(this));
	$("#write").on("tap", this.setWrite.bind(this));
	$("#setLineColor").on("change", this.setLineColor.bind(this));
	$("#setLineWidth").on("change", this.setLineWidth.bind(this));
	
	$(this.menu).show();
}

Wall.prototype.setLineColor = function() {

	this.context.strokeStyle = $("#setLineColor").val();
	
	/*
	var color = $("#setLineColor").val();
	
	var r = parseInt(color.substring(1, 3), 16);
	var g = parseInt(color.substring(3, 5), 16);
	var b = parseInt(color.substring(5), 16);
	
	var rgba = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + ",0.1)";
	
	this.context.globalCompositeOperation="destination-over";
	this.context.strokeStyle = rgba;	
	*/
	
	this.menuUp = false;
		
	$(this.menu).empty();
	$(this.menu).hide();
}

Wall.prototype.setLineWidth = function() {

	this.context.lineWidth = $("#setLineWidth").val()
	
	this.menuUp = false;
		
	$(this.menu).empty();
	$(this.menu).hide();
}

Wall.prototype.switchMode = function() {

	if(this.mode == "walk") {
	
		this.mode = "write";
	
	} else {
	
		this.mode = "walk";
	}
	
	alert(this.mode);
}

Wall.prototype.setWalk = function() {

	this.mode = "walk";
	
	this.menuUp = false;
		
	$(this.menu).empty();
	$(this.menu).hide();
}

Wall.prototype.setWrite = function() {

	this.mode = "write";
	
	this.menuUp = false;
		
	$(this.menu).empty();
	$(this.menu).hide();
}

Wall.prototype.setPicture = function() {

	this.menuUp = false;
		
	$(this.menu).empty();
	$(this.menu).hide();
		
	$(this.con).hide();
	navigator.camera.getPicture(this.getPictureonSuccess.bind(this), onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL});
} 

Wall.prototype.getPictureonSuccess = function(imageData) {
	
	var img = "data:image/jpeg;base64," + imageData;
	this.background.src = img;
	
	var d = {};
	d["dummy"] = "dummy";
	
	$.post
	(
		"http://wallapp.goloca.org/setp.php",
		d,
		function(data, textStatus, jqXHR)
		{
			//alert(data);
		}
	);
	
	if(this.latitude >= 0) {

		var latDir = "latp" + this.latitude.toString();
	
	} else {

		var latDir = "latn" + (this.latitude * -1).toString();
	}

	if(this.longitude >= 0) {

		var longFile = "longp" + this.longitude.toString();
	
	} else {

		var longFile = "longn" + (this.longitude * -1).toString();
	}
	
	var f = "wallapp/data/" + latDir + "/" + longFile;
	
	var fw = new MyFileWriter();
	fw.write(f, img);
	
	setTimeout(this.setFadeIn.bind(this), 2000);
}

Wall.prototype.setFadeIn = function() {

	this.fadeIn=true;
}

Wall.prototype.backgroundPictureLoaded = function() {

	this.context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
}

Wall.prototype.draw = function(data, textStatus, jqXHR) {

	var dataArray = data.split("\n");
	var dataArrayLength = dataArray.length - 1;
	
	for (var i=0; i < dataArrayLength; i+=6) { 
	
		this.stroke(dataArray[i], dataArray[i+1], dataArray[i+2], dataArray[i+3], dataArray[i+4], dataArray[i+5]);
	}
	
	if(this.fadeIn) {

		$(this.con).show();
		this.fadeIn = false;
	}
}

Wall.prototype.startSession = function() {

	var d = {};
	d["latitude"] = this.latitude;
	d["longitude"] = this.longitude;
	
	$.post
	(
		"http://wallapp.goloca.org/set.php",
		d,
		function(data, textStatus, jqXHR)
		{
			//alert(data);
		}
	);
}

Wall.prototype.getBackground = function() {
	
	if(this.latitude >= 0) {

		var latDir = "latp" + this.latitude.toString();
	
	} else {

		var latDir = "latn" + (this.latitude * -1).toString();
	}

	if(this.longitude >= 0) {

		var longFile = "longp" + this.longitude.toString();
	
	} else {

		var longFile = "longn" + (this.longitude * -1).toString();
	}
	
	var f = "wallapp/data/" + latDir + "/" + longFile;
	
	var fr = new MyFileReader();
	fr.read(f, this.setBackground.bind(this));
}

Wall.prototype.setBackground = function(data) {

	this.background.src = data;
	this.updateInterval = setInterval(this.updateSession.bind(this), 1000);	
}

Wall.prototype.setSession = function() {
		
	var d = {};
	d["line"] = this.line;
	
	$.post
	(
		"http://wallapp.goloca.org/set.php",
		d,
		function(data, textStatus, jqXHR)
		{
			//alert(data);
		}
	);
}

Wall.prototype.updateSession = function() {
	
	var d = {};
	d["dummy"] = true;
	
	$.post
	(
		"http://wallapp.goloca.org/get.php",
		d,
		this.draw.bind(this)
	);
}

Wall.prototype.toString = function () {

	var s="";
	
	s += "latitude: " + this.latitude + "\n";
	s += "longitude: " + this.longitude;
	
	return s; 
};

Wall.prototype.onTouchStart = function(event) {
	
	if(this.mode == "write") {
	
		this.left = parseFloat($(this.con).css("left").replace("px", ""));
		this.top  = parseFloat($(this.con).css("top").replace("px", ""));
		
		this.line = "";
		
		this.fromPosX = event.targetTouches[0].pageX - this.left;
		this.fromPosY = event.targetTouches[0].pageY - this.top; 
	
	} else {
	
		this.fromPosX = event.targetTouches[0].pageX;
		this.fromPosY = event.targetTouches[0].pageY; 
	}
	
	this.isDrawing = true;

}

Wall.prototype.stroke = function(strokeStyle, lineWidth, fromPosX, fromPosY, toPosX, toPosY) {

	while(this.strokeLock) {}
	this.strokeLock = true;
	
	//this.context.globalAlpha = 0.4;
	var prevStrokeStyle = this.context.strokeStyle;
	var prevlineWidth = this.context.lineWidth;
	
	this.context.strokeStyle = strokeStyle;
	this.context.lineWidth = lineWidth;
	
	this.context.beginPath();
	this.context.moveTo(fromPosX, fromPosY);
	this.context.lineTo(toPosX, toPosY);
	this.context.stroke();
	
	this.context.strokeStyle = prevStrokeStyle;
	this.context.lineWidth = prevlineWidth;
	//this.context.globalAlpha = 1.0;
	
	this.strokeLock = false;
}

Wall.prototype.move = function(fromPosX, fromPosY, toPosX, toPosY) {

	var left = parseFloat($(this.con).css("left").replace("px", ""));
	left += toPosX - fromPosX;
	
	if(left > 0) { left = 0; }
	if(left < window.innerWidth - 2400) { left = window.innerWidth - 2400; }
	
	$(this.con).css("left", left.toString());
	
	var top = parseFloat($(this.con).css("top").replace("px", ""));
	top += toPosY - fromPosY;
	
	if(top > 0) { top = 0; }
	if(top < window.innerHeight - 1400) { top = window.innerHeight - 1400; }
	
	$(this.con).css("top", top.toString());
}

Wall.prototype.onTouchMove = function(event) {

	if (this.isDrawing) {
		
		if(this.mode == "write") {
		
			this.toPosX = event.targetTouches[0].pageX - this.left;
			this.toPosY = event.targetTouches[0].pageY - this.top;
			
			this.line += this.context.strokeStyle + "\n";
			this.line += this.context.lineWidth + "\n";
			this.line += this.fromPosX.toString() + "\n";
			this.line += this.fromPosY.toString() + "\n";
			this.line += this.toPosX.toString() + "\n";
			this.line += this.toPosY.toString() + "\n";
			
			this.stroke(this.context.strokeStyle, this.context.lineWidth, this.fromPosX, this.fromPosY, this.toPosX, this.toPosY);
			
		} else {
		
			this.toPosX = event.targetTouches[0].pageX;
			this.toPosY = event.targetTouches[0].pageY;
			
			this.move(this.fromPosX, this.fromPosY, this.toPosX, this.toPosY);			
		}
		
		this.fromPosX = this.toPosX;
		this.fromPosY = this.toPosY;
	}
}

Wall.prototype.onTouchEnd = function(event) {

	this.isDrawing = false;
	
	if(this.mode == "write") {
	
		this.setSession();
		
	}
}

function truncCoord(coord) {

	return (coord * 1000) | 0;
}

var geoOnSuccess = function(position) {

	//alert("Geo");
	
	w = new Wall
	(
		truncCoord(position.coords.latitude),
		truncCoord(position.coords.longitude)
	);
};

function geoOnError(error) {

    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function onSuccess(imageData) {
	alert("Got Image");
    var img = new Image();
    image.src = "data:image/jpeg;base64," + imageData;
	this.context.drawImage(img,0,0);
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function fail() {
        alert("Failed");
}