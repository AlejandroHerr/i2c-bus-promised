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
