// @flow
/* eslint-disable flowtype/no-weak-types */
import type { AddrType, CmdType, BitType, ByteType, WordType } from '../types';
import type { PhysicalBusMockType } from './types';

const checkConnection = (physicalBus: PhysicalBusMockType, busNumber: number, addr?: AddrType) => {
  if (busNumber !== physicalBus.busNumber) {
    const error = new Error(`ENOENT: no such file or directory, open '/dev/i2c-${1}'`);
    // $FlowFixMe
    error.code = 'ENOENT';

    throw error;
  }

  if (addr && !physicalBus.devices[addr]) {
    const error = new Error('EREMOTEIO: remote I/O error, read');
    // $FlowFixMe
    error.code = 'EREMOTEIO';

    throw error;
  }
};

/**
 * i2cBus mock
 */
export default (physicalBus: PhysicalBusMockType, busNumber: number = 1) => {
  const { devices, funcs } = physicalBus;

  return {
    physicalBus,
    i2cFuncs: (cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber);

        return cb(null, funcs);
      } catch (error) {
        return cb(error);
      }
    },
    scan: (cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber);

        const res = Object.keys(devices).map((addr: string) => parseInt(addr, 10));

        return cb(null, res);
      } catch (error) {
        return cb(error);
      }
    },
    i2cRead: (addr: AddrType, length: number, buffer: Buffer, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const bytes = devices[addr].copy(buffer, 0, 0, length);
        return cb(null, bytes, buffer);
      } catch (error) {
        return cb(error);
      }
    },
    i2cWrite: (addr: AddrType, length: number, buffer: Buffer, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const bytes = buffer.copy(devices[addr], 0, 0, length);

        return cb(null, bytes, buffer);
      } catch (error) {
        return cb(error);
      }
    },
    readByte: (addr: AddrType, cmd: CmdType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const res = devices[addr][cmd];

        return cb(null, res);
      } catch (error) {
        return cb(error);
      }
    },
    readWord: (addr: AddrType, cmd: CmdType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const res = (devices[addr][cmd] << 8) + devices[addr][cmd + 1];

        return cb(null, res);
      } catch (error) {
        return cb(error);
      }
    },
    readI2cBlock: (addr: AddrType, cmd: CmdType, length: number, buffer: Buffer, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const bytes = devices[addr].copy(buffer, 0, cmd, cmd + length);

        return cb(null, bytes, buffer);
      } catch (error) {
        return cb(error);
      }
    },
    receiveByte: (addr: AddrType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        return cb(null, devices[addr][0]);
      } catch (error) {
        return cb(error);
      }
    },

    writeQuick: (addr: AddrType, bit: BitType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        devices[addr][0] = (devices[addr][0] & 0xFE) | (0x01 & bit);

        return cb(null);
      } catch (error) {
        return cb(error);
      }
    },
    writeByte: (addr: AddrType, cmd: CmdType, byte: ByteType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        devices[addr][cmd] = byte;

        return cb(null);
      } catch (error) {
        return cb(error);
      }
    },
    writeWord: (addr: AddrType, cmd: CmdType, word: WordType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const hByte = word >>> 8; // Upper byte
        const lByte = word & 0x00ff; // Lower byte

        devices[addr][cmd] = hByte;
        devices[addr][cmd + 1] = lByte;

        return cb(null);
      } catch (error) {
        return cb(error);
      }
    },
    writeI2cBlock: (addr: AddrType, cmd: CmdType, length: number, buffer: Buffer, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        const bytes = buffer.copy(devices[addr], cmd, 0, length);

        return cb(null, bytes, buffer);
      } catch (error) {
        return cb(error);
      }
    },
    sendByte: (addr: AddrType, byte: ByteType, cb: Function) => {
      try {
        checkConnection(physicalBus, busNumber, addr);

        devices[addr][0] = byte;

        return cb(null);
      } catch (error) {
        return cb(error);
      }
    },
  };
};
