"use strict";

const logLevelMap = new Map([['silly', 1], ['debug', 2], ['verbose', 3], ['info', 4], ['warn', 5], ['error', 6]]);
const sentryLevelMap = new Map([[1, 'debug'], [2, 'debug'], [3, 'debug'], [4, 'info'], [5, 'warning'], [6, 'error']]);
const logLevelNameMap = new Map(
	Array.from(logLevelMap.entries()).map(entry => [entry[1], entry[0][0].toUpperCase().concat(entry[0].slice(1))])
);

class Logger {
	constructor(config) {
		if (!config) {
			throw new Error('No config found in constructor. Make sure you pass config to super call!');
		}

		this.logLevel = config.logLevel;
		this.captureLevel = config.captureLevel;

		if (this.config.logLevel) {
			if (!isNaN(this.config.logLevel)) {
				this.logLevel = Number(this.config.logLevel);
			} else if (logLevelMap.has(this.config.logLevel)) {
				this.logLevel = logLevelMap.get(this.config.logLevel);
			}
		}
		if (this.config.captureLevel) {
			if (!isNaN(this.config.captureLevel)) {
				this.captureLevel = Number(this.config.captureLevel);
			} else if (logLevelMap.has(this.config.captureLevel)) {
				this.captureLevel = logLevelMap.get(this.config.captureLevel);
			}
		}
	}
	
	log(level) {
		const args = Array.prototype.slice.call(arguments, logLevelMap.has(level) ? 1 : 0);
		const logLevelId = logLevelMap.get(level) || 4;

		if (this.logLevel <= logLevelId) {
			if (logLevelId === 6) {
				if (args[0] instanceof Error) {
					Homey.error(`[${logLevelNameMap.get(logLevelId)}]`, args[0].message, args[0].stack);
				} else {
					Homey.error.apply(null, [`[${logLevelNameMap.get(logLevelId)}]`].concat(args));
				}
			} else {
				Homey.log.apply(null, [`[${logLevelNameMap.get(logLevelId)}]`].concat(args));
			}
		}
		if (this.captureLevel <= logLevelId) {
			if (logLevelId === 6 && args[0] instanceof Error) {
				this.logger.captureException(
					args[0],
					Object.assign({ level: sentryLevelMap.get(logLevelId) }, typeof args[1] === 'object' ? args[1] : null)
				);
			} else {
				this.logger.captureMessage(Array.prototype.join.call(args, ' '), { level: sentryLevelMap.get(logLevelId) });
			}
		}
	}

	silly() {
		if (this.captureLevel <= 1 || this.logLevel <= 1) {
			this.logger.log.bind(null, 'silly').apply(null, arguments);
		}
	}
	
	debug() {
		if (this.captureLevel <= 2 || this.logLevel <= 2) {
			this.logger.log.bind(null, 'debug').apply(null, arguments);
		}
	}
	
	verbose() {
		if (this.captureLevel <= 3 || this.logLevel <= 3) {
			this.logger.log.bind(null, 'verbose').apply(null, arguments);
		}
	}
	
	info() {
		if (this.captureLevel <= 4 || this.logLevel <= 4) {
			this.logger.log.bind(null, 'info').apply(null, arguments);
		}
	}
	
	warn() {
		if (this.captureLevel <= 5 || this.logLevel <= 5) {
			this.logger.log.bind(null, 'warn').apply(null, arguments);
		}
	}
	
	error() {
		if (this.captureLevel <= 6 || this.logLevel <= 6) {
			this.logger.log.bind(null, 'error').apply(null, arguments);
		}
	}
}

module.exports = Logger;
