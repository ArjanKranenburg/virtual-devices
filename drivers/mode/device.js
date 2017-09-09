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
