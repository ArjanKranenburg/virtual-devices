"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_alarm_on',
			},
			off: {
				name: 'virtual_alarm_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_alarm',
			}
		},
		actions: {
			on: {
				name: 'virtual_alarm_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_alarm_action_off',
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
