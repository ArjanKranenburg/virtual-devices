'use strict';

const Homey = require('homey');

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
    // this.log('state:       ', this.getState());

    let modeOnTriggerDevice = new Homey.FlowCardTriggerDevice('mode_on');
    modeOnTriggerDevice.register();
    let modeOffTriggerDevice = new Homey.FlowCardTriggerDevice('mode_off');
    modeOffTriggerDevice.register();
    let modeChangedTriggerDevice = new Homey.FlowCardTriggerDevice('mode_changed');
    modeChangedTriggerDevice.register();

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));

      modeChangedTriggerDevice.trigger( this, {}, valueObj ) // Fire and forget
        .catch( this.error );

      if ( valueObj.onoff ) {
        modeOnTriggerDevice.trigger( this, {}, valueObj ) // Fire and forget
          .catch( this.error );
      } else {
        modeOffTriggerDevice.trigger( this, {}, valueObj ) // Fire and forget
          .catch( this.error );
      }
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
