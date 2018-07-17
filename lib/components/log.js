const debug = require('debug')('socket.io-server:debug');
const info = require('debug')('socket.io-server:info');
const error = require('debug')('socket.io-server:error');

module.exports = { debug, info, error };