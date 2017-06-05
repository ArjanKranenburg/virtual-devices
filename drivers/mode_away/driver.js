"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_away_on',
			},
			off: {
				name: 'virtual_away_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_away',
			}
		},
		actions: {
			on: {
				name: 'virtual_away_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_away_action_off',
				type: 'onoff'
			}
		},
		logger: {
		}
	};
	const Mode = require('../../general/drivers/mode.js');
	const driver = new Mode(config);

	module.exports = Object.assign(
		{},
		driver.getExports(), 
		{ init: (devices, callback) => driver.init(devices, callback) }
	);
