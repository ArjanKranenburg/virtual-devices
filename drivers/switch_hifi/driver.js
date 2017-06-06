"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_hifi_on',
			},
			off: {
				name: 'virtual_hifi_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_hifi',
			}
		},
		actions: {
			on: {
				name: 'virtual_hifi_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_hifi_action_off',
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
