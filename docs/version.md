# Virtual Devices

* [Description](index)
* [Multi-Mode device](multimode)
* [Sensors](sensor)
* [Versions](version)
* [Bugs, Issues, and Feature Requests](https://github.com/ArjanKranenburg/virtual-devices/issues)

## Release history

### 0.7.2 (Beta)
* Changing intensity does not turn the device on (issue #36)

### 0.7.1 (Beta)
* Multimode not triggerd sometimes (issue #33)
* App keeps crashing (issue #35)

### 0.7.0 (Beta)
* Adding a measure_temperature and measure_power as sensor capabilities

### 0.6.8
* Fix for trigger & condition for same device (issue #27)

### 0.6.7
* Added Hue capabilities for lights
* Added A general trigger if one of the virtual devices (not yet modes) have changed
* Added Volume capabilities for tv and amplifier
* Added Lock
* Added House icon for modes
* Added target_temperature capability for coffeemachine

### 0.6.6
* Added Virtual Thermostat

### 0.6.5
* Added Multi-mode (issue #14, remainder)

### 0.6.4
* Added radiator icon
* Added Alarm-states (issue #14, partly)
* Added dim capability

### 0.6.3
* Added trigger card for modes to trigger on a change (issue #11)
* Fixed trigger card for status changed of virtual devices (issue #15)
* Added action cards to set mode without triggering device (issue #5)

### 0.6.0
* Rewrite for SDK2
* Removal of Obsolete Devices

### 0.5.4
* Fix crash-report: "Cannot assign to read only property 'onoff' of false" (issue #12)

### 0.5.3
* Adds Virtual Sunscreen device (Up / idle / down)

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
