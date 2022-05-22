# node-ds18b20-sensor

<br />
<div align="center">
    <img src="https://raw.githubusercontent.com/amacado/node-ds18b20-sensor/main/docs/images/ds18b20-logo.png" alt="DS18B20" height="60" />
    <img src="https://raw.githubusercontent.com/amacado/node-ds18b20-sensor/main/docs/images/nodejs-logo.png" alt="Node.Js" height="60" />
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
5. Execute `yarn install`
6. Execute `yarn serve` for TypeScript watcher
7. Execute `yarn build` to build the project and create production ready project in [/dist/](/dist/)
8. Setup [`pre-push` hook](https://www.atlassian.com/git/tutorials/git-hooks) with following script
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

### Credits

Special thanks to these projects:

* [node-hid/node-hid](https://github.com/node-hid/node-hid)
* [npm/npmlog](https://github.com/npm/npmlog)

<br /><br />
<div align="center">

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/open-source.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-black-magic.svg)](https://forthebadge.com)

</div>
