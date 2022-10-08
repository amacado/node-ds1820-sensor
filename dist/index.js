#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationManager_1 = __importDefault(require("./helper/ConfigurationManager"));
const Log_1 = __importDefault(require("./helper/Log"));
const hid = __importStar(require("node-hid"));
const SensorPower_1 = require("./enums/SensorPower");
const InfluxDB2OutputService_1 = __importDefault(require("./services/outputs/InfluxDB2OutputService"));
Log_1.default.verbose('', 'Import of libraries, types and classes completed.');
Log_1.default.verbose('', 'Start loading configuration and default settings..');
const ds18b20ManufacturerId = ConfigurationManager_1.default.get('ds18b20:manufacturerId');
const ds18b20ProductId = ConfigurationManager_1.default.get('ds18b20:productId');
const driverType = ConfigurationManager_1.default.get('driver:type');
const formatTemperature = ConfigurationManager_1.default.get('format:temperature');
Log_1.default.verbose('', 'Loading configuration and default settings completed.');
function toHex(value) {
    let hex = value.toString(16);
    if ((hex.length % 2) > 0) {
        hex = "0" + hex;
    }
    return hex;
}
function celsiusToFahrenheit(tempCelsius) {
    let tempFahrenheit = tempCelsius * 9 / 5 + 32;
    return tempFahrenheit;
}
function startApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        Log_1.default.verbose('', 'Executing function %s', 'startApplication');
        hid.setDriverType(driverType);
        let hidDevices = hid.devices(ds18b20ManufacturerId, ds18b20ProductId);
        if (hidDevices.length == 0) {
            Log_1.default.error('', 'No DS18B20 sensor found. Script execution aborted.');
            return;
        }
        Log_1.default.verbose('', 'Found %d DS18B20 devices:', hidDevices.length);
        hidDevices.map((deviceInfo => {
            Log_1.default.verbose(deviceInfo.serialNumber ? deviceInfo.serialNumber : '', "%s (%s): %s (%s) release %s (%s)", deviceInfo.manufacturer, deviceInfo.vendorId, deviceInfo.product, deviceInfo.productId, deviceInfo.release, deviceInfo.path);
        }));
        hidDevices.forEach(function (deviceInfo) {
            if (deviceInfo && deviceInfo.path) {
                var device = new hid.HID(deviceInfo.path);
                device.on('data', function (dataBuffer) {
                    let sensorTotal = dataBuffer[0];
                    let sensorNo = dataBuffer[1];
                    let sensorPower = dataBuffer[2] ? SensorPower_1.SensorPower.Extern : SensorPower_1.SensorPower.Parasite;
                    let temp = dataBuffer[4] + (256 * dataBuffer[5]);
                    temp = temp > 32767 ? (65536 - temp) * -1 : temp;
                    temp = temp / 10.0;
                    let sensorId = '';
                    for (let i = 0x08; i < 0x10; i++) {
                        sensorId += toHex(dataBuffer[i]).toUpperCase() + " ";
                    }
                    sensorId = sensorId.trim();
                    let sensor = { id: sensorId, power: sensorPower };
                    let measuredTemperature = { sensor: sensor, temperature: temp };
                    Log_1.default.info(measuredTemperature.sensor.id, "%s°C reported by sensor %d of %d", measuredTemperature.temperature.toFixed(1), sensorNo, sensorTotal);
                    InfluxDB2OutputService_1.default.saveMeasuredTemperatureAsync(measuredTemperature);
                });
            }
        });
    });
}
startApplication();
