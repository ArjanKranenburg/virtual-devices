"use strict";

const config = {
	triggers: {
		on: {
			name: 'virtual_light_on',
		},
		off: {
			name: 'virtual_light_off',
		}
	},
	conditions: {
		onoff: {
			name: 'virtual_light',
		}
	},
	actions: {
		on: {
			name: 'virtual_light_action_on',
			type: 'onoff'
		},
		off: {
			name: 'virtual_light_action_off',
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

driver.updateRealtime = function(args, device, state) {	
	console.log("setting realtime-state of " + device.id + " to " + state);
    module.exports.realtime( args, device, state);
};


