import Bus from './Bus';

const BUS_NUMBER = 1;

jest.mock('i2c-bus', () => {
  const createI2cBus = require('./mock/createI2cBus').default; // eslint-disable-line global-require

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
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const result = await bus.i2cFuncs();

      expect(addToQueue).toHaveBeenCalledWith('i2cFuncsAsync');
      expect(result).toBe(physicalBus.funcs);
    });
  });
  describe('scan', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const result = await bus.scan();

      expect(addToQueue).toHaveBeenCalledWith('scanAsync');
      expect(result).toEqual(Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10)));
    });
  });
  describe('read', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const length = 5;
      const buffer = Buffer.alloc(length, 0);
      const result = await bus.read(deviceAddr, length, buffer);

      expect(addToQueue).toHaveBeenCalledWith('i2cReadAsync', deviceAddr, length, buffer);
      expect(result).toBe(length);
      expect(buffer.compare(device, 0, length)).toBe(0);
    });
  });
  describe('write', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const length = 5;
      const buffer = Buffer.from(Array.from(Array(length).keys()));
      const result = await bus.write(deviceAddr, length, buffer);

      expect(addToQueue).toHaveBeenCalledWith('i2cWriteAsync', deviceAddr, length, buffer);
      expect(result).toBe(length);
      expect(device.compare(buffer, 0, length, 0, length)).toBe(0);
    });
  });
  describe('readByte', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const cmd = 0x23;

      const result = await bus.readByte(deviceAddr, cmd);

      expect(addToQueue).toHaveBeenCalledWith('readByteAsync', deviceAddr, cmd);
      expect(result).toBe(device[cmd]);
    });
  });
  describe('readWord', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const cmd = 0x03;

      const result = await bus.readWord(deviceAddr, cmd);

      expect(addToQueue).toHaveBeenCalledWith('readWordAsync', deviceAddr, cmd);
      expect(result).toBe((device[cmd] << 8) + (device[cmd + 1]));
    });
  });
  describe('readI2cBlock', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const length = 5;
      const cmd = 0x30;
      const buffer = Buffer.alloc(length, 0);

      const result = await bus.readI2cBlock(deviceAddr, cmd, length, buffer);

      expect(addToQueue).toHaveBeenCalledWith('readI2cBlockAsync', deviceAddr, cmd, length, buffer);
      expect(result).toBe(length);
      expect(buffer.compare(device, cmd, cmd + length)).toBe(0);
    });
  });
  describe('receiveByte', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const result = await bus.receiveByte(deviceAddr);

      expect(addToQueue).toHaveBeenCalledWith('receiveByteAsync', deviceAddr);
      expect(result).toBe(device[0]);
    });
  });
  describe('writeByte', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const cmd = 0x23;
      const byte = 0xdd;

      await bus.writeByte(deviceAddr, cmd, byte);

      expect(addToQueue).toHaveBeenCalledWith('writeByteAsync', deviceAddr, cmd, byte);
      expect(device[cmd]).toBe(byte);
    });
  });
  describe('writeWord', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const cmd = 0x23;
      const word = 0xf0f0;

      await bus.writeWord(deviceAddr, cmd, word);

      expect(addToQueue).toHaveBeenCalledWith('writeWordAsync', deviceAddr, cmd, word);
      expect((device[cmd] << 8) + (device[cmd + 1])).toBe(word);
    });
  });
  describe('readI2cBlock', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const length = 5;
      const cmd = 0x30;
      const buffer = Buffer.alloc(length, 0);

      const result = await bus.readI2cBlock(deviceAddr, cmd, length, buffer);

      expect(addToQueue).toHaveBeenCalledWith('readI2cBlockAsync', deviceAddr, cmd, length, buffer);
      expect(result).toBe(length);
      expect(buffer.compare(device, cmd, cmd + length)).toBe(0);
    });
  });
  describe('writeI2cBlock', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const length = 5;
      const cmd = 0x30;
      const buffer = Buffer.from(Array.from(Array(length).keys()));

      const result = await bus.writeI2cBlock(deviceAddr, cmd, length, buffer);

      expect(addToQueue).toHaveBeenCalledWith('writeI2cBlockAsync', deviceAddr, cmd, length, buffer);
      expect(result).toBe(length);
      expect(device.compare(buffer, 0, length, cmd, cmd + length)).toBe(0);
    });
  });
  describe('sendByte', () => {
    it('calls the corresponding Bus function', async () => {
      const { bus, addToQueue, physicalBus } = await setup(BUS_NUMBER);

      const deviceAddr = Object.keys(physicalBus.devices).map(addr => parseInt(addr, 10))[0];
      const device = physicalBus.devices[deviceAddr];

      const byte = 0xdd;

      await bus.sendByte(deviceAddr, byte);

      expect(addToQueue).toHaveBeenCalledWith('sendByteAsync', deviceAddr, byte);
      expect(device[0]).toBe(byte);
    });
  });
});
