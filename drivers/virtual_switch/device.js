'use strict';

const Homey = require('homey');
const fs = require('fs');

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
    // this.getCapabilities().forEach(capability => {
    //   this.log('capabilityOptions - ' + capability + ':', JSON.stringify(this.getCapabilityOptions(capability)));      
    // });
    // this.log('state:       ', this.getState());

    let thisDeviceChanged = new Homey.FlowCardTriggerDevice('press');
    thisDeviceChanged.register();

    let aVirtualDeviceChanged = new Homey.FlowCardTrigger('device_changed');
		aVirtualDeviceChanged.register();

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (changedCapabs, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(changedCapabs));

      for (var capability in changedCapabs) {
        var value = changedCapabs[capability];
        // this.log('capability: ' + capability);
        // this.log('value:    ' + value);

        if ( capability === 'onoff' ) {
          if ( this.getCapabilityValue('onoff') === value ) {
            return Promise.resolve(); // no change, no triggers
          }
        }

        if (capability === 'dim' && this.hasCapability( 'onoff' )) {
          if ( value > 0 ) {
            this.setCapabilityValue( 'onoff', true )
          } else {
            this.setCapabilityValue( 'onoff', false )
          }
        }

        process.nextTick(async () => {
          await sleep(100);
          thisDeviceChanged.trigger( this, {}, changedCapabs )
            .catch( this.error );
        });

        let tokens = {
            'device': this.getName(),
            'variable': capability,
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
    this.log('Adding device');
    this.log('Adding device: ' + this.getName() + ' (' + this.getData().id + ')');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('device deleted: ' + this.getName());
    
    if ( this.getData().icon.startsWith("../../../userdata")) {
      removeIcon(this.getData().icon)
    }
  }
}

function removeIcon(iconpath) {
  console.log("removeIcon( " + iconpath + " )");
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(iconpath)) {
        fs.unlinkSync(iconpath);
        return resolve(true);
      } else {
        return resolve(true);
      }
    } catch (error) {
      return reject(error);
    }
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = VirtualDevice;
