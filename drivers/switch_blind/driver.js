"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_blind_on',
			},
			off: {
				name: 'virtual_blind_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_blind',
			}
		},
		actions: {
			on: {
				name: 'virtual_blind_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_blind_action_off',
				type: 'onoff'
			}
		},
		logger: {
		}
	};
	const Switch = require('../../general/drivers/switch.js');
	const driver = new Switch(config);

	module.exports = Object.assign(
		{},
		driver.getExports(), 
		{ init: (devices, callback) => driver.init(devices, callback) }
	);
