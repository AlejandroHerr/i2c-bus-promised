import createI2cBus from '../src/mock/createI2cBus';

const setup = (busNumber = 1) => createI2cBus({
  busNumber: 1,
  devices: {
    0x0f: Buffer.from(Array.from(Array(0xff).keys()).reverse()),
    0xf0: Buffer.from(Array.from(Array(0xff).keys())),
  },
  funcs: {
    read: 0x01,
    write: 0x02,
  },
}).open(busNumber, () => null);

describe('createI2cBus', () => {
  describe('Errors', () => {
    it('should throw an error when the i2c bus does not exist', async () => {
      const i2cBus = setup(2);
      try {
        await new Promise((resolve, reject) => {
          i2cBus.i2cFuncs((err, res) => {
            if (err) {
              return reject(err);
            }

            return resolve(res);
          });
        });
      } catch (error) {
        expect(error.message).toEqual(`ENOENT: no such file or directory, open '/dev/i2c-${1}'`);
        expect(error.code).toBe('ENOENT');
      }
    });
    it('should throw an error when there is no device in the address', async () => {
      const i2cBus = setup();
      try {
        await new Promise((resolve, reject) => {
          i2cBus.i2cRead(0x01, 5, Buffer.alloc(5, 0), (err, res) => {
            if (err) {
              return reject(err);
            }

            return resolve(res);
          });
        });
      } catch (error) {
        expect(error.message).toEqual('EREMOTEIO: remote I/O error, read');
        expect(error.code).toBe('EREMOTEIO');
      }
    });
  });
});
