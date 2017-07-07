"use strict";

const config = {
	triggers: {
		on: {
			name: 'virtual_switch_on',
		},
		off: {
			name: 'virtual_switch_off',
		},
		button: {
			name: 'button_pushed',
		},
	},
	conditions: {
		onoff: {
			name: 'virtual_switch',
		}
	},
	actions: {
		on: {
			name: 'virtual_switch_action_on',
			type: 'onoff',
		},
		off: {
			name: 'virtual_switch_action_off',
			type: 'onoff',
		}
	},
	logger: {
	}
};

const Device = require('../../general/drivers/device.js');
const Switch   = require('../../general/drivers/switch.js');
const driver = new Switch(config);

module.exports = Object.assign(
	{},
	driver.getExports(), 
	{ init: (devices, callback) => driver.init(devices, callback) }
);

module.exports.pair = function( socket ) {
    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, "ok" );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log("Adding new device");

        var device_data = [
	        getIconNameAndLocation('switch'),
	        getIconNameAndLocation('light'),
	        getIconNameAndLocation('blinds'),
	        getIconNameAndLocation('tv'),
	        getIconNameAndLocation('hifi'),
	        getIconNameAndLocation('alarm'),
	    ]

        callback( null, device_data );
    });

    socket.on('disconnect', function(){
        console.log("User aborted pairing, or pairing is finished");
    })
};

driver.updateRealtime = function(args, device, state) {		
    module.exports.realtime( args, device, state);
};

function getIconNameAndLocation( name ) {
	return {
		"name": name,
		"location": "../assets/" + name + ".svg"
	}
}
