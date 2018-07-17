const log = require('./components/log');
const config = require('./components/config');

const IO = require('socket.io');
const flatten = require('flatten');
const node_redis = require('redis');
const redisAdapter = require('socket.io-redis');

/**
 * Создает socket.io сервер из http.listen
 * @apram {Http|Http2} server - return от http.listen.
 * @apram {Router} router - пути для апи сервера.
 * @apram {Array} [middlewares] - дополнительные обработчики для app.use. (default: [])
 * @apram {Array} [prefix] - prefix для redis. (default: 'default-socket.io-server')
 * @return {IO}
 * */
module.exports = function({ server, router, middlewares = [], prefix = 'default-socket.io-server' } = {}) {
	const app = new IO(server);

	app.adapter(redisAdapter(
		{
			prefix,
			pubClient: node_redis.createClient(config.redis.url),
			subClient: node_redis.createClient(config.redis.url),
		}
	));

	for (let middleware of flatten(middlewares)) {
		app.use(middleware);
	}

	const Response = require('node-socket.io-router').Response;

	Response.prototype.error = function(err) {
		err = {
			status: err.status || err.statusCode || 500,
			time: Math.ceil(Date.now() / 1000),
			message: err.message || err.error || 'Internal Error',
		};

		this.end(err);
	};

	router.use(require('./modules/error')());
	app.use(router.handle());

	log.info(`Running in ${config.environment} mode.`);
	log.info(`Config is %O`, config);

	return app;
};