"use strict";

const Device = require('./device.js');

// a list of devices, with their 'id' as key
// it is generally advisable to keep a list of
// paired and active devices in your driver's memory.
var devices = {};

const loggerConfig = {
		level: 4,
		captureLevel: 5,
	};

module.exports = class Button extends Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		super(driverConfig);

		this.config = driverConfig;
//		this.logger = new Logger( loggerConfig );

	    console.log("Creating button driver");
	}
	
	// the `pair` method is called when a user start pairing
	pair( socket ) {
	    console.log("Pair button driver");
	    socket.on('list_devices', function( data, callback ){

	        var device_data = [
		        {
		            name: "Button",
		            data: {
		                id: Device.guid(),
		            }
		        }
		    ]
	        	        
//	        console.log("Added mode device: " + device_data.data.id);
	    	console.log("Data = " + JSON.stringify(device_data));

	        callback( null, device_data );

	    })
	}

	// this function is called by Homey to notify the user presses the button on the smartphone
	// `device_data` is the object as saved during pairing
	// `onoff` is the new value (ignored for a button)
	// `callback` should return the new value in the format callback( err, value )
	set( device_data, onoff, callback ) {
	    var buttonDevice = Device.getDevice( device_data.id );
	    if( buttonDevice instanceof Error ) return callback( buttonDevice );

	    var tokens = {"type": "device"};

        Homey.manager('flow').triggerDevice(this.config.triggers.name, tokens, true, device_data, function (err, result) {
       		if (err) return console.error(err);
    	});

        // also emit the new value to realtime
	    // this produces Insights logs and triggers Flows
	    this.updateRealtime( device_data, 'button', true);
	    
	    callback( null, true );
	}

	updateRealtime(args, device, state) { /* template method */	}

	getExports() {
//		this.logger.silly('Driver:getExports()');
		console.log('Button:getExports()');
		return {
			capabilities: {
				button: {
					set: this.set.bind(this),
				}
			},
			init: super.init.bind(this),
			added: super.added.bind(this),
			deleted: super.deleted.bind(this),
			pair: this.pair.bind(this),
//			renamed: this.renamed.bind(this),
//			settings: this.updateSettings.bind(this),
		}
	}
}

