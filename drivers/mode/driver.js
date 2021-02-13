'use strict';

const Homey = require('homey');
const fs = require('fs');
const DRIVER_LOCATION = "/app/com.arjankranenburg.virtual/drivers/mode/";

class ModeDriver extends Homey.Driver {
  onInit() {
		this.log('Initialized driver for Modes');

    var triggerDeviceOn  = new Homey.FlowCardTriggerDevice('mode_on'); //deprecated
    triggerDeviceOn.register();
    var triggerDeviceOff = new Homey.FlowCardTriggerDevice('mode_off'); //deprecated
    triggerDeviceOff.register();
    var triggerDeviceChanged = new Homey.FlowCardTriggerDevice('mode_changed');
    triggerDeviceChanged.register();

    this.registerFlowCardCondition('mode'); //deprecated

    this.registerFlowCardAction('mode_action_on', true, [triggerDeviceOn, triggerDeviceChanged]); //deprecated
    this.registerFlowCardAction('mode_action_off', false, [triggerDeviceOff, triggerDeviceChanged]); //deprecated
    this.registerFlowCardAction('mode_state_on', true, []);
    this.registerFlowCardAction('mode_state_off', false, []);
	}

  onPair( socket ) {
    let pairingDevice = {
      "name": Homey.__( 'pair.default.name.mode' ),
      "settings": {},
      "data": {
        id: guid(),
        version: 3
      },
      "class": "other",
      capabilities: [ "onoff" ]
    };

    socket.on('log', function( msg, callback ) {
        console.log(msg);
        callback( null, 'ok' );
    });

    socket.on('setName', function( data, callback ) {
        console.log('setName: ' + data);
        pairingDevice.name = data.name;
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );
    });

    socket.on('getPairingDevice', function( data, callback ) {
        callback( null, pairingDevice );
    });

    socket.on('getIcons', function( data, callback ) {
        var device_data = [
					getIconNameAndLocation('mode'),
          getIconNameAndLocation('house'),
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
	        getIconNameAndLocation('speaker'),
	        getIconNameAndLocation('on'),
	        getIconNameAndLocation('off'),
	    ]

        callback( null, device_data );
    });

    socket.on('setIcon', function( data, callback ) {
        console.log('setIcon: ' + data);
        pairingDevice.data.icon_name = data.icon.name;
        pairingDevice.icon = data.icon.location
        if ( Homey.version == undefined ) {
          pairingDevice.icon = DRIVER_LOCATION + "assets/" + data.icon.location
        }
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );
    });

    socket.on('saveIcon', function(data, callback) {
      try {
        console.log('saveIcon: ' + JSON.stringify(data));
        listFiles("./userdata");
        uploadIcon(data, pairingDevice.data.id);
        var deviceIcon = "../../../userdata/"+ pairingDevice.data.id +".svg";

        pairingDevice.data.icon = deviceIcon;
        pairingDevice.icon = deviceIcon
        console.log('pairingDevice: ' + JSON.stringify(pairingDevice));
        callback( null, pairingDevice );

      } catch (error) {
        console.log('saveIcon ERROR ' + JSON.stringify(error));
        callback( error, pairingDevice );
      }
    });

    socket.on('disconnect', function(){
        console.log('User aborted pairing, or pairing is finished');
        if ( pairingDevice.data.icon !== undefined && pairingDevice.data.icon.startsWith("../userdata")) {
          removeIcon(pairingDevice.data.icon)
        }
    })
  }

  registerFlowCardCondition(card_name) {
    let flowCardCondition = new Homey.FlowCardCondition(card_name);
    flowCardCondition
      .register()
      .registerRunListener(( args, state ) => {
        try {
          let device = validateItem('device', args.device);
          this.log(device.getName() + ' -> Condition checked: ' + simpleStringify(device.getState()) );

          if (device.getState().onoff) {
            return Promise.resolve( true );
          } else {
            return Promise.resolve( false );
          }
        }
        catch(error) {
          this.log('Device condition checked with missing information: ' + error.message)
          return Promise.reject(error);
        }
      })
  }

  registerFlowCardAction(card_name, newState, flow_triggers) {
    let flowCardAction = new Homey.FlowCardAction(card_name);
    flowCardAction
      .register()
      .registerRunListener(( args, state ) => {
        try {
          let device = validateItem('device', args.device);
          this.log(device.getName() + ' -> State set to ' + newState);
          if ( device.getCapabilityValue('onoff') !== newState ) {

            device.setCapabilityValue('onoff', newState) // Fire and forget
              .catch(this.error);

            for (var i = 0; i < flow_triggers.length; i++) {
              flow_triggers[i].trigger( device, {}, newState ) // Fire and forget
                .catch( this.error );
            }
          }

          return Promise.resolve( true );
        }
        catch(error) {
          this.log('Device action called with missing information: ' + error.message)
          return Promise.reject(error);
        }
      })
  }
}

module.exports = ModeDriver;

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getIconNameAndLocation( name ) {
	return {
		'name': name,
		'location': '../assets/' + name + '.svg'
	}
};

function listFiles( path ) {
  console.log("listFiles: ");
  return new Promise((resolve, reject) => {
    try {
      fs.readdirSync(path).forEach(file => {
        console.log(file);
      });
    } catch (error) {
      return reject(error);
    }
  })
}

function uploadIcon(img, id) {
  return new Promise((resolve, reject) => {
    try {
      const path = "../userdata/"+ id +".svg";
      const base64 = img.replace("data:image/svg+xml;base64,", '');
      fs.writeFile(path, base64, 'base64', (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(true);
        }
      });
    } catch (error) {
      return reject(error);
    }
  })
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

function validateItem(item, value) {
  if (typeof(value) == 'undefined' || value == null ) {
    throw new ReferenceError( item + ' is null or undefined' );
  }
  return value;
}

function cleanJson (object) {
    var simpleObject = {};
    for (var prop in object ) {
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return simpleObject; // returns cleaned up JSON
};

function simpleStringify (object) {
    var simpleObject = cleanJson(object);
    return JSON.stringify(simpleObject);
};
