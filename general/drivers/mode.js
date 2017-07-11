"use strict";

const Device = require('./device.js');

// a list of devices, with their 'id' as key
// it is generally advisable to keep a list of
// paired and active devices in your driver's memory.
var devices = {};

module.exports = class Mode extends Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		super(driverConfig);
		this.config = driverConfig;

	    Device.setFlowCondition(driverConfig.conditions.onoff);

//	    var actionOnConfig  = driverConfig.actions.on
//	    actionOnConfig.trigger = driverConfig.triggers.on.name
	    Device.setFlowAction(this, driverConfig.actions.on.name, 'set', true);
	    
//	    var actionOffConfig = driverConfig.actions.off
//	    actionOffConfig.trigger = driverConfig.triggers.off.name
	    Device.setFlowAction(this, driverConfig.actions.off.name, 'set', false);
	}
	
	// the `pair` method is called when a user start pairing
	pair( socket ) {
	    console.log("Pair mode driver");
	    socket.on('list_devices', function( data, callback ){

	        var device_data = [
		        {
		            name: "Mode device",
		            data: {
		                id: Device.guid(),
		            }
		        }
		    ]
	        	        
	    	console.log("Data = " + JSON.stringify(device_data));

	        callback( null, device_data );
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
	        console.log( "Turning on  " + modeDevice.data.id + " (" + this.config.triggers.on.name + ")");

	        Homey.manager('flow').triggerDevice(this.config.triggers.on.name, tokens, state, device_data, function (err, result) {
	       		if (err) return console.error(err);
	    	});
	    } else {
	        console.log("Turning off " + modeDevice.data.id + " (" + this.config.triggers.off.name + ")");
	    	
	        Homey.manager('flow').triggerDevice(this.config.triggers.off.name, tokens, state, device_data, function (err, result) {
	       		if (err) return console.error(err);
	    	});
	    }

	    // also emit the new value to realtime
	    // this produces Insights logs and triggers Flows
	    this.updateRealtime( device_data, 'onoff', onoff);
	    
	    // send the new onoff value to Homey
	    callback( null, onoff );
	}

	updateRealtime(args, device, state) { /* template method */	}

	getExports() {
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

