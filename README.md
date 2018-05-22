# i2c-bus-promised [![CircleCI](https://circleci.com/gh/AlejandroHerr/i2c-bus-promised/tree/master.svg?style=svg)](https://circleci.com/gh/AlejandroHerr/scroll-phat-hd.js/tree/development)

[![Greenkeeper badge](https://badges.greenkeeper.io/AlejandroHerr/i2c-bus-promised.svg)](https://greenkeeper.io/)

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

## Usage

There's two main class exports in this library: `Bus` and `Device`.

`Bus` class wraps original `i2c-bus` methods and returns them promised, to make more comofrtable to work with them. The calls are queued to avoid blocking calls to the i2c bus.
`Device` class abstracts an `i2c` device.The class is initialised with two arguments, `bus` and `device address`. Internally it will call the reciprocal methods on the bus object with it's address.

<!--@snippet('./examples/usage.js', { showSource: true })-->
```js
// @flow
/* eslint-disable no-console */
import { Bus, Device } from '../src';
import type { AddrType, WordType } from '../src/types';

const main = async () => {
  const bus = new Bus();
  await bus.open();

  // Print bus info
  await Promise.all([
    bus.i2cFuncs().then((funcs: {[string]: number}) => console.log(JSON.stringify(funcs, null, 2))),
    bus.scan().then((devices: Array<AddrType>) => console.log(JSON.stringify(devices, null, 2))),
  ]);

  // Initizalize devices
  const weatherSensor = new Device(bus, 0x77);
  const lightSensor = new Device(bus, 0x1d);

  await weatherSensor.writeByte(0x23, 0b1 | 0b100);
  await lightSensor.writeByte(0x25, 0x0f);

  return Promise.all([
    weatherSensor.readWord(0x50),
    weatherSensor.readWord(0x52),
    lightSensor.readWord(0x30),
  ])
    .then(([temperature, pressure, light]: Array<WordType>) => {
      console.log(`The temperature is ${temperature}`);
      console.log(`The pressure is ${pressure}`);
      console.log(`The light is ${light}`);
    });
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
```

> File [./examples/usage.js](./examples/usage.js)
<!--/@-->

For more information, consult the [API docs](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/API.md)

### Extending Device

However, you can also extend the `Device` to work with your i2c devices:

<!--@snippet('./examples/extendingDevice.js', { showSource: true })-->
```js
// @flow
/* eslint-disable no-console */
import { Bus, Device } from '../src';
import type { ByteType, WordType } from '../src/types';

class WeatherSensor extends Device {
  constructor(bus: Bus) {
    super(bus, 0x72);
  }

  writeConfig(config: ByteType) {
    return this.writeByte(0x24, config);
  }

  readTemperature() {
    return this.readWord(0x50);
  }

  readPressure() {
    return this.readWord(0x52);
  }
}

const main = async () => {
  const bus = new Bus();
  const weatherSensor = new WeatherSensor(bus);

  await bus.open();

  await weatherSensor.writeConfig(0b1 | 0b100);

  return Promise.all([
    weatherSensor.readTemperature(),
    weatherSensor.readPressure(),
  ])
    .then(([temperature, pressure]: Array<WordType>) => {
      console.log(`The temperature is ${temperature}°C`);
      console.log(`The pressure is ${pressure}Pa`);
    });
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
```

> File [./examples/extendingDevice.js](./examples/extendingDevice.js)
<!--/@-->

For more information, consult the [API docs](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/API.md#device)

## Tests

To run the tests just type:

```bash
yarn test
```

However it is recomended to run the `e2e` tests to ensure that everything works well.

```bash
BUS_NUMBER=1 yarn test:e2e
```

### mock/createI2cBus

`createI2cBus` is a helper bus to be able to test your code using the library, and ensure that your code is doing what you want.

<!--@snippet('./examples/tests.js', { showSource: true })-->
```js
import { Bus } from '../src';

const BUS_NUMBER = 1;

jest.mock('i2c-bus', () => {
  const createI2cBus = require('../src/mock/createI2cBus').default; // eslint-disable-line global-require

  return createI2cBus({
    busNumber: 1,
    devices: {
      0x0f: Buffer.from(Array.from(Array(0xff).keys()).reverse()),
      0xf0: Buffer.from(Array.from(Array(0xff).keys())),
    },
    funcs: {
      read: 0x01,
      write: 0x02,
    },
  });
});

const setup = async (busNumber) => {
  const bus = new Bus(busNumber);

  await bus.open();

  return {
    bus,
    addToQueue: jest.spyOn(bus, 'addToQueue'),
    physicalBus: bus.bus.physicalBus,
  };
};

describe('Bus', () => {
  describe('i2cFuncs', () => {
    it('calls the i2cBus function through the promise queue', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const result = await bus.i2cFuncs();

      expect(addToQueue).toHaveBeenCalledWith('i2cFuncsAsync');
      expect(result).toBe(physicalBus.funcs);
    });
  });
  describe('scan', () => {
    it('calls the i2cBus function through the promise queue', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const result = await bus.scan();

      expect(addToQueue).toHaveBeenCalledWith('scanAsync');
      expect(result).toEqual(Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10)));
    });
  });
});
```

> File [./examples/tests.js](./examples/tests.js)
<!--/@-->

Be aware that you're working with a real device, the tests won't be much meaningful. And many things can fail _IRL_. It's always recommendable to write `e2e` tests to run in a real device.

<!--@dependencies()-->
## <a name="dependencies">Dependencies</a>

- [bluebird](https://github.com/petkaantonov/bluebird): Full featured Promises/A+ implementation with exceptionally good performance
- [i2c-bus](https://github.com/fivdi/i2c-bus): I2C serial bus access with Node.js
- [p-queue](undefined): Promise queue with concurrency control

<!--/@-->

## Documentation

[Read the API](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/API.md)

<!--@license()-->
## License

MIT © Alejandro Hernandez
<!--/@-->
