/* global __dirname, exports, process */

var client, node, pnode = new Node(), ct, pt, ppt;

if(process.argv[2] === "-i") parsexml()

function parsexml(){
	redis = require("redis"),
//		client = redis.createClient("redis://vycb777@gmail.com:1qaz2wsx@pub-redis-11548.us-east-1-3.2.ec2.garantiadata.com:11548"),
//		client = redis.createClient("redis://rediscloud:jVuF0mshqeDmSSxc@pub-redis-13088.us-east-1-4.6.ec2.redislabs.com:13088",{parser:"hiredis"}),
		client = redis.createClient("redis://localhost", {parser: "hiredis"}),
		fs = require('fs'),
		redis = require("redis"),
		fstrm = fs.createReadStream(__dirname + '/tol.xml'),
		sax = require('sax'),
		parser = sax.createStream(true, {trim: true})
		;
	client.select(1);

	String.prototype.nonl = function(){
		return this.replace(/(\r\n|\n|\r)/gm, "")
	}

	String.prototype.keyfmt = function(){
		return this.replace(/[^a-z0-9_\:\-\s]/gmi, "").replace(/\s+/g, " ");
	}

	parser.on("opentag", function(tag){
		ppt = pt;
		pt = ct;
		ct = tag;
		if(tag.name === "NODE"){
			if(pt.name === "NODES"){
				pnode = node;
			}
			node = new Node();
			node.p = pnode;
			node.id = tag.attributes["ID"];
		}
		else if(tag.name === "NODES"){
			save();
		}
	});
	parser.on("cdata", function(tag){
		if(ct.name === "NAME" && pt.name === "NODE"){
			node.name = ("" + tag.nonl().keyfmt());
		}
		else if(ct.name === "DESCRIPTION"){
			node.description = ("" + tag.nonl());
		}
		else if(ct.name === "NAME" && pt.name === "OTHERNAME"){
			node.othername += (node.othername ? ", " : "") + tag.nonl();
		}
	});
	parser.on("closetag", function(tag){
		if([/*"OTHERNAMES","NODES",*/"NODE"].indexOf(tag) > -1){
			save();
		}

		if(tag === "NODES"){
			pnode = pnode.p;
		}
		else if(tag === "NODE"){
			delete node;
		}
	});

	fstrm.pipe(parser)
}

function Node(){
	this.p = {id: 0,p:{id:0}};
	this.id = 0;
	this.name = "";
	this.othername = "";
	this.description = "";
}

function save()
{
	client.hmset
		(orempty(node.name) + ":" + node.id, "id", node.id, "parent", orempty(node.p.name) + ":" + node.p.id, "description", node.description, "othername", node.othername);
}

function orempty(val){
	return (!val ? "n" : val);
}

exports.import = parsexml;