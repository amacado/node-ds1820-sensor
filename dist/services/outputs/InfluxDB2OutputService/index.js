"use strict";
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
const influxdb_client_1 = require("@influxdata/influxdb-client");
const ConfigurationManager_1 = __importDefault(require("../../../helper/ConfigurationManager"));
const Log_1 = __importDefault(require("../../../helper/Log"));
class InfluxDB2OutputService {
    static saveMeasuredTemperatureAsync(measuredTemperature) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputInfluxdb2Enabled = Boolean(ConfigurationManager_1.default.get('output:influxdb2:enabled'));
            const outputInfluxdb2Url = ConfigurationManager_1.default.get('output:influxdb2:url');
            const outputInfluxdb2Token = ConfigurationManager_1.default.get('output:influxdb2:token');
            const outputInfluxdb2Organisation = ConfigurationManager_1.default.get('output:influxdb2:organisation');
            const outputInfluxdb2Bucket = ConfigurationManager_1.default.get('output:influxdb2:bucket');
            if (outputInfluxdb2Enabled) {
                try {
                    const influxDB = new influxdb_client_1.InfluxDB({ url: outputInfluxdb2Url, token: outputInfluxdb2Token });
                    const influxDBWriteApi = influxDB.getWriteApi(outputInfluxdb2Organisation, outputInfluxdb2Bucket);
                    const influxTemperaturePoint = new influxdb_client_1.Point('temperature')
                        .tag('sensor_id', measuredTemperature.sensor.id)
                        .tag('sensor_name', '')
                        .floatField('degrees', measuredTemperature.temperature);
                    influxDBWriteApi.writePoint(influxTemperaturePoint);
                    influxDBWriteApi
                        .close()
                        .then(() => {
                        Log_1.default.verbose('InfluxDB2', 'Measure successfully transmitted to host');
                    })
                        .catch(e => {
                        Log_1.default.warn('InfluxDB2', e.toString());
                    });
                }
                catch (e) {
                    Log_1.default.warn('InfluxDB2', e.toString());
                }
            }
        });
    }
}
exports.default = InfluxDB2OutputService;
