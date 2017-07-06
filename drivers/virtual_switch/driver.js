"use strict";

const config = {
		triggers: {
			on: {
				name: 'virtual_switch_on',
			},
			off: {
				name: 'virtual_switch_off',
			}
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

	const name = {
		switch: {
			en: "Switch",
			nl: "Schakelaar"
		},
		light: {
			en: "Light",
			nl: "Licht"
		},
		blinds: {
			en: "Blinds",
			nl: "Blindering"
		},
		tv: {
			en: "TV",
			nl: "TV"
		},
		hifi: {
			en: "Hi-Fi",
			nl: "Hi-Fi"
		},
		alarm: {
			en: "Alarm",
			nl: "Alarm"
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
	const Switch   = require('../../general/drivers/switch.js');
	const driver = new Switch(config);

	module.exports = Object.assign(
		{},
		driver.getExports(), 
		{ init: (devices, callback) => driver.init(devices, callback) }
	);

	module.exports.pair = function( other ) {
		other.on('list_devices', function( data, callback ){

			var language = Homey.manager( 'i18n' ).getLanguage( );
			
	        var device_data = [
		        getDeviceTemplate('switch'),
		        getDeviceTemplate('light'),
		        getDeviceTemplate('blinds'),
		        getDeviceTemplate('tv'),
		        getDeviceTemplate('hifi'),
		        getDeviceTemplate('alarm'),
		    ]

	        callback( null, device_data );

	    })
	};

	driver.updateRealtime = function(args, device, state) {		
	    module.exports.realtime( args, device, state);
	};
