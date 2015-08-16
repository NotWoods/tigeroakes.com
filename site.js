function videoHover() {
	function vidOnHover(e) {this.play()}
	function vidOnOut(e) {this.pause()}
	
	var videos = document.getElementsByTagName("video");
	for (var v = 0; v < videos.length; v++) {
		var vid = videos[v];
		vid.addEventListener("mouseover", vidOnHover);
		vid.addEventListener("mouseout", vidOnOut);
	}
}

if (document.readyState == "interactive" || document.readyState == "complete") {videoHover()} 
else {
	document.addEventListener("readystatechange", function(e) {
		if (document.readyState == "interactive" || document.readyState == "complete") videoHover();
	})
}