# Virtual Devices

This app gives you the opportunity to add Virtual Devices to Homey that can be operated from the UI Interface and that can trigger flows.

Or you can add a mode and add it as a condition, e.g. to dissable multiple flows when going on Holiday. 

## What works:

Devices:
  * Switch
  * Light
  * Alarm
  * Blinds
  * Hifi
  * TV
  * Button

Modes:
  * Holiday
  * Away
  * Party
  * Event
  * Quiet
  * Movie
  * Sleep
  * Relax
  * Manual
  * Secure


* Trigger a flow
* Use the switch/mode status as a condition
* Use the switch/mode in the 'then'-column

## What doesn't:

* Blinds can go on/off, not yet up, stop, down
* Other devices, like a Dimmer, etc.

I'm very interested to hear your ideas for other virtual devices. 


## Release history

### 0.5.2
* Make states persistent over reboots

### 0.5.1
* Fix issue with action card for buttons

### 0.5.0
* Major re-factoring to keep the app lean, maintainable, and to prepare for future updates
* The class, capabilities, and icon can now be selected when creating the virtual device
* <b>Unfortunately old devices must be added again (they will stop working in the next release)</b>

### 0.4.0
* Added Buttons
* Added Relax and Manual Modes

### 0.3.0
* Added more devices and modes (thanks to ZperX)

### 0.2.0
* Use the switch in the 'then'-column

### 0.1.0
* Use the switches status as a condition
* Multiple Virtual devices can be added
* First Device: a Virtual Switch
