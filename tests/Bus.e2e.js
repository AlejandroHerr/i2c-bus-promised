import Bus from '../src/Bus';
import BusError from '../src/error/BusError';
import * as ERROR_CODES from '../src/error/codes';

const BUS_NUMBER = (process.env.BUS_NUMBER && parseInt(process.env.BUS_NUMBER, 10)) || 1;

const setup = async (busNumber) => {
  const bus = new Bus(busNumber);

  await bus.open();

  return {
    bus,
  };
};

describe('Bus', () => {
  describe('Errors', () => {
    it('should throw a BusError when the i2c bus is not open', async () => {
      const bus = new Bus(BUS_NUMBER);

      try {
        await bus.addToQueue('func');
      } catch (error) {
        const expectedError = new BusError('Bus is not open', ERROR_CODES.BUS_NOT_OPEN);

        expect(error).toEqual(expectedError);
        expect(error.code).toBe(expectedError.code);
        expect(error.causeError).toBeNull();
      }
    });
    it('should throw an error when the i2c bus does not exist', async () => {
      const busNumber = BUS_NUMBER + 1;
      const bus = new Bus(busNumber);

      try {
        await bus.open();
        await bus.i2cFuncs();
      } catch (error) {
        expect(error.message).toEqual(`ENOENT: no such file or directory, open '/dev/i2c-${busNumber}'`);
        expect(error.code).toBe('ENOENT');
      }
    });
    it('should throw an error when there is no device in the address', async () => {
      const bus = new Bus(BUS_NUMBER);

      try {
        await bus.open();
        await bus.read(0x00, 5, Buffer.alloc(5, 0));
      } catch (error) {
        expect(error.message).toEqual('EREMOTEIO: remote I/O error, read');
        expect(error.code).toBe('EREMOTEIO');
      }
    });
  });
  describe('Functions', () => {
    it('should reeturn list of i2c funcs', async () => {
      const { bus } = await setup(BUS_NUMBER);

      const result = await bus.i2cFuncs();

      const entries = Object.entries(result);

      expect(entries.length).toBeGreaterThan(0);
      entries.forEach(([func, value]) => {
        expect(typeof func).toBe('string');
        expect(typeof value).toBe('number');
      });
    });
    it('should return addresses of devices', async () => {
      const { bus } = await setup(BUS_NUMBER);

      const result = await bus.scan();

      expect(result.length).toBeGreaterThan(0);
      result.forEach((address) => {
        expect(typeof address).toBe('number');
      });
    });
  });
});
