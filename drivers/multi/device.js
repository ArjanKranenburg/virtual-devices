'use strict';

const Homey = require('homey');
const TOKEN_NAME = 'multi_state';

//a list of devices, with their 'id' as key
//it is generally advisable to keep a list of
//paired and active devices in your driver's memory.
var devices = {};

class ModeDevice extends Homey.Device {
  onInit() {
    this.log('Mode device (' + this.getName() + ') inititialized');

		// this.log('name:        ', this.getName());
    // this.log('id:          ', this.getData().id);
    // this.log('version:     ', this.getData().version);
    // this.log('icon:        ', this.getData().icon);
    // this.log('class:       ', this.getClass());
    // this.log('capabilities:', JSON.stringify(this.getCapabilities()));
    this.log('state:       ', this.getState());

    let triggerDevice = new Homey.FlowCardTriggerDevice('multi_changed');
    triggerDevice.register();

    // let homeModeIsTrigger = new Homey.FlowCardTriggerDevice('home_mode_is');
    // homeModeIsTrigger.register();
    // this.registerFlowCardRunListener(homeModeIsTrigger);

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));
      this.log('State before:       ', this.getState());

      // 1. valueObj = {"onoff.opt2":true} -> reset the others to false
      var changedCapability = Object.keys(valueObj)[0];
      for (var capability in this.getState()) {
        if ( capability !== changedCapability
          && capability !== TOKEN_NAME) {
          this.log('1) state:       ', capability);
          this.setCapabilityValue(capability, false)
            .catch( this.error );
        }
      }

      // 2. Get the name and store it in multi_state
      var state_name = this.getData().state_names[changedCapability];
      this.log('2) name:        ', state_name);
      this.setCapabilityValue(TOKEN_NAME, state_name)
        .catch( this.error );

      // 3. Trigger flow
      triggerDevice.trigger( this, {}, valueObj ) // Fire and forget
        .catch( this.error );

      return Promise.resolve();
    }, 500);
  }

  // this method is called when the Device is added
  onAdded() {
    this.log('Adding multi: ' + this.getName() + ' (' + this.getData().id + ')');

    // 1) Set first capability to true
    this.setCapabilityValue('onoff.opt1', true)
      .catch( this.error );

    // 2) Set capability with TOKEN_NAME to first capability name
    console.log('Data is: ' + JSON.stringify(this.getData()));
    console.log('State names is: ' + JSON.stringify(this.getData().state_names));
    console.log('Setting state to: ' + this.getData().state_names["onoff.opt1"]);
    this.setCapabilityValue(TOKEN_NAME, this.getData().state_names["onoff.opt1"])
      .catch( this.error );
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device mode: ' + this.getName());
  }

  // registerFlowCardRunListener(flowCardTrigger) {
  //   flowCardTrigger.registerRunListener(( args, state ) => {
  //     this.log('Flow card is triggered: ' + JSON.stringify(state));
  //
  //     let argums = cleanJson(args);
  //     let firstArg = Object.keys(argums)[0]; // Should I iterate over all arguments?
  //     let triggerState = argums[firstArg];
  //
  //     if (state === triggerState) {
  //       return Promise.resolve( true );
  //     } else {
  //       return Promise.resolve( false );
  //     }
  //   })
  // }
  //
  // registerSingleCapabilityListener(capability, flowCardTrigger){
  //   this.registerCapabilityListener(capability, ( value, opts ) => {
  //     this.log(this.getName() + ' -> ' + capability + ' changed: ' + JSON.stringify(value) );
  //
  //     flowCardTrigger.trigger( this, {}, value ) // Fire and forget
  //       .catch( this.error );
  //
  //       return Promise.resolve();
  //     }, 500);
  // }

  getStateAsString() {
    this.log('getStateAsString');
    this.setMultiState();

    return this.getState().multi_state;
  }

  setMultiState() {
    var states = this.getState();
    this.log('state:       ', JSON.stringify(states));
    this.log('multi-state:       ', JSON.stringify(states.multi_state));

    for (var state in states) {
      this.log('1) state:       ', JSON.stringify(state));
    }
  }
}

module.exports = ModeDevice;

// function cleanJson (object){
//     var simpleObject = {};
//     for (var prop in object ){
//         if (!object.hasOwnProperty(prop)){
//             continue;
//         }
//         if (typeof(object[prop]) == 'object'){
//             continue;
//         }
//         if (typeof(object[prop]) == 'function'){
//             continue;
//         }
//         simpleObject[prop] = object[prop];
//     }
//     return simpleObject; // returns cleaned up JSON
// };
