"use strict";

const config = {
		triggers: {
			name: 'button_alarm_pushed',
		},
		logger: {
		}
	};

const Button = require('../../general/drivers/button.js');
const driver = new Button(config);

module.exports = Object.assign(
	{},
	driver.getExports(), 
	{ init: (devices, callback) => driver.init(devices, callback) }
);

