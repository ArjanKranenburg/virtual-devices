'use strict';

const Homey = require('homey');

class VirtualDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Virtual Devices');

    let alarmStateIsTrigger = new Homey.FlowCardTriggerDevice('alarm_state_is');
    alarmStateIsTrigger.register();

    this.registerFlowCardCondition('alarm_state', 'alarm_state');
    this.registerFlowCardAction('set_alarm_state', 'alarm_state', alarmStateIsTrigger);
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
	        getIconNameAndLocation('tv'),
	        getIconNameAndLocation('hifi'),
	        getIconNameAndLocation('alarm'),
          getIconNameAndLocation('radiator'),
	        getIconNameAndLocation('button'),
	    ]

        callback( null, device_data );
    });

    socket.on('disconnect', function(){
        console.log("User aborted pairing, or pairing is finished");
    })
  }

  registerFlowCardCondition(card_name, capability) {
    let flowCardCondition = new Homey.FlowCardCondition(card_name);
    flowCardCondition
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        let argums = cleanJson(args);
        let firstKey = Object.keys(argums)[0]; // Should I check all keys?
        let stateToCheck = argums[firstKey];
        this.log(device.getName() + ' -> Condition checked: ' + simpleStringify(device.getState()) );

        if (stateToCheck === device.getState()[capability]) {
          return Promise.resolve( true );
        } else {
          return Promise.resolve( false );
        }
      })
  }

  registerFlowCardAction(card_name, capability, flow_trigger) {
    let flowCardAction = new Homey.FlowCardAction(card_name);
    flowCardAction
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        let argums = cleanJson(args);
        let firstArg = Object.keys(argums)[0]; // Should I iterate over all arguments?
        let newState = argums[firstArg];
        this.log(device.getName() + ' -> State set to ' + newState);

        device.setCapabilityValue(capability, newState) // Fire and forget
          .catch(this.error);

        if (flow_trigger) {
          flow_trigger.trigger( device, {}, newState ) // Fire and forget
            .catch( this.error );
        }

        return Promise.resolve( true );
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
