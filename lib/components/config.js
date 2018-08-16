const assert = require('assert');
const environment = String(process.env.NODE_ENV).trim();

const configs = {
	production: function() {
		return {
			environment: 'production',
			redis: { url: assertEnvVar('REDIS_URL', 'Ссылка на redis redis://user:pass@localhost:port/database') },
		};
	},
	development: function() {
		return {
			environment: 'development',
			redis: { url: optionalEnvVar('REDIS_URL', 'Ссылка на redis redis://user:pass@localhost:port/database', 'redis://localhost:6379') },
		};
	},
};

let config = configs[environment];
assert(config, `socket.io-server: Configuration ${environment} does not exist, NODE_ENV must be one of ${Object.keys(configs)}`);

config = config();

module.exports = config;

function assertEnvVar(envVar, description) {
	let value = process.env[envVar];

	if (typeof value === 'string') {
		value = value.trim()
	}

	assert(value !== null && value !== undefined, `socket.io-server: Environment variable ${envVar} (currently is ${value}) must be present. Description: ${description}`);

	return value;
}

function optionalEnvVar(envVar, description, defaultValue) {
	let value = process.env[envVar];

	if (typeof value === 'string') {
		value = value.trim()
	}

	if (value === null || value === undefined) {
		if (defaultValue === undefined) {
			console.warn(`socket.io-server: Optional environment variable ${envVar} not present. Description: ${description}`);
		} else {
			console.warn(`socket.io-server: Optional environment variable ${envVar} not present. Description: ${description}. Using default value ${defaultValue}`);
		}
	}

	return value || defaultValue;
}
