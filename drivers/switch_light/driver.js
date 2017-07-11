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
			state: true
		},
		off: {
			name: 'virtual_light_action_off',
			state: false
		}
	},
};
const Switch = require('../../general/drivers/switch.js');
const driver = new Switch(config);

module.exports = Object.assign(
	{},
	driver.getExports(), 
	{ init: (devices, callback) => driver.init(devices, callback) }
);

driver.updateRealtime = function(device_data, capability, newValue) {	
	console.log("setting realtime-state of " + device_data.id + " to " + newValue);
    module.exports.realtime( device_data, capability, newValue);
};


