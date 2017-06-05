"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_relax_on',
			},
			off: {
				name: 'virtual_relax_off',
			}
		},
		conditions: {
			onoff: {
				name: 'virtual_relax',
			}
		},
		actions: {
			on: {
				name: 'virtual_relax_action_on',
				type: 'onoff'
			},
			off: {
				name: 'virtual_relax_action_off',
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
