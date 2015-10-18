var client, node, pnode = new Node(), ct, pt, ppt, cct;

exports.import = function()
{
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
			node.name = tag;
		}
		else if(ct.name === "DESCRIPTION"){
			node.description = tag;
		}
		else if(ct.name === "NAME" && pt.name === "OTHERNAME"){
			node.othername += (node.othername ? ", " : "") + tag;
		}
	});
	parser.on("closetag", function(tag)
	{
		cct = tag;
		if([/*"OTHERNAMES","NODES",*/"NODE"].indexOf(tag) > -1){
			save();
		}

		if(cct === "NODES"){
			pnode = node.p.p;
		}
		else if(cct === "NODE"){
			delete node;
		}
	});

	fstrm.pipe(parser)
};

function Node(){
	this.p = {id: 0};
	this.id = 0;
	this.name = "";
	this.othername = "";
	this.description = "";
}

function save()
{
	client.hmset
	(orempty(node.name)+":"+node.id, "id", node.id, "parent",orempty(node.p.name)+":"+node.p.id, "description", node.description, "othername", node.othername);
	console.log(node.name);
}

function orempty(val){
	return (!val ? "n" : val);
}