// @flow
/* eslint-disable flowtype/no-weak-types */
import i2c from 'i2c-bus';
import bluebird from 'bluebird';
import PQueue from 'p-queue';

import type { BitType, ByteType, WordType, AddrType, CmdType } from './types';

/**
 * i2c Bus class.
 * All the functions are promised and run through a queue without concurrency,
 * to prevent multiple access to the i2c bus.
 */
export default class Bus {
  bus: i2c;
  queue: { add: (void => any) => any}

  constructor(busNumber: number = 1) {
    this.bus = bluebird.promisifyAll(i2c.open(busNumber, (error: Error) => {
      if (error) {
        throw new Error(`Error opening i2c bus: ${error.message}`);
      }
    }));

    this.queue = new PQueue({ concurrency: 1 });
  }

  /**
   * Closes the bus connection
   */
  close(): Promise<void> {
    return this.queue.add(() => this.bus.closeAsync());
  }

  /** Determines functionality of the bus/adapter */
  i2cFuncs(): Promise<{[string]: number}> {
    return this.queue.add(() => this.bus.i2cFuncsAsync());
  }
  /**
   * Scans the I2C bus asynchronously for devices
   */
  scan(): Promise<Array<AddrType>> {
    return this.queue.add(() => this.bus.scanAsync());
  }

  /** Plain i2c read */
  read(addr: AddrType, length: number, buffer: Buffer): Promise<number> {
    return this.queue.add(() => this.bus.i2cReadAsync(addr, length, buffer));
  }
  /** Plain i2c write */
  write(addr: AddrType, length: number, buffer: Buffer): Promise<number> {
    return this.queue.add(() => this.bus.i2cWriteAsync(addr, length, buffer));
  }

  /** SMBus read byte */
  readByte(addr: AddrType, cmd: CmdType): Promise<ByteType> {
    return this.queue.add(() => this.bus.readByteAsync(addr, cmd));
  }
  /** SMBus read word */
  readWord(addr: AddrType, cmd: CmdType): Promise<WordType> {
    return this.queue.add(() => this.bus.readWordAsync(addr, cmd));
  }
  /** SMBus read number of bytes to buffer */
  readI2cBlock(addr: AddrType, cmd: CmdType, length: number, buffer: Buffer): Promise<number> {
    return this.queue.add(() => this.bus.readI2cBlockAsync(addr, cmd, length, buffer));
  }
  /** SMBus receive a byte */
  receiveByte(addr: AddrType): Promise<ByteType> {
    return this.queue.add(() => this.bus.receiveByteAsync(addr));
  }
  /** SMBus send a byte */
  sendByte(addr: AddrType, byte: ByteType): Promise<void> {
    return this.queue.add(() => this.bus.sendByteAsync(addr, byte));
  }
  /** SMBus write a byte */
  writeByte(addr: AddrType, cmd: CmdType, byte: ByteType): Promise<void> {
    return this.queue.add(() => this.bus.writeByteAsync(addr, cmd, byte));
  }
  /** SMBus write a word */
  writeWord(addr: AddrType, cmd: CmdType, word: WordType): Promise<void> {
    return this.queue.add(() => this.bus.writeWordAsync(addr, cmd, word));
  }
  /** SMBus write a single bit */
  writeQuick(addr: AddrType, bit: BitType): Promise<void> {
    return this.queue.add(() => this.bus.writeQuickAsync(addr, bit));
  }
  /** SMBus write number of bytes from buffer */
  writeI2cBlock(addr: AddrType, cmd: CmdType, length: number, buffer: Buffer): Promise<number> {
    return this.queue.add(() => this.bus.writeI2cBlockAsync(addr, cmd, length, buffer));
  }
}
