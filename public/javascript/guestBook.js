var evalDateTime  = function(gmtDate){
	return gmtDate.substr(0, gmtDate.length-15);
};

var createDiv = function(identity, value){
	var new_div = document.createElement('div');
	new_div.className = identity;
	new_div.innerHTML = value;
	return new_div;
}

var createCommentDiv = function(element){
	var main = document.createElement('div');
	main.className = "main";

	main.appendChild(createDiv('dateTime',element.dateTime));
	main.appendChild(createDiv('name',element.name));
	main.appendChild(createDiv('comment',element.comment));

	return main;

}	

var renderRemainingPage = function(element){
	var list = document.getElementById('comment_list');
	list.prepend(createCommentDiv(element));
	return list;
}

var renderCommentList = function(content){
	var list = document.getElementById('comment_list');
	content.forEach(function(element){
		list.appendChild(createCommentDiv(element));
	})
	return list;
};

var submitComment = function(){
	var user = {
		name: document.getElementById('user_name').value,
		comment: document.getElementById('user_comment').value,
		dateTime: evalDateTime(Date())
	};

	var http = new XMLHttpRequest();
	http.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			renderRemainingPage(JSON.parse(this.responseText));
		}
	};

	http.open("POST",'/updated',true);
	http.send(JSON.stringify(user));
}

var getPreviousCommentList = function(){
	var http = new XMLHttpRequest();
	http.onreadystatechange = function(){
		if(this.readyState == http.DONE && this.status == 200)
			renderCommentList(JSON.parse(this.responseText));
	}
	http.open('GET','/previous', true);
	http.send();
}

window.onload = getPreviousCommentList;