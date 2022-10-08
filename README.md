<div align="center">
   <h1>node-ds18b20-sensor</h1>
   <img src="https://raw.githubusercontent.com/amacado/node-ds18b20-sensor/main/docs/images/project-hero.png" alt="node-ds18b20-sensor" width="100%" />
   <h5>Read temperature sensor data and output result to various targets.</h5>
</div>

### Introduction
Read data from DS18B20 temperature sensor using Node.js® runtime and output the
result into various targets. Currently, the following outputs are supported:
- [InfluxDB](https://github.com/influxdata/influxdb) <img src="https://raw.githubusercontent.com/amacado/node-ds18b20-sensor/main/docs/images/influxdb-logo.png" height="10" />
- Console ([npm/npmlog](https://github.com/npm/npmlog))

### About

This is a personal project which I use in a house automation setup. Feel free to clone, fork and adjust it to your needs. If you have any question or want to add an additional output
target feel free to create an issue or pull request.

### Requirements/Hardware
* DS18B20 temperature sensor by [DIAMEX](https://www.diamex.de/dxshop/USB-Temperatur-Sensor-Tester-fuer-DS18B20-Rev-C) with AT90USB162 microcontroller (got it on [amazon.de](https://www.amazon.de/-/en/DS18B20-Temperature-Interface-Temperature-DS18B20-Waterproof-Stainless/dp/B018GQN5HE))

### Preparations & setup

#### Run the application

1. Copy [`config/config.sample.json5`](/config/config.sample.json5), rename it to `/path/to/config.json5` (default `/config/config.json5`) and paste API credentials and pfSense® URI (see [json5.org](https://json5.org/) for more information about the this next level json project)
2. Adjust settings in `config/config.json5` to your needs. The default values are defined in [`ConfigurationManager`](/src/helper/ConfigurationManager/index.ts)
3. Execute `yarn serve`

### Development or 'Go build yourself'
1. Install `yarn` package manager (see [yarnpkg.com](https://classic.yarnpkg.com/en/))
2. Clone this repository (`gh repo clone amacado/node-ds18b20-sensor`)
3. Install [libusb](https://libusb.info/) driver `apt-get install libusb-1.0-0` which is required to access the sensor device using the node package [node-hid/node-hid](https://github.com/node-hid/node-hid)
4. Execute `yarn install`
5. Execute `yarn serve` for TypeScript watcher
6. Execute `yarn build` to build the project and create production ready project in [/dist/](/dist/)
7. Setup [`pre-push` hook](https://www.atlassian.com/git/tutorials/git-hooks) with following script
   ```shell
   #!/bin/sh
   yarn build
   git add dist/
   git diff-index --quiet HEAD || git commit -m ":octocat: build sources via pre-push hook"
   
   exit 0
   ```

### Publishing new (npm package) version
This project follows [Semantic Versioning 2.0.0](https://semver.org/) with the help of[`np`](https://www.npmjs.com/package/np) CLI tool
to ensure quality.
```bash
yarn global add np
npm install np -g
```

Create a new version and publish (`np` is installed as dev-dependency):
```bash
np
```

### Known problems
##### Error `libusb-1.0.so.0: cannot open shared object file`

```bash
Error: libusb-1.0.so.0: cannot open shared object file: No such file or directory
```

This error occurs if you haven't installed [libusb](https://libusb.info/) driver `apt-get install libusb-1.0-0`.

##### Error `TypeError: cannot open device with path`

This error may occur when the current user is not allowed to access the attached sensor:

```bash
TypeError: cannot open device with path [...]
```

If you're running this script in a docker container you might want to check the [bindings](https://forums.balena.io/t/docker-container-cannot-access-dynamically-plugged-usb-devices/4277) and
`mount /dev:/dev` which allows the container to access the device.

##### Wrong/Untrusted measurements

Check your cable connection. 

### Credits

Special thanks to these projects and creators:

* [node-hid/node-hid](https://github.com/node-hid/node-hid)
* [npm/npmlog](https://github.com/npm/npmlog)
* [www.led-genial.de/USB-Temperatur-Sensor-Tester-fuer-DS18B20-Rev-E](https://www.led-genial.de/USB-Temperatur-Sensor-Tester-fuer-DS18B20-Rev-E)

<br /><br />
<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-black-magic.svg)](https://forthebadge.com)

</div>
