var httpRequest;
document.addEventListener("DOMContentLoaded", function()
{
	ele("searchres").addEventListener("click", function(e)
	{
		if(e.target && e.target.nodeName === "A"){
			get("/tol/getParentById/?sq=" + e.target.innerHTML,
					function(stat, result){
						if(!result)console.error(stat)
						ele(e.target.id + "c").innerHTML = result;
					});
		}
	})
	var LE = ele("LE")
	LE.addEventListener("click", function(e)
	{
		if(e.target && e.target.nodeName === "A" && e.target.classList.contains("ch")){
			get("/tol/childs/" + e.target.innerHTML,
					function(stat, result){
						if(!result)console.error(stat)
						var id = e.target.innerHTML.replace(/\s/g,''),
						p = ele(id)
						if(!p.id){
							p=document.createElement("p")
							p.id=id
						}

						if(e.target.classList.contains("frst"))
							LE.appendChild(p)
						else
							LE.insertBefore(p, e.target.parentElement.nextSibling)

						p.innerHTML=result
					})
		}else if(e.target && e.target.nodeName === "A" && e.target.classList.contains("chrm")){
			e.target.parentElement.remove()
		}
	})

}, false);

function get(url, callback){
	if(window.XMLHttpRequest){ // Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest()
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
	httpRequest.timout = 60000
	httpRequest.send();
}

function ele(id){
	var o = document.getElementById(id);
	return o ? o : {innerHTML: "", style: {display: ""}};
}
function cls(c){
	return document.getElementsByClassName(c)
}