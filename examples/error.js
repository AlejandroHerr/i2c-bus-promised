// @flow
/* eslint-disable no-console */
import Bus from '../src/Bus';

const unknownBus = async () => {
  const bus = new Bus(5);

  try {
    await bus.open();
    await bus.scan();
    await bus.readByte(0x01, 0x01);
  } catch (error) {
    console.error('unknown bus', error);
  }
};

const unopenedBus = async () => {
  const bus = new Bus(1);

  try {
    await bus.scan().catch((error: Error) => {
      console.error('error');

      throw error;
    });
  } catch (error) {
    console.error('unopened bus', error);
  }
};

const nonexistenDevice = async () => {
  const bus = new Bus(1);

  try {
    await bus.open();
    await bus.readWord(0x01, 0x01);
  } catch (error) {
    console.error('non existent device', error);
  }
};

const einvall = async () => {
  const bus = new Bus(1);

  try {
    await bus.open();
    await bus.readWord(0x01); // eslint-disable-line flowtype-errors/show-errors
  } catch (error) {
    console.error('einvall', error);
  }
};

Promise.resolve()
  .then(async () => {
    await unknownBus();
    await unopenedBus();
    await nonexistenDevice();
    await einvall();
  })
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error.message);

    process.exit(1);
  });
