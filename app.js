"use strict";

const Homey = require('homey');

class VirtualDevices extends Homey.App {

	onInit() {

		this.log('Virtual Devices App is initialized');
	}
}

module.exports = VirtualDevices;
