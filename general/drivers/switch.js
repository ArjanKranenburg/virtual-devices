"use strict";

const Device = require('./device.js');

// a list of devices, with their 'id' as key
// it is generally advisable to keep a list of
// paired and active devices in your driver's memory.
var devices = {};

module.exports = class Switch extends Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		super(driverConfig);
		this.config = driverConfig;
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
	setOnOff( device_data, onoff, callback ) {
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

//console.log("Check 1");
	    // also emit the new value to realtime
	    // this produces Insights logs and triggers Flows
	    this.updateRealtime( device_data, 'onoff', switchDevice.state.onoff);
	    
	    // send the new onoff value to Homey
	    callback( null, switchDevice.state.onoff );
	}

	setButton( device_data, onoff, callback ) {
	    var buttonDevice = Device.getDevice( device_data.id );
	    if( buttonDevice instanceof Error ) return callback( buttonDevice );
	
	    var tokens = {"type": "device"};
	
	    Homey.manager('flow').triggerDevice(this.config.triggers.button.name, tokens, true, device_data, function (err, result) {
	   		if (err) return console.error(err);
		});
	
	    // also emit the new value to realtime
	    // this produces Insights logs and triggers Flows
	    this.updateRealtime( device_data, 'button', true);
	    
	    callback( null, true );
	}

	updateRealtime(args, device, state) { /* template method */	}

	getExports() {
		return {
			capabilities: {
				onoff: {
					get: this.get.bind(this),
					set: this.setOnOff.bind(this),
				},
				button: {
					set: this.setButton.bind(this),
				}
			},
			init: super.init.bind(this),
			added: super.added.bind(this),
			deleted: super.deleted.bind(this),
//			renamed: this.renamed.bind(this),
//			settings: this.updateSettings.bind(this),
		}
	}
}

