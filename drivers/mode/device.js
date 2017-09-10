'use strict';

const Homey = require('homey');

//a list of devices, with their 'id' as key
//it is generally advisable to keep a list of
//paired and active devices in your driver's memory.
var devices = {};

class ModeDevice extends Homey.Device {
  onInit() {
    this.log('Mode device inititialized');

		this.log('name:        ', this.getName());
    this.log('id:          ', this.getData().id);
    this.log('version:     ', this.getData().version);
    this.log('icon:        ', this.getData().icon);
    this.log('class:       ', this.getClass());
    this.log('capabilities:', JSON.stringify(this.getCapabilities()));
    this.log('state:       ', this.getState());

    let modeCondition = new Homey.FlowCardCondition('mode');
    modeCondition
        .register()
        .registerRunListener(( args, state ) => {
          this.log('Condition checked...');
          this.log('state: ', state);
          this.log('args:  ', args);
          let modeDevice = args.device; // or args.my_device

          let state = modeDevice.getState();
          this.log('Returned state: ', state);

          if (state.onoff) {
            this.log('Returning true');
            return Promise.resolve( true );
          } else {
            this.log('Returning false');
            return Promise.resolve( false );
          }
        })

    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log('Capability listened...');
      this.log('valueObj: ', valueObj);
      this.log('optsObj:  ', optsObj);

      return Promise.resolve();
    }, 500);

  }

  // this method is called when the Device is added
  onAdded() {
    this.log('Adding mode: ' + this.getName() + ' (' + this.getData().id + ')');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device mode: ' + this.getName());
  }


}

module.exports = ModeDevice;
