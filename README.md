# node-ds18b20-sensor

<br />
<div align="center">
    <img src="https://raw.githubusercontent.com/amacado/node-ds18b20-sensor/main/docs/images/ds18b20-logo.png" alt="DS18B20" height="120" />
    <img src="https://raw.githubusercontent.com/amacado/node-ds18b20-sensor/main/docs/images/nodejs-logo.png" alt="Node.Js" height="120" />
</div>

### Introduction

Read data from DS18B20 temperature sensor using Node.js® runtime

### Requirements

* DS18B20 temperature sensor by [DIAMEX](https://www.diamex.de/dxshop/USB-Temperatur-Sensor-Tester-fuer-DS18B20-Rev-C)

### Preparations & setup

#### Run the application

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
