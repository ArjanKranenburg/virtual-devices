'use strict';

const config = {
	triggers: {
		on: {
			name: 'mode_on',
		},
		off: {
			name: 'mode_off',
		}
	},
	conditions: {
		onoff: {
			name: 'mode',
		}
	},
	actions: {
		on: {
			name: 'mode_action_on',
			type: 'onoff'
		},
		off: {
			name: 'mode_action_off',
			type: 'onoff'
		}
	},
};

const Device = require('../../general/drivers/device.js');
const Mode   = require('../../general/drivers/mode.js');
const driver = new Mode(config);

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
	        getIconNameAndLocation('mode'),
	        getIconNameAndLocation('away'),
	        getIconNameAndLocation('event'),
	        getIconNameAndLocation('holiday'),
	        getIconNameAndLocation('manual'),
	        getIconNameAndLocation('movie'),
	        getIconNameAndLocation('party'),
	        getIconNameAndLocation('quiet'),
	        getIconNameAndLocation('relax'),
	        getIconNameAndLocation('secure'),
	        getIconNameAndLocation('sleep'),
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
