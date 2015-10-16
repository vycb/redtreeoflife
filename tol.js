var redis = require("redis"),
//		client = redis.createClient("redis://vycb777@gmail.com:1qaz2wsx@pub-redis-11548.us-east-1-3.2.ec2.garantiadata.com:11548"),
//		client = redis.createClient("redis://rediscloud:jVuF0mshqeDmSSxc@pub-redis-13088.us-east-1-4.6.ec2.redislabs.com:13088",{parser:"hiredis"}),
		client = redis.createClient("redis://localhost",{parser:"hiredis"})
		;
client.select(1);
exports.search = function(sq,callback){
	if(!sq || !sq.length){
		return callback("empty", {});
	}
	client.keys(sq, callback);
};
exports.getParentById = function(sq,callback){
	if(!sq || !sq.length){
		return callback("empty", {});
	}
	client.hgetall(sq, callback);
};