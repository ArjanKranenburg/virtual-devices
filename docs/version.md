# Virtual Devices

* [Description](index)
* [Sensors](sensor)
* [Modes](mode)
* [Versions](version)
* [Questions](https://community.athom.com/t/virtual-devices/1723)
* [Bugs, Issues, and Feature Requests](https://github.com/ArjanKranenburg/virtual-devices/issues)

## Release history

### 0.9.2
* Own icons can be uploaded (issue #127)
* Allow min & max for target_temperature to be set (issue #116)
* Changed icon for quiet to make it same style as Speaker

### 0.9.1 Cancelled

### 0.9.0
* Fixes ability to set the energy consumption (issue #111)

### 0.8.9
* Added support for capabilities measure_battery, meter_gas, meter_water, and meter_rain in Sensor
* Added Norwegian translation (thanks to Allram)

### 0.8.8
* Support measure_power (thanks to @allram)
* Disabled Multi-modes
* Added classes blinds, curtain, sunshade, solarpanel, and doorbell
* Added classes vacuumcleaner, camera, remote, speaker
* Set Energy Consumption hardcoded to 0

### 0.8.7
* Improved pairing pages (thanks to @daneedk)
* added German translation (thanks to @philsniff)
* capabilities added to sensor (thanks to @daneedk)
* Added open-window icon to virtual-switch

### 0.8.6
* Lowered scale for target-temp up-to 50 (issue #94)

### 0.8.5
* Fixed icons of new devices in V2 (issue #77)
* Fixed no capability when not selecting other than default capability (issue #81)

### 0.8.1
* Updated Compatibility

### 0.8.0
* Improved pairing process

### 0.7.5
* Support for motion and contact sensors (issue #67)
* Increase range for target_temperature (issue #53)
* Added capabilities to measure co, current, gust_angle, gust_strength,
  luminance, noise, rain, ultraviolet, voltage, water, wind_angle, and
  wind_strength (issues #26 and #66)
* Added capability to measure Energy (KWh) (issue #57)

### 0.7.4
* Support for boolean sensors (issue #61)

### 0.7.3
* Added lots of icons to multi-mode (issue #37)
* Added numbered icons to multi-mode (issue #10)
* Added icons to multi-mode for open and closed windows (issue #41)
* Added capability alarm_motion (issue #40)
* Added a Sensor (issue #26 and #32)

### 0.7.2
* A Multi-state now also has a previous_state (issue #47)
* A device that is turned on will not be turned on again (issue #42)
* Changing intensity affects the device on-off (issue #36)
* Mode changed is now also triggered when a mode is changed in a flow (issue #39)

### 0.7.1
* Multimode not triggered sometimes (issue #33)
* App keeps crashing (issue #35)

### 0.7.0
* Adding a measure_temperature and measure_power as sensor capabilities

### 0.6.8
* Fix for trigger & condition for same device (issue #27)

### 0.6.7
* Added Hue capabilities for lights
* Added A general trigger if one of the virtual devices (not yet modes) have changed
* Added Volume capabilities for tv and amplifier
* Added Lock
* Added House icon for modes
* Added target_temperature capability for coffee machine

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
