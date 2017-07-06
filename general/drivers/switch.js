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

module.exports = class Switch extends Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		super(driverConfig);

		this.config = driverConfig;
//		this.logger = new Logger( loggerConfig );

	    console.log("Creating switch driver");

	}
	
	init(devices_data, callback) {
		super.init(devices_data, null);
		
	    Device.setFlowTrigger(this.config.triggers.on)
	    Device.setFlowTrigger(this.config.triggers.off)
	    Device.setFlowCondition(this.config.conditions.onoff);

	    var actionOnConfig  = this.config.actions.on
	    actionOnConfig.trigger = this.config.triggers.on.name
	    Device.setFlowAction(actionOnConfig, this.updateRealtime);
	    
	    var actionOffConfig = this.config.actions.off
	    actionOffConfig.trigger = this.config.triggers.off.name
	    Device.setFlowAction(actionOffConfig, this.updateRealtime);		

		if (callback) {
			callback();
		}
	}

	// the `pair` method is called when a user start pairing
	pair( socket ) {
	    console.log("Pair switch driver");
	    socket.on('list_devices', function( data, callback ){

	        var device_data = [
		        {
		            name: "Switch",
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

	// this function is called by Homey when it wants to GET the state, e.g. when the user loads the smartphone interface
	// `device_data` is the object as saved during pairing
	// `callback` should return the current value in the format callback( err, value )
	get(device_data, callback) {
		
	    var switchDevice = Device.getDevice( device_data.id );
	    if( switchDevice instanceof Error ) return callback( switchDevice );

	    // send the state value to Homey
	    callback( null, switchDevice.state.onoff );
	}

	// this function is called by Homey when it wants to SET the partyes state, e.g. when the user presses the button on
	// the smartphone
	// `device_data` is the object as saved during pairing
	// `onoff` is the new value
	// `callback` should return the new value in the format callback( err, value )
	set( device_data, onoff, callback ) {
	    var switchDevice = Device.getDevice( device_data.id );
	    if( switchDevice instanceof Error ) return callback( switchDevice );

	    switchDevice.state.onoff = onoff;
	    var state = switchDevice.state;
	    var tokens = {"type": "device"};

	    if (onoff) {
	        console.log( "Turning on  " + switchDevice.data.id + " (" + this.config.triggers.on.name + ")");

	        Homey.manager('flow').triggerDevice(this.config.triggers.on.name, tokens, state, device_data, function (err, result) {
	       		if (err) return console.error(err);
	    	});
	    } else {
	        console.log("Turning off " + switchDevice.data.id + " (" + this.config.triggers.off.name + ")");
	    	
	        Homey.manager('flow').triggerDevice(this.config.triggers.off.name, tokens, state, device_data, function (err, result) {
	       		if (err) return console.error(err);
	    	});
	    }

console.log("Check 1");
	    // also emit the new value to realtime
	    // this produces Insights logs and triggers Flows
	    this.updateRealtime( device_data, 'onoff', switchDevice.state.onoff);
	    
	    // send the new onoff value to Homey
	    callback( null, switchDevice.state.onoff );
	}
	
	updateRealtime(args, device, state) { /* template method */	}

	getExports() {
//		this.logger.silly('Driver:getExports()');
		console.log('Switch:getExports()');
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

