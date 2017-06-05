"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_manual_on',
			},
			off: {
				name: 'virtual_manual_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_manual',
			}
		},
		actions: {
			on: {
				name: 'virtual_manual_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_manual_action_off',
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
