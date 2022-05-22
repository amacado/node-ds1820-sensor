#!/usr/bin/env node

import ConfigurationManager from './helper/ConfigurationManager';
import Log from './helper/Log';
import * as hid from 'node-hid'

import {Sensor} from './types/Sensor';
import {SensorPower} from './enums/SensorPower';
import {MeasuredTemperature} from './types/MeasuredTemperature';
import InfluxDB2OutputService from './services/outputs/InfluxDB2OutputService';

Log.verbose('', 'Import of libraries, types and classes completed.');

//#region Configuration

Log.verbose('', 'Start loading configuration and default settings..');

const ds18b20ManufacturerId: number = ConfigurationManager.get('ds18b20:manufacturerId');
const ds18b20ProductId: number = ConfigurationManager.get('ds18b20:productId');
const driverType = ConfigurationManager.get('driver:type');
const formatTemperature = ConfigurationManager.get('format:temperature');



Log.verbose('', 'Loading configuration and default settings completed.');

//#endregion Configuration

function toHex(value: { toString: (arg0: number) => any; }) {
    let hex = value.toString(16);
    if ((hex.length % 2) > 0) {
        hex = "0" + hex;
    }
    return hex;
}

/**
 * Convert given temperature in celsius to
 * temperature in fahrenheit
 *
 * @return number
 * @param tempCelsius
 */
function celsiusToFahrenheit(tempCelsius: number): number {
    let tempFahrenheit = tempCelsius * 9 / 5 + 32
    return tempFahrenheit;
}

//#region Script execution

/**
 * Infinite loop to read values from available sensors
 */
async function startApplication() {
    Log.verbose('', 'Executing function %s', 'startApplication');



    hid.setDriverType(driverType); // When script runs on linux different driver types are available
    let hidDevices = hid.devices(ds18b20ManufacturerId, ds18b20ProductId); // Fetch list of available devices

    if (hidDevices.length == 0) {
        Log.error('', 'No DS18B20 sensor found. Script execution aborted.')
        return
    }

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
                let sensorPower: SensorPower = dataBuffer[2] ? SensorPower.Extern : SensorPower.Parasite;

                // Read temperature from sensor
                let temp: number = dataBuffer[4] + (256 * dataBuffer[5]); // Extracted from python demo (temptest.py)
                temp = temp > 32767 ? (65536 - temp) * -1 : temp // when buffer show temp 32767 it's an indicator for minus degrees
                temp = temp / 10.0; // Temperature must be divided by 10 since it's representing a float value

                // Read sensor id for precise identification
                let sensorId: string = ''
                for (let i = 0x08; i < 0x10; i++) {
                    sensorId += toHex(dataBuffer[i]).toUpperCase() + " ";
                }
                sensorId = sensorId.trim();

                let sensor: Sensor = {id: sensorId, power: sensorPower}
                let measuredTemperature: MeasuredTemperature = {sensor: sensor, temperature: temp}

                // Temperature has only a one decimal precision. "toFixed()" will
                // make a pretty print for the temperature
                Log.info(measuredTemperature.sensor.id, "%s°C reported by sensor %d of %d",
                    measuredTemperature.temperature.toFixed(1), sensorNo, sensorTotal);

                InfluxDB2OutputService.saveMeasuredTemperatureAsync(measuredTemperature);
            })
        }
    });

}

startApplication();

//#endregion Script execution

