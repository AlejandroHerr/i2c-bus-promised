import Bus from '../src/Bus';
import Device from '../src/Device';

jest.mock('i2c-bus', () => {
  const createI2cBus = require('../src/mock/createI2cBus').default; // eslint-disable-line global-require

  return createI2cBus({ busNumber: 1, devices: { 0x01: Buffer.from([]) } });
});

const setup = (address) => {
  const bus = new Bus();
  const device = new Device(bus, address);

  return {
    bus,
    device,
  };
};

describe('Device', () => {
  describe('read', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const readSpy = jest.spyOn(bus, 'read');

      const length = 4;
      const buffer = Buffer.from([]);

      await device.read(length, buffer);

      expect(readSpy).toHaveBeenCalledWith(address, length, buffer);
    });
  });
  describe('write', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const writeSpy = jest.spyOn(bus, 'write');

      const length = 4;
      const buffer = Buffer.from([]);

      await device.write(length, buffer);

      expect(writeSpy).toHaveBeenCalledWith(address, length, buffer);
    });
  });
  describe('readByte', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const readSpy = jest.spyOn(bus, 'readByte');

      const cmd = 0x22;

      await device.readByte(cmd);

      expect(readSpy).toHaveBeenCalledWith(address, cmd);
    });
  });
  describe('readWord', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const readWordSpy = jest.spyOn(bus, 'readWord');

      const cmd = 0x22;

      await device.readWord(cmd);

      expect(readWordSpy).toHaveBeenCalledWith(address, cmd);
    });
  });
  describe('readI2cBlock', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const readI2cBlockSpu = jest.spyOn(bus, 'readI2cBlock');

      const cmd = 0x22;
      const length = 4;
      const buffer = Buffer.from([]);

      await device.readI2cBlock(cmd, length, buffer);

      expect(readI2cBlockSpu).toHaveBeenCalledWith(address, cmd, length, buffer);
    });
  });
  describe('receiveByte', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const receiveByteSpy = jest.spyOn(bus, 'receiveByte');

      await device.receiveByte();

      expect(receiveByteSpy).toHaveBeenCalledWith(address);
    });
  });
  describe('writeQuick', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const writeQuickSpy = jest.spyOn(bus, 'writeQuick');

      const bit = 0x1;

      await device.writeQuick(bit);

      expect(writeQuickSpy).toHaveBeenCalledWith(address, bit);
    });
  });
  describe('writeByte', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const writeByteSpy = jest.spyOn(bus, 'writeByte');

      const cmd = 0x22;
      const byte = 0x10;

      await device.writeByte(cmd, byte);

      expect(writeByteSpy).toHaveBeenCalledWith(address, cmd, byte);
    });
  });
  describe('writeWord', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const writeWordSpy = jest.spyOn(bus, 'writeWord');

      const cmd = 0x22;
      const byte = 0x10;

      await device.writeWord(cmd, byte);

      expect(writeWordSpy).toHaveBeenCalledWith(address, cmd, byte);
    });
  });
  describe('writeI2cBlock', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const writeI2cBlockSpy = jest.spyOn(bus, 'writeI2cBlock');

      const cmd = 0x22;
      const length = 4;
      const buffer = Buffer.from([]);

      await device.writeI2cBlock(cmd, length, buffer);

      expect(writeI2cBlockSpy).toHaveBeenCalledWith(address, cmd, length, buffer);
    });
  });
  describe('sendByte', () => {
    it('calls the corresponding Bus function', async () => {
      const address = 0x01;
      const { bus, device } = setup(address);

      await bus.open();

      const sendByteSpy = jest.spyOn(bus, 'sendByte');

      const byte = 0x10;

      await device.sendByte(byte);

      expect(sendByteSpy).toHaveBeenCalledWith(address, byte);
    });
  });
});
