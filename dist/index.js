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
const Log_1 = __importDefault(require("./helper/Log"));
const hid = __importStar(require("node-hid"));
Log_1.default.verbose('', 'Import of libraries, types and classes completed.');
Log_1.default.verbose('', 'Start loading configuration and default settings..');
Log_1.default.verbose('', 'Loading configuration and default settings completed.');
function toHex(value) {
    let hex = value.toString(16);
    if ((hex.length % 2) > 0) {
        hex = "0" + hex;
    }
    return hex;
}
function startApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        Log_1.default.verbose('', 'Executing function %s', 'startApplication');
        if (process.argv[2]) {
            hid.setDriverType('hidraw');
        }
        const vendorId = 0x16C0;
        const productId = 0x0480;
        let hidDevices = hid.devices(vendorId, productId);
        if (hidDevices.length == 0)
            Log_1.default.error('', 'No DS1820 device found');
        hidDevices.forEach(function (deviceInfo) {
            if (deviceInfo && deviceInfo.path) {
                var device = new hid.HID(deviceInfo.path);
                device.on('data', function (dataBuffer) {
                    let temp = dataBuffer[4];
                    let sensorNo = dataBuffer[1];
                    let sensorTotal = dataBuffer[0];
                    let power = dataBuffer[2] ? "Extern" : "Parasite";
                    let sensorSerial = '';
                    for (let i = 0x08; i < 0x10; i++) {
                        sensorSerial += toHex(dataBuffer[i]).toUpperCase() + " ";
                    }
                    Log_1.default.info('', "Sensor %d of %d %f°C %s %s", sensorNo, sensorTotal, temp / 10.0, power, sensorSerial);
                });
            }
        });
    });
}
startApplication();
