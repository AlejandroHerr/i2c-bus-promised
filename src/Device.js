// @flow
import type Bus from './Bus';
import type { BitType, ByteType, WordType, AddrType, CmdType } from './types';

/**
 * i2c device base class.
 */
export default class Device {
  address: AddrType;
  bus: Bus;

  constructor(bus: Bus, address: number) {
    this.bus = bus;
    this.address = address;
  }

  /** Plain i2c read */
  read(length: number, buffer: Buffer): Promise<number> {
    return this.bus.read(this.address, length, buffer);
  }
  /** Plain i2c write */
  write(length: number, buffer: Buffer): Promise<number> {
    return this.bus.write(this.address, length, buffer);
  }

  /** SMBus read byte */
  readByte(cmd: CmdType): Promise<ByteType> {
    return this.bus.readByte(this.address, cmd);
  }
  /** SMBus read number of bytes to buffer */
  readI2cBlock(cmd: CmdType, length: number, buffer: Buffer): Promise<number> {
    return this.bus.readI2cBlock(this.address, cmd, length, buffer);
  }
  /** SMBus read word */
  readWord(cmd: CmdType): Promise<WordType> {
    return this.bus.readWord(this.address, cmd);
  }
  /** SMBus receive a byte */
  receiveByte(): Promise<ByteType> {
    return this.bus.receiveByte(this.address);
  }

  /** SMBus send a byte to the device's address */
  sendByte(byte: ByteType): Promise<void> {
    return this.bus.sendByte(this.address, byte);
  }
  /** SMBus write a byte to the device's address */
  writeByte(cmd: CmdType, byte: ByteType): Promise<void> {
    return this.bus.writeByte(this.address, cmd, byte);
  }
  /** SMBus write number of bytes from buffer to the device's address */
  writeI2cBlock(cmd: CmdType, length: number, buffer: Buffer): Promise<number> {
    return this.bus.writeI2cBlock(this.address, cmd, length, buffer);
  }
  /** SMBus write a single bit to the device's address */
  writeQuick(bit: BitType): Promise<void> {
    return this.bus.writeQuick(this.address, bit);
  }
  /** SMBus write a word to the device's address */
  writeWord(cmd: CmdType, word: WordType): Promise<void> {
    return this.bus.writeWord(this.address, cmd, word);
  }
}
