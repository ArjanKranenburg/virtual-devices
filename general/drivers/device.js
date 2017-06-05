"use strict";

// a list of devices, with their 'id' as key
// it is generally advisable to keep a list of
// paired and active devices in your driver's memory.
var devices = {};

const loggerConfig = {
		level: 4,
		captureLevel: 5,
	};

module.exports = class Device {
	constructor(driverConfig) {
		if (!driverConfig) {
			throw new Error('No deviceconfig found in constructor. Make sure you pass config to super call!');
		}

		this.config = driverConfig;
//		this.logger = new Logger( loggerConfig );

//	    console.log("Creating Device");
//		console.log("Drivers: " + JSON.stringify( Homey.manager('drivers').getDriver('virtual_switch') ));
	}
	
	init(connectedDevices, callback) {
//	    console.log("Init try driver");
		console.log("Connected Devices: " + JSON.stringify( connectedDevices ));

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

	//renamed( device_data, new_name ) {
	    // run when the user has renamed the device in Homey.
	    // It is recommended to synchronize a device's name, so the user is not confused
	    // when it uses another remote to control that device (e.g. the manufacturer's app).
	//}

	static setFlowCondition(config) {
	    console.log("Setting Flow condition: " + config.name);
	    Homey.manager('flow').on('condition.' + config.name, function( callback, args ){
	        var modeDevice = Device.getDevice( args.device.id );
	        if( modeDevice instanceof Error ) return callback( modeDevice );
	
	        callback( null, modeDevice.state.onoff ); 
	    });
	}

	static setFlowAction(config) {
	    console.log("Setting Flow action: " + config.name);
		Homey.manager('flow').on('action.' + config.name, function( callback, args ){
		    console.log('action.' + config.name);
		
			var virtualButton = Device.getDevice( args.id );
		    if( virtualButton instanceof Error ) return callback( virtualButton );
		
		    var tokens = {"type": "device"};
		
		    Homey.manager('flow').triggerDevice(config.name, tokens, true, args, function (err, result) {
		   		if (err) return console.error(err);
			});
		    module.exports.realtime( args, config.type, true);
		    
		    callback( null, true );
		});
	}

	//a helper method to get a party from the devices list by it's id
	static getDevice( device_id ) {
	    var device = devices[ device_id ];
	    if( typeof device === 'undefined' ) {
	        return new Error("Could not find Virtual Device " + device_id);
	    } else {
	        return device;
	    }
	}

	static guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
}

//a helper method to add a party to the devices list
function initDevice( device_data ) {
	console.log("Device initialized " + device_data.id);
	console.log("Data = " + JSON.stringify(device_data));
    devices[ device_data.id ] = {};
    devices[ device_data.id ].state = { onoff: false };
    devices[ device_data.id ].data = device_data;
}
