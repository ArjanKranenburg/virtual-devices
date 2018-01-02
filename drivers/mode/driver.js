'use strict';

const Homey = require('homey');

class ModeDriver extends Homey.Driver {

  onInit() {
		this.log('Initialized driver for Modes');

    let triggerDeviceOn  = new Homey.FlowCardTriggerDevice('mode_on');
    triggerDeviceOn.register();
    let triggerDeviceOff = new Homey.FlowCardTriggerDevice('mode_off');
    triggerDeviceOff.register();

    this.registerFlowCardCondition('mode');

    this.registerFlowCardAction('mode_action_on', true, triggerDeviceOn);
    this.registerFlowCardAction('mode_action_off', false, triggerDeviceOff);
    this.registerFlowCardAction('mode_state_on', true);
    this.registerFlowCardAction('mode_state_off', false);
	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, 'ok' );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log('Adding new device');

        var device_data = [
					getIconNameAndLocation('mode'),
          getIconNameAndLocation('house'),
	        getIconNameAndLocation('away'),
	        getIconNameAndLocation('event'),
	        getIconNameAndLocation('holiday'),
	        getIconNameAndLocation('manual'),
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

  registerFlowCardCondition(card_name) {
    let flowCardCondition = new Homey.FlowCardCondition(card_name);
    flowCardCondition
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        if (typeof(device) == 'undefined' || device == null ) {
          return Promise.reject(new Error('device is null or undefined');
        }
        this.log(device.getName() + ' -> Condition checked: ' + simpleStringify(device.getState()) );

        if (device.getState().onoff) {
          return Promise.resolve( true );
        } else {
          return Promise.resolve( false );
        }
      })
  }

  registerFlowCardAction(card_name, newState, flow_trigger) {
    let flowCardAction = new Homey.FlowCardAction(card_name);
    flowCardAction
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        if (typeof(device) == 'undefined' || device == null ) {
          return Promise.reject(new Error('device is null or undefined');
        }
        this.log(device.getName() + ' -> State set to ' + newState);

        device.setCapabilityValue('onoff', newState) // Fire and forget
          .catch(this.error);

        if (flow_trigger) {
          flow_trigger.trigger( device, {}, newState ) // Fire and forget
            .catch( this.error );
        }

        return Promise.resolve( true );
      })
  }
}

module.exports = ModeDriver;

function getIconNameAndLocation( name ) {
	return {
		'name': name,
		'location': '../assets/' + name + '.svg'
	}
};

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
    return simpleObject; // returns cleaned up JSON
};

function simpleStringify (object){
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
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};
