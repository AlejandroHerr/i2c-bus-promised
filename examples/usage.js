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
