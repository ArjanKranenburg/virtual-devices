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
      name: Homey.__('pair.default.name.device'),
      settings: {},
      data: {
        id: guid(),
        version: 3
      },
      capabilities: [],
      capabilitiesOptions: {
        target_temperature: {
          max: 50
        }    
      }
    };
        // measure_temperature: {
        //   min: 0,
        //   max: 100,
        //   setable: true
        // },

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, "ok" );
    });

    socket.on('setClass', function( data, callback ) {
        console.log('setClass: ' + data);
        pairingDevice.class = data.class;
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
          getIconNameAndLocation('solarpanel'),
	        getIconNameAndLocation('light'),
          getIconNameAndLocation('button'),
          getIconNameAndLocation('alarm'),
          getIconNameAndLocation('lock'),
          getIconNameAndLocation('door'),
          getIconNameAndLocation('window_open'),
          getIconNameAndLocation('motion'),
	        getIconNameAndLocation('blinds'),
          getIconNameAndLocation('curtains'),
          getIconNameAndLocation('garage'),
	        getIconNameAndLocation('tv'),
	        getIconNameAndLocation('hifi'),
          getIconNameAndLocation('sensor'),
          getIconNameAndLocation('thermostat'),
          getIconNameAndLocation('radiator'),
          getIconNameAndLocation('fan'),
          getIconNameAndLocation('electricity'),
          getIconNameAndLocation('water'),
          getIconNameAndLocation('sensor2'),
          getIconNameAndLocation('coffee_maker'),
          getIconNameAndLocation('kettle'),
	    ]

        callback( null, device_data );
    });

    socket.on('setIcon', function( data, callback ) {
        console.log('setIcon: ' + data);
        pairingDevice.data.icon = data.icon.location;
        pairingDevice.icon = data.icon.location
        if ( Homey.version == undefined ) {
          pairingDevice.icon = DRIVER_LOCATION + "assets/" + data.icon.location
        }
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
          this.log('args: ' + simpleStringify(args) );
          let device = validateItem('device', args.device);
          let sensor = validateItem('sensor', args.sensor);
          let value  = validateItem('value',  args.value );

          this.log(device.getName() + ' -> Sensor: ' + sensor);

          var valueToSet;
          if( isNaN(value) ) {
            if ( value.toLowerCase() === 'true' ) {
              valueToSet = true;
            } else if ( value.toLowerCase() === 'false' ) {
              valueToSet = false;
            } else {
              valueToSet = value;
            }
          } else {
            valueToSet = parseFloat(value, 10);
          }

          this.log(device.getName() + ' -> Value:  ' + valueToSet);
          device.setCapabilityValue(sensor, valueToSet) // Fire and forget
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
		"location": name + ".svg"
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
