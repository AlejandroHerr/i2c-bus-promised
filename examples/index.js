// @flow
/* eslint-disable no-console */
import Bus from '../src/Bus';
import type { AddrType, CmdType } from '../src/types';

const printFunctions = (funcs: {[string]: number}) => {
  Object.entries(funcs).forEach(([name, cmd]: [string, mixed]) => {
    const realCmd: CmdType = typeof cmd === 'number' ? cmd : 0;

    console.info(`\t${name} --> 0x${realCmd.toString(16)}`);
  });
};

const printDevices = (devices: Array<AddrType>) => {
  console.info(`Available devices: ${devices.reduce(
    (display: string, addr: AddrType) =>
      `${display}, 0x${addr.toString(16)}`
    , '',
  )}`);
};

const main = async () => {
  const bus = new Bus();

  await bus.open();

  await bus.i2cFuncs().then(printFunctions);
  await bus.scan().then(printDevices);
};

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
