/* global __dirname, listen */

var http=require('http'),
	estatic=require('ecstatic'),
	pathRegexp=require('path-to-regexp'),
	Busboy=require('busboy'),
	image={}//require("./image"),
	tol=require("./tol"),
	vh=require("./views/"),
	xmlp=require("./xmlparser/"),
	url=require("url"),
	serve=estatic({root: __dirname+'/public', serverHeader: false,
		showDir: true, autoIndex: false, baseDir: "/public"}),
	urlParam=function(templ, url){
		var regexp=pathRegexp(templ, []);
		return regexp.exec(url);
	}, query={sq: ""};

http.Server(function(req, res, next){
	if(req.url.indexOf("/public")>-1){
		serve(req, res, next);
	}else if(req.url==="/form"){
		res.write(vh.form({result: {}}));

		res.end();
	}else if(req.url.indexOf("/tol/getParentById/")>-1){
		query=url.parse(req.url, true).query;

		tol.getParentById(query.sq, function(err, result){
			if(err)console.error(err)
			res.write(vh.parent({result: result||{}}));
			res.end();
		})
	}else if(req.url.indexOf("/tol/childs/")>-1){
		query = decodeURI(urlParam("/tol/childs/:sq",req.url)[1])
		tol.childs(query,function(err, result){
			if(err)console.error(err)
			res.write(vh.childs({result: {r: result, sq: query}}))
			res.end()
		})
	}else if(req.url.indexOf("/tol/s/")>-1){
		query=url.parse(req.url, true).query
		tol.search(query.sq, function(err, result){
			if(err)console.error(err)
			res.write(vh.form({result: {r: result, sq: query.sq, ch: 0}}));
			res.end();
		})
	}else if(req.url==="/importxml"){
		res.write(vh.form({result: {}}))
		res.end()
		xmlp.import()
	}
	else //index
	{
		res.writeHead(200, {'content-type': 'text/html'});

		function index(){

			tol.childs(query.sq, function(err, result){
				if(err)
					console.error(err)
				res.write(vh.form({result: {r: result, sq: query.sq, ch: 1}}))
				res.end()
			})
		}
		index()
	}
}).listen(8000);
