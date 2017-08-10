"use strict";

// a list of devices, with their 'id' as key
// it is generally advisable to keep a list of
// paired and active devices in your driver's memory.
var devices = {};

module.exports = class Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		this.config = driverConfig;
	}
	
	init(connectedDevices, callback) {

	    // when the driver starts, Homey rebooted. Initialise all previously paired devices.
	    connectedDevices.forEach(function(connectedDevices){
	    	initDevice( connectedDevices );
	    })

		if (callback) {
			callback();
		}
	}

	//the `added` method is called is when pairing is done and a device has been added
	added(device_data, callback) {
	    console.log("Adding device " + device_data.id);

	    initDevice(device_data);
	    callback(null, true);
	}

	//the `delete` method is called when a device has been deleted by a user
	deleted(device_data, callback) {
	    console.log("Deleting device " + device_data.id);

	    delete devices[device_data.id];
	    callback(null, true);
	}

    // run when the user has renamed the device in Homey.
    // It is recommended to synchronize a device's name, so the user is not confused
    // when it uses another remote to control that device (e.g. the manufacturer's app).
	renamed( device_data, new_name ) {
        var virtualDevice = Device.getDevice( device_data.id );
        if( virtualDevice instanceof Error ) return callback( virtualDevice, null );

        virtualDevice.data.name = new_name;
	}

//	static setFlowTrigger(config) {
//	    Homey.manager('flow').on('trigger.' + config.name, function( callback, args, state ){
//	        var virtualDevice = Device.getDevice( args.device.id );
//	        if( virtualDevice instanceof Error ) return callback( virtualDevice );
//	
//	        callback( null, state ); 
//	    });
//	}

	static setFlowCondition(config) {
	    Homey.manager('flow').on('condition.' + config.name, function( callback, args ){
	        var virtualDevice = Device.getDevice( args.device.id );
	        if( virtualDevice instanceof Error ) return callback( virtualDevice, null );
	
	        callback( null, virtualDevice.state.onoff ); 
	    });
	}

	static setFlowAction(driver, name, setFunction, value) {
		Homey.manager('flow').on('action.' + name, function( callback, args ){

			driver[setFunction](args.device, value, callback);
		});
	}

	static setState( id, capability, value ) {
	    var switchDevice = Device.getDevice( id );
	    if( switchDevice instanceof Error ) return switchDevice;

		if ( typeof switchDevice.state !== 'object' ) {
			switchDevice.state = {}
		}
	    switchDevice.state[capability] = value;

	    Homey.manager('settings').set(`${id}:state`, switchDevice.state);
	    
	    return switchDevice
	}

	//a helper method to get a party from the devices list by it's id
	static getDevice( device_id ) {
	    var device = devices[ device_id ];
	    if( typeof device === 'undefined' ) {
	        return new Error("Could not find Virtual Device " + device_id);
	    }

	    var state = getState( device_id );
	    device.state = state;

	    return device;
	}

	static guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}

function getState( id ) {
	let state = Homey.manager('settings').get(`${id}:state`);
	if ( typeof state !== 'undefined' ) { 
		return state
	}
	return false
}

//a helper method to add a party to the devices list
function initDevice( device_data ) {
//	console.log("Device initialized = " + JSON.stringify(device_data));
    devices[ device_data.id ] = {};
    devices[ device_data.id ].data = device_data;
	devices[ device_data.id ].state = {}
    
    var capabilities = device_data.capabilities;
    if (typeof capabilities === 'undefined' ) {
    	return
    }
    
    capabilities.forEach(function(capabilities){
    	devices[ device_data.id ].state[capabilities] = false
    })

    console.log( "Device initialized " + JSON.stringify(devices[ device_data.id ]) );
}
