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
	logger: {
	}
};

const name = {
	mode: {
		en: "Mode",
		nl: "Modus"
	},
	away: {
		en: "Away mode",
		nl: "Weg modus"
	},
	event: {
		en: "Event mode",
		nl: "Evenement modus"
	},
	holiday: {
		en: "Holiday mode",
		nl: "Vakantie modus"
	},
	manual: {
		en: "Manual mode",
		nl: "Handmatige modus"
	},
	movie: {
		en: "Movie mode",
		nl: "Film modus"
	},
	party: {
		en: "Party mode",
		nl: "Feest modus"
	},
	quiet: {
		en: "Quiet mode",
		nl: "Stilte modus"
	},
	relax: {
		en: "Relax mode",
		nl: "Ontspan modus"
	},
	secure: {
		en: "Secure mode",
		nl: "Veilige modus"
	},
	sleep: {
		en: "Sleep mode",
		nl: "Slaap modus"
	},
}

function getDeviceTemplate( device ) {
	var language = Homey.manager( 'i18n' ).getLanguage( );
	return 	        {
        name: name[device][language],
        data: {
            id: Device.guid(),
        },
        "class": "onoff",
        capabilities: [ "onoff" ],
    	icon: "../assets/" + device + ".svg"
    }
}

const Device = require('../../general/drivers/device.js');
const Mode   = require('../../general/drivers/mode.js');
const driver = new Mode(config);

module.exports = Object.assign(
	{},
	driver.getExports(), 
	{ init: (devices, callback) => driver.init(devices, callback) }
);

module.exports.pair = function( other ) {
	other.on('list_devices', function( data, callback ){

		var language = Homey.manager( 'i18n' ).getLanguage( );
		
        var device_data = [
	        getDeviceTemplate('mode'),
	        getDeviceTemplate('away'),
	        getDeviceTemplate('event'),
	        getDeviceTemplate('holiday'),
	        getDeviceTemplate('manual'),
	        getDeviceTemplate('movie'),
	        getDeviceTemplate('party'),
	        getDeviceTemplate('quiet'),
	        getDeviceTemplate('relax'),
	        getDeviceTemplate('secure'),
	        getDeviceTemplate('sleep'),
	    ]

        callback( null, device_data );

    })
};

