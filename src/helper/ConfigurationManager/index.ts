const nconf = require('nconf');

nconf.env(); // allow `process.env` to override
nconf.argv(); // allow `process.argv` to override

// Expose --config argument for application which allows to overwrite
// the default location of the config file. This allows the package to be installed globally
// and exposes an argument to locate the configuration file anywhere on the system
const configFile = nconf.get('config') ?? 'config/config.json5';
nconf.file({file: configFile, format: require('json5')}); // load configuration from file

// default values for configuration (see config/config.sample.json5 for
// parameter description
nconf.defaults({
    "ds18b20": {
        "manufacturerId": 0x16C0,  // from sample console app source code (main.c) by led-genial.de
        "productId": 0x0480, // from sample console app source code (main.c) by led-genial.de
    },
    "driver": {
        "type": "hidraw" // Successor of libusb, see https://github.com/node-hid/node-hid#selecting-driver-type
    },
    "format": {
        "temperature": "C" // Sensor returns measured temperature in °C, but it can be converted to °F
    },
    "output": {
        "settings": {
            "interval": 300000 // set interval to >5 minutes between temperature savings
        },
        "influxdb2": {
            "enabled": false, // Enable/Disable influxdb2 output stream
            "url": null, // URL of the InfluxDB webservice
            "token": null, // Write access token for bucket
            "organisation": null, // Name of the InfluxDB organisation
            "bucket": null, // Name of the bucket where data is stored
        }
    }
});

nconf.required(["ds18b20:manufacturerId", "ds18b20:productId", "driver:type"]);

export = nconf;
