'use strict';

const Homey = require('homey');

class MultiDriver extends Homey.Driver {

  onInit() {
		this.log('Initialized driver for Multi-Modes');

    let multiModeTrigger = new Homey.FlowCardTriggerDevice('multi_changed');
    multiModeTrigger.register();

    this.registerFlowCardCondition('multi_mode_is', 'multi_state');

    this.registerFlowCardAction('multi_set_state', 'multi_state', multiModeTrigger);
	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, 'ok' );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log('Adding new device');

        var device_data = [
          getIconNameAndLocation('house'),
          getIconNameAndLocation('away'),
	        getIconNameAndLocation('event'),
	        getIconNameAndLocation('holiday'),
	        getIconNameAndLocation('movie'),
	        getIconNameAndLocation('party'),
	        getIconNameAndLocation('quiet'),
	        getIconNameAndLocation('relax'),
	        getIconNameAndLocation('secure'),
	        getIconNameAndLocation('sleep'),
	    ]

        callback( null, device_data );
    });

    socket.on('disconnect', function(){
        console.log('User aborted pairing, or pairing is finished');
    })
  }

  registerFlowCardCondition(card_name, capability) {
    let flowCardCondition = new Homey.FlowCardCondition(card_name);
    flowCardCondition
      .register()
      .registerRunListener(( args, state ) => {
        try {
          let device = validateItem('device', args.device);

          let stateToCheck = getState( args );
          this.log(device.getName() + ' -> Condition checked: ' + simpleStringify(device.getState()) );

          if (stateToCheck === device.getState()[capability]) {
            return Promise.resolve( true );
          } else {
            return Promise.resolve( false );
          }
        }
        catch(error) {
          this.log('Device condition checked with missing information: ' + error.message)
          return Promise.reject(error);
        }
      })
  }

  registerFlowCardAction(card_name, capability, flow_trigger) {
    let flowCardAction = new Homey.FlowCardAction(card_name);
    flowCardAction
      .register()
      .registerRunListener(( args, state ) => {
        try {
          let device = validateItem('device', args.device);
          let newState = getState( args );
          this.log(device.getName() + ' -> Multi-State set to ' + newState);

          if ( ! device.isStateAllowed(newState) ) {
            var allowedStates = Object.values(device.getData().state_names);
            this.error(newState + ' is not an allowed state. Allowed states are: ', JSON.stringify(allowedStates));
            return Promise.resolve( false );
          }

          if (device.getMultiState() === newState) {
            this.log('Multi-State did not change')
            return Promise.resolve(); // no change, no triggers
          }

          device.setMultiState(newState);

          if (flow_trigger) {
            flow_trigger.trigger( device, {}, newState ) // Fire and forget
              .catch( this.error );
          }

          return Promise.resolve( true );
        }
        catch(error) {
          this.log('Device action called with missing information: ' + error.message)
          return Promise.reject(error);
        }
      })
  }
}

module.exports = MultiDriver;

function getIconNameAndLocation( name ) {
	return {
		'name': name,
		'location': '../assets/' + name + '.svg'
	}
};

function getState( args ) {
  let argums = cleanJson(args);
  let firstKey = Object.keys(argums)[0];
  return argums[firstKey];
}

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
