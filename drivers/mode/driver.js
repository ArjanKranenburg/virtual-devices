'use strict';

const Homey = require('homey');

class ModeDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Modes');

    // let modeOnTrigger = new Homey.FlowCardTriggerDevice('mode_on');
    // modeOnTrigger.register()
    //   .registerRunListener(( args, state ) => {
    //
    //         console.log(args); // { 'location': 'New York' }, this is the user input
    //         console.log(state); // { 'location': 'Amsterdam' }, this is the state parameter, as passed in trigger()
    //         this.log(args); // { 'location': 'New York' }, this is the user input
    //         this.log(state); // { 'location': 'Amsterdam' }, this is the state parameter, as passed in trigger()
    //
    //         // If true, this flow should run
    //         return Promise.resolve( true );
    //
    //     })

    // let modeOnTriggerDevice = new Homey.FlowCardTriggerDevice('mode_on')
    //     .register()
    //     .trigger( device, tokens, state )
    //         .then( this.log )
    //         .catch( this.error )
    //


	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, 'ok' );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log("Adding new device");

        var device_data = [
					getIconNameAndLocation('mode'),
	        getIconNameAndLocation('away'),
	        getIconNameAndLocation('event'),
	        getIconNameAndLocation('holiday'),
	        getIconNameAndLocation('manual'),
	        getIconNameAndLocation('movie'),
	        getIconNameAndLocation('party'),
	        getIconNameAndLocation('quiet'),
	        getIconNameAndLocation('relax'),
	        getIconNameAndLocation('secure'),
	        getIconNameAndLocation('sleep'),
	    ]

        callback( null, device_data );
    });

    socket.on('disconnect', function(){
        console.log("User aborted pairing, or pairing is finished");
    })
  }
}


module.exports = ModeDriver;

function getIconNameAndLocation( name ) {
	return {
		"name": name,
		"location": "../assets/" + name + ".svg"
	}
}
