/* global __dirname */
/*jslint white: true, node: true */

var http=require('http'),
	compression = require('compression'),
	estatic=require('ecstatic'),
	pathRegexp=require('path-to-regexp'),
	Busboy=require('busboy'),
	tol=require("./tol"),
	vh=require("./views/"),
	xmlp=require("./xmlparser/"),
	url=require("url"),
	serve=estatic({root: __dirname+'/public', serverHeader: false,
		showDir: true, autoIndex: false, baseDir: "/public"}),
	urlParam=function(templ, url){
		var regexp=pathRegexp(templ, []);
		return regexp.exec(url);
	}, q={sq: ""},

server = http.createServer(function(req, res){
	var _compression = compression({treshold:500,level:-1});
	_compression(req, res, function(err){
		if(err){
			res.statusCode = err.status || 500;
			res.end(err.message);
			return;
		}
		res.setHeader('Content-Type', 'text/hltm')
		hendlers(req, res)
	})
})
server.listen(8000)
function hendlers(req, res, next){
	if(req.url.indexOf("/public")>-1){
		serve(req, res, next)
	}else if(req.url==="/form"){
		res.write(vh.form({result: {}}))

		res.end()
	}else if(req.url.indexOf("/tol/getParentById/")>-1){
		q=url.parse(req.url, true).query

		tol.getParentById(q.sq, function(err, result){
			if(err)console.error(err)
			res.write(vh.parent({result: result||{}}))
			res.end()
		})
	}else if(req.url.indexOf("/tol/childs/")>-1){
		q = decodeURI(urlParam("/tol/childs/:sq",req.url)[1])
		tol.childs(q,function(err, re){
			if(err)console.error(err)
			res.write(vh.childs({result: {r: re.r, sq: re.sq}}))
			res.end()
		})
	}else if(req.url.indexOf("/tol/s/")>-1){
		q=url.parse(req.url, true).query
		tol.paging({sq:q.sq,scan:q.scan,count:q.count},function(err, re){
			if(err)console.error(err)
			res.write(JSON.stringify({r:vh.key({result:{r: re.r}}),scan:re.scan}))
			res.end()
		})
	}else if(req.url==="/importxml"){
		res.write(vh.form({result: {}}))
		res.end()
		xmlp.import()
	}
	else //index
	{
		res.writeHead(200, {'content-type': 'text/html'})

		function index(){

			tol.childs(q.sq, function(err, re){
				if(err)
					console.error(err)
				res.write(vh.form({result: {r: re.r, sq: re.sq, ch: 1}}))
				res.end()
			})
		}
		index()
	}
}
