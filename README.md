# i2c-bus-promised [![CircleCI](https://circleci.com/gh/AlejandroHerr/i2c-bus-promised/tree/master.svg?style=svg)](https://circleci.com/gh/AlejandroHerr/scroll-phat-hd.js/tree/development)
[![Greenkeeper badge](https://badges.greenkeeper.io/AlejandroHerr/i2c-bus-promised.svg?style=flat-square)](https://greenkeeper.io/)

<!--@shields.flatSquare('deps','devDeps')-->
[![dependency status](https://img.shields.io/david/AlejandroHerr/i2c-bus-promised/master.svg?style=flat-square)](https://david-dm.org/AlejandroHerr/i2c-bus-promised/master) [![devDependency status](https://img.shields.io/david/dev/AlejandroHerr/i2c-bus-promised/master.svg?style=flat-square)](https://david-dm.org/AlejandroHerr/i2c-bus-promised/master#info=devDependencies)
<!--/@-->

Wrapper for [i2c-bus](https://github.com/fivdi/i2c-bus), with promised functions.

<!--@installation()-->
## Installation

```sh
npm install --save i2c-bus-promised
```
<!--/@-->

<!--@dependencies()-->
## <a name="dependencies">Dependencies</a>

- [bluebird](https://github.com/petkaantonov/bluebird): Full featured Promises/A+ implementation with exceptionally good performance
- [i2c-bus](https://github.com/fivdi/i2c-bus): I2C serial bus access with Node.js
- [p-queue](undefined): Promise queue with concurrency control

<!--/@-->

## Examples

<!--@snippet('./examples/index.js', { showSource: true })-->
```js
// @flow
/* eslint-disable no-console */
import Bus from '../src/Bus';
import type { AddrType, CmdType } from '../src/types';

const printFunctions = (funcs: {[string]: number}) => {
  Object.entries(funcs).forEach(([name, cmd]: [string, mixed]) => {
    const realCmd: CmdType = typeof cmd === 'number' ? cmd : 0;

    console.info(`\t${name} --> 0x${realCmd.toString(16)}`);
  });
};

const printDevices = (devices: Array<AddrType>) => {
  console.info(`Available devices: ${devices.reduce(
    (display: string, addr: AddrType) =>
      `${display}, 0x${addr.toString(16)}`
    , '',
  )}`);
};

const main = async () => {
  const bus = new Bus();

  await bus.open();

  await bus.i2cFuncs().then(printFunctions);
  await bus.scan().then(printDevices);
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
```

> File [./examples/index.js](./examples/index.js)
<!--/@-->

## Documentation

[Read the API](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/API.md)

## Changelog

[Read the changelog](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/CHANGELOG.md)

## License

MIT © Alejandro Hernandez
