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

    let thisDeviceChanged = new Homey.FlowCardTriggerDevice('press');
    thisDeviceChanged.register();

    let aVirtualDeviceChanged = new Homey.FlowCardTrigger('device_changed');
		aVirtualDeviceChanged.register();

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));

      process.nextTick(async () => {
        await sleep(100);
        thisDeviceChanged.trigger( this, {}, valueObj )
          .catch( this.error );
      });

      // There should be 1, but just in case
      for (var i = 0, len = Object.keys(valueObj).length; i < len; i++) {
        // b.v.: valueObj = {"light_saturation":1}
        var variable = Object.keys(valueObj)[i];
        var value = valueObj[variable];
        // this.log('variable: ' + variable);
        // this.log('value:    ' + value);
        if (variable === 'dim' && this.hasCapability( 'onoff' )) {
          if ( value > 0 ) {
            this.setCapabilityValue( 'onoff', true )
          } else {
            this.setCapabilityValue( 'onoff', false )
          }
        }

        let tokens = {
            'device': this.getName(),
            'variable': variable,
            'value': '' + value
        }
        aVirtualDeviceChanged.trigger( tokens ) // Fire and forget
          .catch( this.error )
      }

      return Promise.resolve();
    }, 500);
  }

  // this method is called when the Device is added
  onAdded() {
    this.log('Adding device: ' + this.getName() + ' (' + this.getData().id + ')');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device deleted: ' + this.getName());
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = VirtualDevice;
