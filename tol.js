var redis=require("redis"),
	/*		client = redis.createClient("redis://vycb777@gmail.com:1qaz2wsx@pub-redis-11548.us-east-1-3.2.ec2.garantiadata.com:11548"),
	 client = redis.createClient("redis://rediscloud:jVuF0mshqeDmSSxc@pub-redis-13088.us-east-1-4.6.ec2.redislabs.com:13088",{parser:"hiredis"}),*/
	client=redis.createClient("redis://localhost", {parser: "hiredis"})
	;
client.select(1);
exports.childs=function(sq, callback){
	if(!sq)sq="Life on Earth:1"

	var script=`
    local res
		redis.call('select',1)
		res = redis.call('KEYS','*')
		local hash_data = {}

		for idx = 1, #res, 1 do
			local hash = redis.call('HGETALL', res[idx])
			for i = 1, #hash, 2 do
				if hash[i] == 'parent' and hash[i+1] == ARGV[1] then
					table.insert(hash_data, res[idx])
					break
				end
			end
		end


		local out = {}
		local count
		local y

		for j,v in ipairs(hash_data) do
				count = 0
			for x = 1, #res, 1 do
				local hash = redis.call('HGETALL', res[x])
				for i = 1, #hash, 2 do
					if hash[i] == 'parent' and hash[i+1] == v then
						count = count +1
						break
					end
				end
			end

			out[j] = {['v'] = v, ['c'] = count}

		end
    cjson.encode_sparse_array(true)
    return cjson.encode(out)
`;
	client.eval(script, [0, sq], function(err, res){
		if(err)
			console.error(err)
		callback(err, {r: JSON.parse(res), sq: sq})
	})
}
exports.paging=function(q, callback){
	if(!q.sq)q.sq = "*"
	if(!q.count)q.count = 100

	client.send_command("scan",[~~q.scan, "MATCH", q.sq, "COUNT", q.count], function(err, result){
		if(err)console.error(err);

		callback(err, {r: result[1], scan:~~result[0], sq: q.sq})
	})
}
exports.search=function(sq, callback){
	if(!sq)return callback("empty", {});

	client.keys(sq, callback);
}
exports.getParentById=function(sq, callback){
	if(!sq)return callback("empty", {})

	client.hgetall(sq, callback);
};
