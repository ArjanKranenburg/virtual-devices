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

module.exports = class Mode extends Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		super(driverConfig);

		this.config = driverConfig;
//		this.logger = new Logger( loggerConfig );

	    console.log("Creating Try driver");

	    Device.setFlowCondition(driverConfig.conditions.onoff);
	    Device.setFlowAction(driverConfig.actions.on);
	    Device.setFlowAction(driverConfig.actions.off);
	}
	
	// the `pair` method is called when a user start pairing
	pair( other ) {
	    console.log("Pair try driver");
		other.on('list_devices', function( data, callback ){

	        var device_data = {
	            name: "Virtual try",
	            data: {
	                id: Device.guid()
	            }
	        }

	        console.log("Added Virtual try: " + device_data.data.id);
	        callback( null, [device_data] );

	    })
	}

	// this function is called by Homey when it wants to GET the state, e.g. when the user loads the smartphone interface
	// `device_data` is the object as saved during pairing
	// `callback` should return the current value in the format callback( err, value )
	get(device_data, callback) {
		
	    var modeDevice = Device.getDevice( device_data.id );
	    if( modeDevice instanceof Error ) return callback( modeDevice );

	    // send the state value to Homey
	    callback( null, modeDevice.state.onoff );
	}

	// this function is called by Homey when it wants to SET the partyes state, e.g. when the user presses the button on
	// the smartphone
	// `device_data` is the object as saved during pairing
	// `onoff` is the new value
	// `callback` should return the new value in the format callback( err, value )
	set( device_data, onoff, callback ) {
	    var modeDevice = Device.getDevice( device_data.id );
	    if( modeDevice instanceof Error ) return callback( modeDevice );

	    modeDevice.state.onoff = onoff;
	    var state = modeDevice.state;
	    var tokens = {"type": "device"};

	    if (onoff) {
	        console.log( "Turning on  " + modeDevice.data.id + " (" + this.config.actions.on.name + ")");

	        Homey.manager('flow').triggerDevice(this.config.triggers.on.name, tokens, state, device_data, function (err, result) {
	       		if (err) return console.error(err);
	    	});
	    } else {
	        console.log("Turning off " + modeDevice.data.id + " (" + this.config.actions.off.name + ")");
	    	
	        Homey.manager('flow').triggerDevice(this.config.triggers.off.name, tokens, state, device_data, function (err, result) {
	       		if (err) return console.error(err);
	    	});
	    }
	    
	    // send the new onoff value to Homey
	    callback( null, modeDevice.state.onoff );
	}

	getExports() {
//		this.logger.silly('Driver:getExports()');
		console.log('Driver:getExports()');
		return {
			capabilities: {
				onoff: {
					get: this.get.bind(this),
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

