"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_event_on',
			},
			off: {
				name: 'virtual_event_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_event',
			}
		},
		actions: {
			on: {
				name: 'virtual_event_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_event_action_off',
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
