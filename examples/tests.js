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
