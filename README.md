# Virtual Devices

This app gives you the opportunity to add Virtual Devices to Homey. You can operate the Virtual Devices from the UI and/or use them in flows.

Or you can add a mode and add it as a condition, e.g. to disable multiple flows when going on Holiday.

## Important note:

This app is no longer updated. It works how it works. I may look at some pull-requests, but nothing major or drastic.

Homey is developing much quicker than I can keep up. With the new release of Homey Bridge and support for TypeScript, it makes sense to start from scratch and create a new Virtual Devices v2 app that follows the latest standards. 

That won't be me, though. I have different interests. Perhaps in the future...., but no, don't wait for that.

Feel free to take the name, the ideas and even parts of the code. In fact I would like that very much.

1 tip: I would create perhaps several apps:
* 1 App for pure Virtual Devices, supporting only the capabilities provided by Athom
* 1 App for sensors, with the freedom to combine multiple (sensor-)capabilities into 1 app
* 1 App for modes, maybe give the multi-mode a new try
* Specific apps for specific request. E.g. Garage doors, Swimming pools, etc.



## What works:

* Virtual Devices: Switch, Alarm, Blinds, Hifi, Light, Security, TV, Heater
* Modes: Holiday, Away, Party, Event, Quiet, Movie, Sleep, Relax, Manual, Secure
* Trigger a flow
* Use the switch/mode status as a condition
* Use the switch/mode in the 'then'-column

## What doesn't:

* Settings (or other) that makes some modes mutually exclusive (issue #3)


## More information:

There is more information, including How-to's on GitHub Pages:
[https://arjankranenburg.github.io/virtual-devices/](https://arjankranenburg.github.io/virtual-devices/)

Please report bugs on github:
[https://github.com/ArjanKranenburg/virtual-devices/issues](https://github.com/ArjanKranenburg/virtual-devices/issues)

Questions can be asked on the Virtual Devices topic of the Homey Forum: [https://community.athom.com/t/virtual-devices/1723](https://community.athom.com/t/virtual-devices/1723)

...or on [Slack](https://athomcommunity.slack.com) (@arielaxed)
