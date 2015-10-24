/* global exports */

/**
 * Created by vach on 9/10/2015.
 */
//var mysql = require('mysql'),
		pool={},sql = " \
CREATE TABLE `image` ( \
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT, \
  `name` varchar(130) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL, \
  `mimetype` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL, \
  `data` blob, \
  PRIMARY KEY (`id`) \
) ENGINE=MyISAM";

/*pool = mysql.createPool({
	host: 'mysql2.000webhost.com',
	timeout: 20000,
	user: 'a1078855_t',
	database: 'a1078855_t',
	password: '1q2w3e'
}//"mysql://b92008d82e840b:8f909908@us-cdbr-iron-east-03.cleardb.net/heroku_868ef3a051687a3?reconnect=true");
*/
exports.findAll = function(callback)
{
	pool.getConnection(function(err, con)
	{
		if(err){
			console.error('error connecting: ' + err.stack);
			return;
		}
		con.query('SELECT id,name,mimetype FROM image', function(err, result){
			if(err){
				console.error('error connecting: ' + err.stack);
				return;
			}
			con.release();

			callback(err, result);
		});
	});
};

exports.findById = function(id, callback)
{
	pool.getConnection(function(err, con){
		con.query('SELECT id,name,mimetype FROM image WHERE id=?', [id], function(err, result){
			if(err){
				console.error('error connecting: ' + err.stack);
				return;
			}
			con.release();

			callback(err, result[0]);
		});
	});
};

/**
 * remove an articles from collection
 * @param id
 * @param callback
 */
exports.removeById = function(id, callback){
	if(!id){return;}

	pool.getConnection(function(err, con){
		con.query('DELETE FROM image WHERE id=?', [id], function(err, result){
			if(err){
				console.error('error connecting: ' + err.stack);
				return;
			}
			con.release();

			callback(err, result[0]);
		});
	});
};

/**
 * get an image from collection
 * @param id
 * @param res
 * @param callback
 */
exports.getimg = function(id, res, callback){
	if(!id){
		return callback('image: no id');
	}
	pool.getConnection(function(err, con){
		con.query('SELECT data,mimetype FROM image WHERE id=?', [id], function(err, result){
			if(err){
				console.error('error connecting: ' + err.stack);
				return;
			}
			con.release();

			res.writeHead(200,{"Content-Type": result[0].mimetype});

			res.write(result[0].data);
			res.end();
			callback(err, result[0]);
		});
	});
};

exports.saveFile = function(form)
{
	form.on('file', function(fieldname, file, filename, encoding, mimetype)
	{
		if(!filename){
			return file.resume();
		}

		var data=[];
		file.on('data', function(chunk){
			data.push(chunk);
			console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
		});

		file.on('end',function()
		{
			pool.getConnection(function(err, con){
				con.query('INSERT INTO image SET ?',{name: filename, mimetype: mimetype, data: Buffer.concat(data)},
				function(err, result){
					if(err){
						console.error('error connecting: ' + err.stack);
						return;
					}
					con.release();

					form.apinput.id = result.insertId;
					form.apinput.name = filename;
					form.apinput.mimetype = mimetype;
				});
			});
			console.log('File [' + fieldname + '] Finished');
		});
//			file.pipe(con.query('UPDATE image SET data=?').stream());
	});
};

exports.saveArticle = function(input, callback)
{
	client.query('INSERT INTO image VALUES($1::oid,$2::text,$3::text)', [input.id, input.name, input.mimetype], callback);
};
