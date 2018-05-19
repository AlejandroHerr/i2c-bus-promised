// @flow
/* eslint-disable flowtype/no-weak-types */
import i2cBus from './i2cBus';

import type { PhysicalBusMockType } from './types';

/**
 * Mock to import `i2c-bus` library
 */
export default (physicalBus: PhysicalBusMockType): {
  open: (busNumber: number, cb: Function) => i2cBus,
} => ({
  open: (busNumber: number, cb: Function): i2cBus => {
    cb(null);

    return i2cBus(physicalBus, busNumber);
  },
});
