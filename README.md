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

### Bus

Bus is a class that wraps original `i2c-bus` methods and returns them promised. Besides that, the calls are queued to avoid blocking calls to the i2c bus. Example:

<!--@snippet('./examples/index.js', { showSource: true })-->
```js
// @flow
/* eslint-disable no-console */
import { Bus } from '../src';
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

For more information, consult the [API docs](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/API.md#bus)

### Device

Device is a class that abstracts an i2c device. The class is initialised with two arguments, `bus` and `device address`. Internally it will call the reciprocal methods on the bus object with it's address.

However, it's main purposed is to be extended for different devices. As you can see in this example:

<!--@snippet('./examples/device.js', { showSource: true })-->
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

> File [./examples/device.js](./examples/device.js)
<!--/@-->

For more information, consult the [API docs](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/API.md#device)

### mock/createI2cBus

`createI2cBus` is a helper bus to be able to test your code using the library, and ensure that your code is doing what you want.

<!--@snippet('./examples/tests.js', { showSource: true })-->
```js
import { Bus } from '../src';
import BusError from '../src/error/BusError';

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
  it('throws a bus error if cannot open the bus', async () => {
    const bus = new Bus(45);

    try {
      await bus.open();
    } catch (error) {
      expect(error).toEqual(new BusError('Error opening i2c bus: '));
    }
  });
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

## Changelog

[Read the changelog](https://github.com/AlejandroHerr/i2c-bus-promised/blob/master/CHANGELOG.md)

<!--@license()-->
## License

MIT © Alejandro Hernandez
<!--/@-->
