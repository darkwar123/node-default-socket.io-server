const boom = require('boom');
const helperMethods = ['wrap', 'create'];

module.exports = function() {
	return function (req, res, next) {
		if (res.boom) throw new Error('boom already exists on response object');
		if (res.throw) throw new Error('throw already exists on response object');

		res.boom = {};

		Object.keys(boom).forEach(function (key) {
			if (typeof boom[key] !== 'function') return;

			if (helperMethods.indexOf(key) !== -1) {
				res.boom[key] = function () {
					return boom[key].apply(boom, arguments);
				};
			} else {
				res.boom[key] = function () {
					let boomed = boom[key].apply(boom, arguments);

					let boomedPayloadAndAdditionalResponse = Object.assign(boomed.output.payload, arguments[1])

					return res.status(boomed.output.statusCode).send(boomedPayloadAndAdditionalResponse);
				};
			}
		});

		res.throw = res.boom;

		next();
	};
};
