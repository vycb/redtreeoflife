var dump = require('redis-dump-tool-mod'),
redis = require("redis"),
client = redis.createClient("redis://localhost",{parser:"hiredis"})
//		client:"redis://rediscloud:jVuF0mshqeDmSSxc@pub-redis-13088.us-east-1-4.6.ec2.redislabs.com:13088"*/
;

dump({
	filter: 'Homo*',
	count:	10000,
	numcmd:	10000,
	client:	client,
	db:	1
	},
	function(err, data){
		'use strict';

		if (err) {
			console.log(err);
			return;
		}

		console.log(data);
	}
);
