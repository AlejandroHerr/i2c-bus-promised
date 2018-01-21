// @flow
/* eslint-disable no-console */
import Bus from '../src/Bus';
import type { AddrType, CmdType } from '../src/types';

const bus = new Bus();

bus.i2cFuncs().then((funcs: {[string]: number}) => {
  console.info('i2c functions:');
  Object.entries(funcs).forEach(([name, cmd]: [string, mixed]) => {
    const realCmd: CmdType = typeof cmd === 'number' ? cmd : 0;
    console.info(`\t${name} --> 0x${realCmd.toString(16)}`);
  });
})
  .then(() => bus.scan())
  .then((addresses: Array<AddrType>) => {
    console.info(`Available devices: ${addresses.reduce((display: string, addr: AddrType) => `${display}, 0x${addr.toString(16)}`, '')}`);
  })
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
