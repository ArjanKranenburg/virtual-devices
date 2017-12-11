'use strict';

const Homey = require('homey');

//a list of devices, with their 'id' as key
//it is generally advisable to keep a list of
//paired and active devices in your driver's memory.
var devices = {};

class VirtualDevice extends Homey.Device {
  onInit() {
    this.log('Virtual Device (' + this.getName() + ') initialized');

		// this.log('name:        ', this.getName());
    // this.log('id:          ', this.getData().id);
    // this.log('version:     ', this.getData().version);
    // this.log('icon:        ', this.getData().icon);
    // this.log('class:       ', this.getClass());
    // this.log('capabilities:', JSON.stringify(this.getCapabilities()));
    // this.log('state:       ', this.getState());

    let triggerDevice = new Homey.FlowCardTriggerDevice('press');
    triggerDevice.register();

    let deviceChangedTrigger = new Homey.FlowCardTrigger('device_changed');
		deviceChangedTrigger.register();

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));

      triggerDevice.trigger( this, {}, valueObj ) // Fire and forget
        .catch( this.error )

      // b.v.: valueObj = {"light_saturation":1}
      var variable = Object.keys(valueObj)[0];
      // this.log('variable: ' + variable);
      // this.log('value:    ' + valueObj[variable]);

      let tokens = {
          'device': this.getName(),
          'variable': variable,
          'value': '' + valueObj[variable]
      }

      deviceChangedTrigger.trigger( tokens ) // Fire and forget
        .catch( this.error )

      return Promise.resolve();
    }, 500);
  }

  // this method is called when the Device is added
  onAdded() {
    this.log('Adding device');
    this.log('Adding device: ' + this.getName() + ' (' + this.getData().id + ')');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device deleted: ' + this.getName());
  }
}

module.exports = VirtualDevice;
