var selectContent = function(content){
	var list = content.split("---");
	if(window.location.pathname == '/public/ageratum.html')
		return list[1];
	return list[0];

}

var renderContent = function(content){
	var text = selectContent(content);
	document.getElementById('description').innerHTML = text;
}



var getContent = function(){
	var http = new XMLHttpRequest();
	http.onreadystatechange = function(){
		if(this.readyState == http.DONE && this.status == 200)
			renderContent(this.responseText);
	}

	http.open('GET', '/contentOfFlower');
	http.send();
}

window.onload = getContent;