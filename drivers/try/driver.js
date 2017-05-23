'use strict';


const config = {
	capabilities: ['onoff'],
	id: 'virtual_try',
	class: 'other',
	name: 'devices.virtual.try',
	triggers: {
		on: {
			name: 'virtual_try_on',
		},
		off: {
			name: 'virtual_try_off',
		}
	},
	conditions: {
		onoff: {
			name: 'virtual_try',
		}
	},
	actions: {
		on: {
			name: 'virtual_try_action_on',
			type: 'onoff'
		},
		off: {
			name: 'virtual_try_action_off',
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

