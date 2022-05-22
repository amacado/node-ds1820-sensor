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


// Infinite loop to call the API and react on thresholds
async function startApplication() {
    Log.verbose('', 'Executing function %s', 'startApplication');

    // Linux: choose driverType
    // default is 'hidraw', can also be 'libusb'
    if (process.argv[2]) {
        hid.setDriverType('hidraw');
    }

    const vendorId: number = 0x16C0; // from sample console app (main.c)
    const productId: number = 0x0480; // from sample console app (main.c)

    let hidDevices = hid.devices(vendorId, productId);

    if(hidDevices.length == 0) Log.error('','No DS1820 device found')

    hidDevices.forEach(function (deviceInfo) {
        if( deviceInfo && deviceInfo.path) {
            var device = new hid.HID(deviceInfo.path);
            device.on('data', function(dataBuffer: any) {

                let temp = dataBuffer[4];
                let sensorNo = dataBuffer[1];
                let sensorTotal = dataBuffer[0];
                let power = dataBuffer[2] ? "Extern" : "Parasite";

                let sensorSerial = ''
                for (let i = 0x08; i < 0x10; i++) {
                    sensorSerial += toHex(dataBuffer[i]).toUpperCase() + " ";
                }

                Log.info('',"Sensor %d of %d %f°C %s %s",
                    sensorNo, sensorTotal, temp / 10.0, power, sensorSerial);
            } )
        }
    });

}

startApplication();

//#endregion Script execution

