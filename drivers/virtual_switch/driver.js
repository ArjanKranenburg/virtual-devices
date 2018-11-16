'use strict';

const Homey = require('homey');
const DRIVER_LOCATION = "/app/com.arjankranenburg.virtual/drivers/virtual_switch/";

class VirtualDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Virtual Devices');

    this.registerFlowCardAction_sensor('set_sensor_value', false);
	}

  onPair( socket ) {
    let pairingDevice = {
      "settings": {},
      "data": {
        id: guid(),
        version: 3
      },
      capabilities: []
    };

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, "ok" );
    });

    socket.on('setClass', function( data, callback ) {
        console.log('setClass: ' + data);
        pairingDevice.class = data.class;
        pairingDevice.name = Homey.__( 'class.' + data.class);
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );
    });

    socket.on('setName', function( data, callback ) {
        console.log('setName: ' + data);
        pairingDevice.name = data.name;
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );
    });

    socket.on('getPairingDevice', function( data, callback ) {
        callback( null, pairingDevice );
    });

    socket.on('addCapabilities', function( data, callback ) {
        console.log('addCapabilities: ' + data);
        pairingDevice.capabilities = data.capabilities;
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );
    });

    socket.on('getIcons', function( data, callback ) {
        var device_data = [
	        getIconNameAndLocation('switch'),
	        getIconNameAndLocation('light'),
	        getIconNameAndLocation('blinds'),
          getIconNameAndLocation('curtains'),
	        getIconNameAndLocation('tv'),
	        getIconNameAndLocation('hifi'),
	        getIconNameAndLocation('alarm'),
          getIconNameAndLocation('radiator'),
          getIconNameAndLocation('thermostat'),
          getIconNameAndLocation('sensor'),
          getIconNameAndLocation('button'),
          getIconNameAndLocation('lock'),
	    ]

        callback( null, device_data );
    });

    socket.on('addIcon', function( data, callback ) {
        console.log('addIcon: ' + data);
        pairingDevice.data.icon = data.icon.location;
        pairingDevice.icon = DRIVER_LOCATION + "assets/" + data.icon.location
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );
    });

    socket.on('disconnect', function(){
        console.log("User aborted pairing, or pairing is finished");
    })
  }

  registerFlowCardAction_sensor(card_name) {
    let flowCardAction = new Homey.FlowCardAction(card_name);
    flowCardAction
      .register()
      .registerRunListener(( args, state ) => {
        try {
          let device = validateItem('device', args.device);
          let sensor = validateItem('sensor', args.sensor);
          let value  = validateItem('value',  args.value );
//        this.log(device.getName() + ' -> Sensor: ' + sensor);
//        this.log(device.getName() + ' -> Value:  ' + parseFloat(value, 10));

          device.setCapabilityValue(sensor, parseFloat(value, 10)) // Fire and forget
             .catch(this.error);

          return Promise.resolve( true );
        }
        catch(error) {
          this.log('Device triggered with missing information: ' + error.message)
          this.log('args: ' + simpleStringify(args) );
          return Promise.reject(error);
        }
      })
  }
}

module.exports = VirtualDriver;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getIconNameAndLocation( name ) {
	return {
		"name": name,
		"location": "../assets/" + name + ".svg"
	}
};

function validateItem(item, value) {
  if (typeof(value) == 'undefined' || value == null ) {
    throw new ReferenceError( item + ' is null or undefined' );
  }
  return value;
}

function cleanJson (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return simpleObject; // returns cleaned up Object
};

function simpleStringify (object) {
    var simpleObject = cleanJson(object);
    return JSON.stringify(simpleObject);
};
