document.addEventListener("DOMContentLoaded", function(){
	ele("searchres").addEventListener("click", function(e){

	})
	var LE = ele("LE")
	LE.addEventListener("click", function(e){
		if(e.target.nodeName === "A" && e.target.classList.contains("ch")){
			get("/tol/childs/" + e.target.innerHTML,
					function(stat, result){
						if(!result)console.error(stat)
						var id = e.target.innerHTML.replace(/\s/g,''),
						p = ele(id)
						if(!p.id){
							p=document.createElement("p")
							p.id=id
						}

						LE.appendChild(p)
						/*if(e.target.classList.contains("frst"))
						else
							LE.insertBefore(p, e.target.parentElement.nextSibling)*/

						p.innerHTML=result
					})
		}else if(e.target.nodeName === "A" && e.target.classList.contains("chrm")){
			e.target.parentElement.parentElement.remove()
		}
	})

	var pg = ele("paging"), pc = ele("pcnt")
	pg.addEventListener("click", function(e){
		if(e.target.nodeName === "A" && e.target.classList.contains("next")){
		get("/tol/s/?scan=" + ~~ele("scan").value+"&count="+~~ele("count").value+"&sq="+ele("sq").value,function(stat, rt){
					if(!re)console.error(stat)
					var p=document.createElement("p"), re =JSON.parse(rt)
					ele("scan").value = pg.dataset.scan = p.id=re.scan
					p.className = "kyc"

					pc.appendChild(p)

					p.innerHTML=re.r
				})
		}
		else if(e.target.nodeName === "A" && e.target.classList.contains("ky")){
			var dtlr = e.target.nextElementSibling, dtls = e.target.nextElementSibling.firstElementChild,x,y, dtlc = e.target.nextElementSibling.firstElementChild.firstElementChild
			if(dtlr.style.display ==="" || dtlr.style.display === "none"){
				if(dtlc.innerHTML !==""){
					dtlr.style.display = "inline"
				}else{
					get("/tol/getParentById/?sq=" + e.target.innerHTML,function(stat, result){
							dtlc.innerHTML = result
							dtlr.style.display = "inline"
							x = e.pageX-dtls.clientWidth/2
							x = x < 0? 0 : x
							x = x+dtls.clientWidth > window.innerWidth? x - dtls.clientWidth/2:x
							y = e.pageY+dtls.clientHeight/3
							y = y < 0? 0 : y
							y = y+dtls.clientHeight > window.innerHeight? y - dtls.clientHeight:y

							dtls.style.left = x+"px"
							dtls.style.top = y+"px"
						})
					}
				}
				else
					dtlr.style.display = "none"
		}
		else if(e.target.nodeName === "A" && e.target.classList.contains("parnt")){
			get("/tol/getParentById/?sq=" + e.target.innerHTML,
				function(stat, re){
					ele(e.target.id + "c").innerHTML = re
				})
		}
		else if(e.target.nodeName === "A" && e.target.classList.contains("cl")){
			e.target.parentNode.parentNode.style.display = "none"
		}
	})

}, false);

function get(url, callback){
	var hr
	if(window.XMLHttpRequest){ // Mozilla, Safari, ...
		hr = new XMLHttpRequest()
	}else if(window.ActiveXObject){ // IE
		try{
			hr = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e){
			try{
				hr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e){
			}
		}
	}

	if(!hr){
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	hr.onreadystatechange = function contents(){
		if(hr.readyState === 4){
			if(hr.status === 200){
				callback(hr.status, hr.responseText);
			}else{
				callback(hr.status, hr.responseText);
			}
		}
	};
	hr.open('GET', url);
	hr.timout = 60000
	hr.send();
}

function ele(id){
	var o = document.getElementById(id);
	return o ? o : {innerHTML: "", style: {display: ""}};
}
function cls(c){
	return document.getElementsByClassName(c)
}

function toggle(el, v){
	 el = el.style? el: ele(el);
	var st= el.style.display === "inline"?"none":"inline";

	if(v===1)st= "inline"; else if(v===0) st= "none";

	el.style.display = st;
	return st === "inline";
}