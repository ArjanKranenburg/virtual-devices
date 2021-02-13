'use strict';

const Homey = require('homey');
const fs = require('fs');

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

    let thisModeOn = new Homey.FlowCardTriggerDevice('mode_on');
    thisModeOn.register();
    let thisModeOff = new Homey.FlowCardTriggerDevice('mode_off');
    thisModeOff.register();
    let thisModeChanged = new Homey.FlowCardTriggerDevice('mode_changed');
    thisModeChanged.register();

    // When capability is changed
    this.registerMultipleCapabilityListener(this.getCapabilities(), (valueObj, optsObj) => {
      this.log(this.getName() + ' -> Capability changed: ' + JSON.stringify(valueObj));

      process.nextTick(async () => {
        await sleep(100);
        thisModeChanged.trigger( this, {}, valueObj ) // Fire and forget
          .catch( this.error );
      });

      if ( valueObj.onoff ) {
        thisModeOn.trigger( this, {}, valueObj ) // Fire and forget
          .catch( this.error );
      } else {
        thisModeOff.trigger( this, {}, valueObj ) // Fire and forget
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

module.exports = ModeDevice;
