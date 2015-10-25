var redis = require("redis"),
/*		client = redis.createClient("redis://vycb777@gmail.com:1qaz2wsx@pub-redis-11548.us-east-1-3.2.ec2.garantiadata.com:11548"),
		client = redis.createClient("redis://rediscloud:jVuF0mshqeDmSSxc@pub-redis-13088.us-east-1-4.6.ec2.redislabs.com:13088",{parser:"hiredis"}),*/
		client = redis.createClient("redis://localhost",{parser:"hiredis"})
		;
client.select(1);
exports.childs = function(sq,callback){
	if(!sq || !sq.length){
		sq = "Life on Earth:1";
	}
	script = "\
    local res \n\
		redis.call('select',1) \n\
		res = redis.call('KEYS','*') \n\
		local hash_data = {}	\n\
\
		for idx = 1, #res, 1 do \n\
			local hash = redis.call('HGETALL', res[idx]) \n\
			for i = 1, #hash, 2 do \n\
				if hash[i] == 'parent' and hash[i+1] == ARGV[1] then \n\
					table.insert(hash_data, res[idx])  \n\
					break		\n\
				end \n\
			end \n\
		end \n\
\
\
		local out = {}		\n\
		local count		\n\
		local y		\n\
\
		for j,v in ipairs(hash_data) do		\n\
				count = 0		\n\
			for x = 1, #res, 1 do		\n\
				local hash = redis.call('HGETALL', res[x]) \n\
				for i = 1, #hash, 2 do		\n\
					if hash[i] == 'parent' and hash[i+1] == v then \n\
						count = count +1	\n\
						break \n\
					end		\n\
				end			\n\
			end		 \n\
\
\
			out[j] = {['v'] = v, ['c'] = count}	\n\
\
		end			\
    cjson.encode_sparse_array(true) \n\
    return cjson.encode(out) \n\
";
	client.eval(script, [0,sq], function(err, res){
		if(err)console.error(err)
		callback(err, JSON.parse(res))
	})
}
exports.search = function(sq,callback){
	if(!sq || !sq.length){
		return callback("empty", {});
	}
	client.keys(sq, callback);
}
exports.getParentById = function(sq,callback){
	if(!sq || !sq.length){
		return callback("empty", {});
	}
	client.hgetall(sq, callback);
};