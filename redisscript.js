/* global process */

var redis = require("redis", {parser: "hiredis"}), data = [], scan = 0,
	/*		client = redis.createClient("redis://vycb777@gmail.com:1qaz2wsx@pub-redis-11548.us-east-1-3.2.ec2.garantiadata.com:11548"),
	 //		client = redis.createClient("redis://rediscloud:jVuF0mshqeDmSSxc@pub-redis-13088.us-east-1-4.6.ec2.redislabs.com:13088",{parser:"hiredis"}),*/
//require("redis-scanstreams")(redis);
	client = redis.createClient("redis://localhost", {parser: "hiredis"}),
	async = require('async'),
//		toArray = require('stream-to-array'),
	RandomPushScript = " \
    local i = tonumber(ARGV[1]) \
    local res \
    while (i > 0) do \
        res = redis.call('lpush',KEYS[1],math.random()) \
        i = i-1 \
    end \
    return res \
";//6a7636a2d574fff37e20500dd0f694f577ddd609

client.select(1);
/*client.del("mylist");
 // client.eval(RandomPushScript,1,"mylist",10);
 client.script("load", RandomPushScript, function(err,result){
 console.log([err, result]);
 });*/

(function populateDbSet(cb){
	this.db = client
	script = " \
    local res \
		res = redis.call('select',0) \
		res = redis.call('KEYS','*') \
		redis.call('select',2) \
		redis.call('DEL', 'dbkeys') \
		for idx = 1, #res, 1 do \
			redis.call('SADD', 'dbkeys', res[idx]) \
		end\
    return 1 \
";//
	this.db.eval(script, 0, function(err, res){
		console.log([err, res]);
		process.exit(0)
	})
	/*		client.script("load", script, function(err, result){
	 console.log([err, result]);
	 client.evalsha(result, 0, function(err, res){
	 console.log([err, res]);


	 })
	 });*/
})()

/*async.doWhilst(
 function(callback){
 client.send_command("scan", [scan, "MATCH", "Homo*", "COUNT", 10000], function(err, result)
 {
 if(err){
 console.log(err);
 }

 scan = +result[0];

 data = data.concat(result[1]);

 setTimeout(callback, 1000);

 });
 },
 function(){
 console.log(scan);
 return scan > 0;
 },
 function(err){
 if(err){
 console.log(err);
 }
 console.log(data);
 }
 );*/
