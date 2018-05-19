// @flow
import type { AddrType } from '../types';

/**
 * Type representing i2c-bus errors
 */
export type PhysicalBusErrorType = Error & { errno?: number, cause?: Error};

/**
 * Type representing the data used to mock the i2c bus
 */
export type PhysicalBusMockType = {
  busNumber: number,
  devices: {[AddrType]: Buffer},
  funcs: {[string]: number},
};
