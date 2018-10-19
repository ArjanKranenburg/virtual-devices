'use strict';

const Homey = require('homey');

class VirtualDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Virtual Devices');

    this.registerFlowCardAction_sensor('set_sensor_value', false);
	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, "ok" );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log("Adding new device");

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
          getIconNameAndLocation('contact'),
          getIconNameAndLocation('motion'),
	    ]

        callback( null, device_data );
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
