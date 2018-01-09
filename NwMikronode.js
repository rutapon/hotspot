
(function (context, undefined) {
	var MikroNode = require('mikronode-ng');
	var async = require("async");
	var _ = require('underscore');

	var serverIp = 'andamania.duckdns.org';
	//var serverIp = '192.168.1.188';

	function preChan(cb) {
		//console.log('conn');
		var connection = MikroNode.getConnection(serverIp, 'admin', '123456789#a');
		//console.log('affter conn');
		connection.closeOnDone = true;

		connection.connect(function (conn) {
			var chan = conn.openChannel();
			chan.closeOnDone = true;
			//showUser(chan);
			cb(chan, conn);

		});
		// connection.getConnectPromise().then(function (conn) {
		// 	conn.getCommandPromise('/ip/address/print').then(function resolved(values) {
		// 		console.log('Addreses: ' + JSON.stringify(values));
		// 	}, function rejected(reason) {
		// 		console.log('Oops: ' + JSON.stringify(reason));
		// 	});
		// });
	}

	function showInfo(cmd, optionObj, cb) {
		var paraArray = [cmd];
		_.each(optionObj, function (value, key) { //'=name=' + name, '=password=' + pass
			paraArray.push('=' + key + '=' + value);
		})

		preChan(function (chan, conn) {
			chan.write(paraArray, function () {
				//chan.closeOnDone = true;

				chan.on('done', function (data) {
					chan.close();
					conn.close();

					var parsed = MikroNode.parseItems(data);

					if (cb) cb(parsed);

				});
				chan.once('trap', function (trap, chan) {
					chan.close();
					conn.close();
					console.log('Command failed: ' + trap);
					//if (cb) cb(null);
				});
				chan.once('error', function (err, chan) {
					chan.close();
					conn.close();
					console.log('Oops: ' + err);
					//if (cb) cb(null);
				});

			});
		});
	}


	function showHotspot(func, cb) {
		preChan(function (chan, conn) {
			chan.write('/ip/hotspot/' + func + '/print', function () {
				//chan.closeOnDone = true;

				chan.on('done', function (data) {
					chan.close();
					conn.close();

					var parsed = MikroNode.parseItems(data);

					//var result = [];

					// parsed.forEach(function (item) {
					// 	//console.log(item);
					// 	result.push(item)
					// });
					//console.log('showHotspot', func, 'length:', parsed.length);
					console.log(parsed);
					if (cb) cb(parsed);

				});
				chan.once('trap', function (trap, chan) {
					chan.close();
					conn.close();
					console.log('Command failed: ' + trap);
					//if (cb) cb(null);
				});
				chan.once('error', function (err, chan) {
					chan.close();
					conn.close();
					console.log('Oops: ' + err);
					//if (cb) cb(null);
				});

			});
		});
	}

	function removeHotspot(func, id, cb) {
		console.log('removeHotspot', func, id);
		// channel1.write('/ip/hotspot/user/remove', { '.id=': name }
		preChan(function (chan, conn) {
			chan.write(['/ip/hotspot/' + func + '/remove', '=.id=' + id,], function (c) {
				c.on('trap', function (data) {
					chan.close();
					conn.close();

					console.log('Error setting ' + func + ': ' + data);
					if (cb) cb(false, data)
				});
				c.on('done', function (data) {
					chan.close();
					conn.close();

					if (cb) cb(id)
				});

			});
		});
	}

	function addHostspot(func, optionObj, cb) {

		var paraArray = ['/ip/hotspot/' + func + '/add'];
		_.each(optionObj, function (value, key) { //'=name=' + name, '=password=' + pass
			paraArray.push('=' + key + '=' + value);
		})
		preChan(function (chan, conn) {
			chan.write(paraArray, function (c) {
				c.on('trap', function (data) {
					chan.close();
					conn.close();

					if (cb) cb(false, data)
					//console.log('Error setting IP: ' + data);
				});
				c.on('done', function (data) {
					chan.close();
					conn.close();
					if (cb) cb(true, data)
					//console.log('IP Set.', data);
				});
			});
		});
	}

	function findHotspotId(func, name, cb) {
		//console.log('findHotspotId', func, name);
		showHotspot(func, function (result) {
			if (result) {
				var findResult = false;
				for (var key in result) {
					if (result.hasOwnProperty(key)) {
						var element = result[key];
						//console.log(element);
						if (func == 'user') {
							if (element.name == name) {
								//console.log('find name: ', name);
								findResult = true;
								if (cb) cb(key, element);
								break;
							}
						} else {
							if (element.user == name) {
								//console.log('find name: ', name);
								findResult = true;
								if (cb) cb(key, element);
								break;
							}
						}
					}
				}
				if (!findResult) {
					console.log('Cannot find ' + func + ' name.');
					if (cb) cb(false, 'Cannot find name.');
				}
			} else {

			}
		})
	}

	function removeHotspotByName(func, name, cb) {
		console.log('removeHotspotByName', func, name);
		findHotspotId(func, name, function (id) {
			if (id) {
				removeHotspot(func, id, cb)
			} else {
				if (cb) cb(false, 'Cannot find ' + func + ' name.');
			}
		})
	}

	function removeUser(chan, id, cb) {
		// channel1.write('/ip/hotspot/user/remove', { '.id=': name }
		chan.write(['/ip/hotspot/user/remove', '=.id=' + id,], function (c) {
			c.on('trap', function (data) {
				//console.log('Error setting IP: ' + data);
				if (cb) cb(false, data)
			});
			c.on('done', function (data) {
				//console.log('remove', data);
				if (cb) cb(true, data)
			});

		});
	}

	function findUserId(chan, name, cb) {
		showUser(chan, function (result) {
			//console.log(result);
			if (result) {
				for (var key in result) {
					if (result.hasOwnProperty(key)) {
						var element = result[key];
						if (element.name == name) {
							if (cb) cb(key, element);
							return;
						}
					}
				}
				if (cb) cb(false, 'Cannot find name.');
			}
		})
	}
	function removeUserName(chan, name, cb) {
		findUserId(chan, name, function (id) {
			if (id) {
				removeUser(chan, id, cb);
			} else {
				if (cb) cb(false, 'Cannot find name.');
			}
		})
	}

	function showUser(chan, cb) {
		chan.write('/ip/hotspot/user/print', function () {
			chan.closeOnDone = true;

			chan.on('done', function (data) {
				console.log('data', data);
				var parsed = MikroNode.parseItems(data);
				console.log(parsed);
				//var result = [];

				// parsed.forEach(function (item) {
				// 	//console.log(item);
				// 	result.push(item)
				// });

				if (cb) cb(parsed);
			});
			chan.once('trap', function (trap, chan) {
				console.log('Command failed: ' + trap);
				//if (cb) cb(null);
			});
			chan.once('error', function (err, chan) {
				console.log('Oops: ' + err);
				//if (cb) cb(null);
			});

		});

	}
	function addUser(chan, name, pass, cb) {

		chan.write(['/ip/hotspot/user/add', '=name=' + name, '=password=' + pass], function (c) {
			c.on('trap', function (data) {
				if (cb) cb(false, data)
				//console.log('Error setting IP: ' + data);
			});
			c.on('done', function (data) {
				if (cb) cb(true, data)
				//console.log('IP Set.', data);
			});
			if (cb) cb();
		});
	}


	var NwMikronode = {
		addUser: function (name, pass, cb) {
			//profile:'staff'
			addHostspot('user', { 'name': name, "password": pass }, cb);
		},
		addUserStaff: function (name, pass, cb) {

			addHostspot('user', { 'name': name, "password": pass, profile: 'staff' }, cb);
		},
		showUser: function (cb) {
			showHotspot('user', cb);
		},
		showActive: function (cb) {
			showHotspot('active', cb);
		},
		removeUser: function (name, cb) {

			console.log('start removeUser async.series', name);

			async.series([
				function (callback) {
					removeHotspotByName('user', name, function (id, msg) {
						callback(null, id)
					})
				},
				function (callback) {
					removeHotspotByName('cookie', name, function (id, msg) {
						callback(null, id)
					})
				},
				function (callback) {
					removeHotspotByName('active', name, function (id, msg) {
						callback(null, id)
					})
				}

			], function (err, results) {
				if (cb) cb(err, results);
			});

		},
		kickUser: function (name, cb) {

			async.series([
				function (callback) {
					removeHotspotByName('cookie', name, function (id, msg) {
						callback(null, id)
					})

				},
				function (callback) {
					removeHotspotByName('active', name, function (id, msg) {
						callback(null, id)
					})
				}

			], function (err, results) {
				if (cb) cb(err, results);
			});

		},
		showInfo: function (cmd, optionObj, cb) {
			showInfo(cmd, optionObj, cb)
		},
		showServerInfo: function (cb) {
			var self = this;
			async.series([
				function (callback) {
					self.showInfo('/ip/dhcp-server/lease/print', {}, function (result) {

						//console.log(result[0]);
						var pickData = ['.id', 'address', 'mac-address',
							'expires-after', 'last-seen', 'host-name']
						result = _.map(result, function (item) {
							return _.pick(item, pickData);
						});

						//console.log('dhcp-server/lease', result.length, JSON.stringify(result).length);
						callback(null, result);
					});
				},
				function (callback) {
					self.showInfo('/ip/arp/print', {}, function (result) {
						//console.log(result[0]);
						var pickData = ['.id', 'address', 'mac-address']
						result = _.map(result, function (item) {
							return _.pick(item, pickData);
						});
						//console.log('arp', result.length, JSON.stringify(result).length);
						callback(null, result);
					});
				}],
				function (err, results) {
					console.log('start process data');

					var resultObj = {};
					var lease = results[0];
					var leaseObj = {};
					var arp = results[1];

					_.each(lease, function (item) {
						var mac = item['mac-address'];
						if (mac) {
							leaseObj[mac] = item;
						}
					})

					_.each(arp, function (item) {
						var mac = item['mac-address'];
						if (mac) {
							resultObj[mac] = { address: item.address };
							if (_.has(leaseObj, mac)) {
								resultObj[mac]['host-name'] = leaseObj[mac]['host-name'];
							}
						}
					});

					if (cb) cb(resultObj);
				});
		},

		showServerInfoAndConn: function (cb) {
			var self = this;

			self.showServerInfo(function (resultObj) {
				self.showInfo('/ip/firewall/connection/print', {}, function (result) {//'terse':'true'
					console.log('connection', result.length);
					var pickData = ['.id', 'src-address', 'dst-address',
						'orig-bytes', 'orig-rate',
						'repl-bytes', 'repl-rate']
					result = _.map(result, function (item) {
						return _.pick(item, pickData);
					});

					var connection = result;
					var connectionObj = {};

					_.each(connection, function (item) {
						var src = item['src-address'];
						if (src) {
							src = src.split(':')[0];
							if (_.has(connectionObj, src)) {
								connectionObj[src].push(item);
							}
							else {
								connectionObj[src] = [item];
							}
						}
					});

					_.each(resultObj, function (item) {
						if (_.has(connectionObj, item.address)) {
							var connInfo = connectionObj[item.address];
							var connInfoReduce = _.reduce(connInfo, function (memo, item) {
								memo['orig-bytes'] += parseInt(item['orig-bytes']);
								memo['orig-rate'] += parseInt(item['orig-rate']);
								memo['repl-bytes'] += parseInt(item['repl-bytes']);
								memo['repl-rate'] += parseInt(item['repl-rate']);
								memo.numConn++;
								return memo;
							},
								{
									'orig-bytes': 0, 'orig-rate': 0,
									'repl-bytes': 0, 'repl-rate': 0,
									numConn: 0
								});

							item.connInfo = connInfoReduce;
						}
					});

					if (cb) cb(resultObj);
				});
			});

		}
	}

	if (typeof module !== "undefined" && module.exports) {
		// NodeJS/CommonJS
		module.exports = NwMikronode;
	} else {

		context.NwMikronode = NwMikronode;
	}

})(this);