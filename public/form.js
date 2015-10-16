var httpRequest;
document.addEventListener("DOMContentLoaded", function()
{
	ele("searchres").addEventListener("click", function(e)
	{
		if(e.target && e.target.nodeName === "A"){
			get("/tol/getParentById/?sq=" + e.target.innerHTML,
					function(stat, result){
						ele(e.target.id + "c").innerHTML = result;
					});
		}
	});

}, false);

function get(url, callback){
	if(window.XMLHttpRequest){ // Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();
	}else if(window.ActiveXObject){ // IE
		try{
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e){
			try{
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e){
			}
		}
	}

	if(!httpRequest){
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.onreadystatechange = function contents(){
		if(httpRequest.readyState === 4){
			if(httpRequest.status === 200){
				callback(httpRequest.status, httpRequest.responseText);
			}else{
				callback(httpRequest.status, httpRequest.responseText);
			}
		}
	};
	httpRequest.open('GET', url);
	httpRequest.send();
}

function ele(id){
	var o = document.getElementById(id);
	return o ? o : {innerHTML: "", style: {display: ""}};
}
function cls(c){
	return document.getElementsByClassName(c)
}