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
});

nconf.required([]);

export = nconf;
