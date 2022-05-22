#!/usr/bin/env node

import ConfigurationManager from './helper/ConfigurationManager';
import Log from './helper/Log';
import _, {forEach} from 'lodash';
import * as hid from 'node-hid'

Log.verbose('', 'Import of libraries, types and classes completed.');

//#region Configuration

Log.verbose('', 'Start loading configuration and default settings..');

// load temperature thresholds and order them by ascending threshold to ensure the loop through those values work

Log.verbose('', 'Loading configuration and default settings completed.');

//#endregion Configuration

function toHex(value: { toString: (arg0: number) => any; }) {
    let hex = value.toString(16);
    if ((hex.length % 2) > 0) {
        hex = "0" + hex;
    }
    return hex;
}

//#region Script execution

/**
 * Infinite loop to read values from available sensors
 */
async function startApplication(driverType: 'hidraw' | 'libusb' = 'hidraw') {
    Log.verbose('', 'Executing function %s', 'startApplication');

    // Linux: choose driverType
    hid.setDriverType(driverType);

    const vendorId: number = 0x16C0; // from sample console app (main.c)
    const productId: number = 0x0480; // from sample console app (main.c)

    let hidDevices = hid.devices(vendorId, productId);

    if (hidDevices.length == 0) Log.error('', 'No DS18B20 sensor found')

    Log.verbose('', 'Found %d DS18B20 devices:', hidDevices.length)
    hidDevices.map((deviceInfo => {
        Log.verbose(deviceInfo.serialNumber ? deviceInfo.serialNumber : '', "%s (%s): %s (%s) release %s (%s)",
            deviceInfo.manufacturer, deviceInfo.vendorId, deviceInfo.product, deviceInfo.productId, deviceInfo.release, deviceInfo.path)
    }))

    // This loop might not work for multiple devices, untested yet
    hidDevices.forEach(function (deviceInfo) {
        if (deviceInfo && deviceInfo.path) {
            var device = new hid.HID(deviceInfo.path);

            // Endless watcher event waiting for new data from device
            device.on('data', function (dataBuffer: any) {

                let sensorTotal: number = dataBuffer[0];
                let sensorNo: number = dataBuffer[1];
                let power: string = dataBuffer[2] ? "Extern" : "Parasite";

                // Read temperature from sensor
                let temp: number = dataBuffer[4] + (256 * dataBuffer[5]); // Extracted from python demo (temptest.py)
                temp = temp > 32767 ? (65536 - temp) * -1 : temp // when buffer show temp 32767 it's an indicator for minus degrees
                temp = temp / 10.0; // Temperature must be divided by 10 since it's representing a float value

                // Read sensor id for precise identification
                let sensorId:string = ''
                for (let i = 0x08; i < 0x10; i++) {
                    sensorId += toHex(dataBuffer[i]).toUpperCase() + " ";
                }
                sensorId = sensorId.trim();

                Log.info(sensorId, "Sensor #%d of %d reports %f°C (%s powered)",
                    sensorNo, sensorTotal, temp, power);
            })
        }
    });

}

startApplication();

//#endregion Script execution

