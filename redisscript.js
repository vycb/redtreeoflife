var redis = require("redis"), data = [], scan = 0,
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
 //client.eval(RandomPushScript,1,"mylist",10);
 //client.script("load", RandomPushScript, function(err,result){
 //	console.log([err, result]);
 //});
 //client.scan("H*", function(err, result){
 //	console.log([err,result]);
 //});*/

async.doWhilst(
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
);

/*
 toArray(client.scan({pattenr:"Homo*",count:1000}),function(err, arr){
 if(err){
 console.log(err);
 throw err;
 }

 result.push(arr);

 //	console.log(arr);
 });
 var count = 0;

 async.whilst(
 function(){
 return count < 5;
 },
 function(callback){
 count++;
 setTimeout(callback, 1000);
 },
 function(err){
 // 5 seconds have passed
 console.log(count);
 }
 );*/