"use strict";
var _a;
const nconf = require('nconf');
nconf.env();
nconf.argv();
const configFile = (_a = nconf.get('config')) !== null && _a !== void 0 ? _a : 'config/config.json5';
nconf.file({ file: configFile, format: require('json5') });
nconf.defaults({
    "ds18b20": {
        "manufacturerId": 0x16C0,
        "productId": 0x0480,
    },
    "driver": {
        "type": "hidraw"
    },
    "format": {
        "temperature": "C"
    },
    "output": {
        "settings": {
            "interval": 300000
        },
        "influxdb2": {
            "enabled": false,
            "url": null,
            "token": null,
            "organisation": null,
            "bucket": null,
        }
    }
});
nconf.required(["ds18b20:manufacturerId", "ds18b20:productId", "driver:type"]);
module.exports = nconf;
