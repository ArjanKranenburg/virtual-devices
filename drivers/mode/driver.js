'use strict';

const Homey = require('homey');

class ModeDriver extends Homey.Driver {

  onInit() {
		this.log('Initialized driver for Modes');

    let triggerDeviceOn  = new Homey.FlowCardTriggerDevice('mode_on');
    triggerDeviceOn.register();
    let triggerDeviceOff = new Homey.FlowCardTriggerDevice('mode_off');
    triggerDeviceOff.register();

    let modeCondition = new Homey.FlowCardCondition('mode');
    modeCondition
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        this.log(device.getName() + ' -> Condition checked');

        if (device.getState().onoff) {
          return Promise.resolve( true );
        } else {
          return Promise.resolve( false );
        }
      })

    let modeActionOn = new Homey.FlowCardAction('mode_action_on');
    modeActionOn
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        this.log(device.getName() + ' -> Action on requested');

        args.device.setCapabilityValue('onoff', true);

        // setCapability does not trigger the device-card
        triggerDeviceOn.trigger( device, {}, {'onoff': true} )
          .then( device.log )
          .catch( device.error )

        return Promise.resolve( true );
      })

    let modeActionOff = new Homey.FlowCardAction('mode_action_off');
    modeActionOff
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        this.log(device.getName() + ' -> Action off requested');

        args.device.setCapabilityValue('onoff', false);

        // setCapability does not trigger the device-card
        triggerDeviceOff.trigger( device, {}, {'onoff': false} )
          .then( device.log )
          .catch( device.error )

        return Promise.resolve( false );
      })

    let modeStateOn = new Homey.FlowCardAction('mode_state_on');
    modeStateOn
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        this.log(device.getName() + ' -> State set to on');

        args.device.setCapabilityValue('onoff', true);

        return Promise.resolve( true );
      })

    let modeStateOff = new Homey.FlowCardAction('mode_state_off');
    modeStateOff
      .register()
      .registerRunListener(( args, state ) => {
        let device = args.device;
        this.log(device.getName() + ' -> State set to off');

        args.device.setCapabilityValue('onoff', false);

        return Promise.resolve( false );
      })
	}

  onPair( socket ) {

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, 'ok' );
    });

    socket.on('getIcons', function( data, callback ) {
        console.log('Adding new device');

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
        console.log('User aborted pairing, or pairing is finished');
    })
  }
}

module.exports = ModeDriver;

function getIconNameAndLocation( name ) {
	return {
		'name': name,
		'location': '../assets/' + name + '.svg'
	}
}
