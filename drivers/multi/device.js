'use strict';

const Homey = require('homey');
const TOKEN_NAME = 'multi_state';
const PREVIOUS_STATE_NAME = 'previous_state';

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

    let thisMultiChanged = new Homey.FlowCardTriggerDevice('multi_changed');
    thisMultiChanged.register();

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));
      this.log('State before:       ', this.getState());

      // There should be 1, but just in case
      for (var changedCapability in valueObj) {
        var newState = this.getData().state_names[changedCapability];
        if (this.getCapabilityValue(TOKEN_NAME) === newState) {
          this.log('State did not change')
          return Promise.resolve(); // no change, no triggers
        }

        this.setMultiState(newState);
      }

      process.nextTick(async () => {
        await sleep(100);
        thisMultiChanged.trigger( this, {}, valueObj ) // Fire and forget
          .catch( this.error );
      });

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
    console.log('Setting previous state to: ' + this.getData().state_names["onoff.opt1"]);
    this.setCapabilityValue(PREVIOUS_STATE_NAME, this.getData().state_names["onoff.opt1"])
      .catch( this.error );
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device mode: ' + this.getName());
  }

  isStateAllowed( state ) {
    var allowedStates = Object.values(this.getData().state_names);
    return allowedStates.contains(state);
  }

  setMultiState( new_state ) {
    if( ! this.isStateAllowed(new_state) ) { return }
    this.log('Set name: ', new_state);
    if (this.hasCapability(PREVIOUS_STATE_NAME)) {
      this.log('Previous state: ', this.getCapabilityValue(TOKEN_NAME));
      this.setCapabilityValue(PREVIOUS_STATE_NAME, this.getCapabilityValue(TOKEN_NAME))
        .catch( this.error );
    }
    this.setCapabilityValue(TOKEN_NAME, new_state)
      .catch( this.error );

    this.setBooleanWithStateName( new_state );
  }

  setBooleanWithStateName( state ) {
    var stateNames = this.getData().state_names;
    var capabilities = Object.keys(stateNames);
    for (var i = 0, len = capabilities.length; i < len; i++) {
      var capab = capabilities[i];
      var stateName  = stateNames[capab]
      if( stateName === state ) {
        this.setCapabilityValue(capab, true)
          .catch( this.error );
      } else {
        this.setCapabilityValue(capab, false)
          .catch( this.error );
      }
    }
  }
}

module.exports = ModeDevice;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}
