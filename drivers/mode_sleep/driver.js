"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_sleep_on',
			},
			off: {
				name: 'virtual_sleep_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_sleep',
			}
		},
		actions: {
			on: {
				name: 'virtual_sleep_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_sleep_action_off',
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
