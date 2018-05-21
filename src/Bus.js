// @flow
/* eslint-disable flowtype/no-weak-types */
import i2c from 'i2c-bus';
import Bluebird from 'bluebird';
import PQueue from 'p-queue';

import BusError from './error/BusError';
import * as ERROR_CODES from './error/codes';

import type { BitType, ByteType, WordType, AddrType, CmdType } from './types';

/**
 * i2c Bus class. Wraps and promises the original `i2c-bus` library.
 * All the functions are promised and run through a queue without concurrency,
 * to prevent multiple access to the i2c bus.
 */

export default class Bus {
  bus: ?Object;
  busNumber: number;
  queue: { add: Function => Promise<*> };

  constructor(busNumber: number = 1) {
    this.busNumber = busNumber;
    this.bus = null;

    this.queue = new PQueue({ concurrency: 1 });
  }

  /**
   * Opens the bus connection
   */
  open(): Promise<void> {
    return new Bluebird((resolve: Function, reject: Function) => {
      this.bus = Bluebird.promisifyAll(i2c.open(this.busNumber, (error: Error) => {
        if (error) {
          reject(new BusError(`Error opening i2c bus: ${error.message}`, ERROR_CODES.OPENING_FAILURE, error));
        }

        resolve();
      }));
    });
  }

  /**
   * Adds operation to the promise queue. Do **not** call this function directly.
   *
   * @throws {BusError} If the bus connection is not open
   */
  addToQueue(fn: string, ...args: Array<*>): Promise<*> {
    return this.queue.add(() => {
      if (!this.bus) {
        throw new BusError('Bus is not open', ERROR_CODES.BUS_NOT_OPEN);
      }

      return this.bus[fn](...args);
    });
  }

  /**
   * Closes the bus connection
   */
  close(): Promise<void> {
    return this.addToQueue('closeAsync');
  }

  /** Determines functionality of the bus/adapter */
  i2cFuncs(): Promise<{[string]: number}> {
    return this.addToQueue('i2cFuncsAsync');
  }
  /**
   * Scans the I2C bus asynchronously for devices
   */
  scan(): Promise<Array<AddrType>> {
    return this.addToQueue('scanAsync');
  }

  /** Plain i2c read */
  read(addr: AddrType, length: number, buffer: Buffer): Promise<number> {
    return this.addToQueue('i2cReadAsync', addr, length, buffer);
  }
  /** Plain i2c write */
  write(addr: AddrType, length: number, buffer: Buffer): Promise<number> {
    return this.addToQueue('i2cWriteAsync', addr, length, buffer);
  }

  /** SMBus read byte */
  readByte(addr: AddrType, cmd: CmdType): Promise<ByteType> {
    return this.addToQueue('readByteAsync', addr, cmd);
  }
  /** SMBus read word */
  readWord(addr: AddrType, cmd: CmdType): Promise<WordType> {
    return this.addToQueue('readWordAsync', addr, cmd);
  }
  /** SMBus read number of bytes to buffer */
  readI2cBlock(addr: AddrType, cmd: CmdType, length: number, buffer: Buffer): Promise<number> {
    return this.addToQueue('readI2cBlockAsync', addr, cmd, length, buffer);
  }
  /** SMBus receive a byte */
  receiveByte(addr: AddrType): Promise<ByteType> {
    return this.addToQueue('receiveByteAsync', addr);
  }

  /** SMBus write a byte */
  writeByte(addr: AddrType, cmd: CmdType, byte: ByteType): Promise<void> {
    return this.addToQueue('writeByteAsync', addr, cmd, byte);
  }
  /** SMBus write a word */
  writeWord(addr: AddrType, cmd: CmdType, word: WordType): Promise<void> {
    return this.addToQueue('writeWordAsync', addr, cmd, word);
  }
  /** SMBus write number of bytes from buffer */
  writeI2cBlock(addr: AddrType, cmd: CmdType, length: number, buffer: Buffer): Promise<number> {
    return this.addToQueue('writeI2cBlockAsync', addr, cmd, length, buffer);
  }
  /** SMBus send a byte */
  sendByte(addr: AddrType, byte: ByteType): Promise<void> {
    return this.addToQueue('sendByteAsync', addr, byte);
  }
  /** SMBus write a single bit */
  writeQuick(addr: AddrType, bit: BitType): Promise<void> {
    return this.addToQueue('writeQuickAsync', addr, bit);
  }
}
