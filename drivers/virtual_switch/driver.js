'use strict';

const Homey = require('homey');

class VirtualDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Virtual Devices');
	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, "ok" );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log("Adding new device");

        var device_data = [
	        getIconNameAndLocation('switch'),
	        getIconNameAndLocation('light'),
	        getIconNameAndLocation('blinds'),
          getIconNameAndLocation('curtains'),
	        getIconNameAndLocation('tv'),
	        getIconNameAndLocation('hifi'),
	        getIconNameAndLocation('alarm'),
          getIconNameAndLocation('radiator'),
          getIconNameAndLocation('thermostat'),
          getIconNameAndLocation('button'),
          getIconNameAndLocation('lock'),
	    ]

        callback( null, device_data );
    });

    socket.on('disconnect', function(){
        console.log("User aborted pairing, or pairing is finished");
    })
  }
}

module.exports = VirtualDriver;

function getIconNameAndLocation( name ) {
	return {
		"name": name,
		"location": "../assets/" + name + ".svg"
	}
};
