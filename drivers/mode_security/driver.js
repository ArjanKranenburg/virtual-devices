"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_security_on',
			},
			off: {
				name: 'virtual_security_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_security',
			}
		},
		actions: {
			on: {
				name: 'virtual_security_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_security_action_off',
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
