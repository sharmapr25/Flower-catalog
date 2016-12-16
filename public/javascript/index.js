var hideForASecond = function(){
	setTimeout(function(){
		document.getElementById('jar').style.visibility = 'visible';
	},1000);
	document.getElementById('jar').style.visibility = 'hidden';
};