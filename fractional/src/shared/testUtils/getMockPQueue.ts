// TODO: delete this file and mock pqueue.
// More context:
// Ideally I'd just import PQueue from node_modules, but doing that caused
// "Cannot use import statement outside a module" error. After debugging for a while decided to
// opt in for a hacky-way to make it work, as I'm not really testing this lib but rather fetchLogsWithBlocks func
//

export const getMockPQueue = (): any => {
  const add = jest.fn().mockImplementation(async (func) => await func());
  const onIdle = jest.fn();
  const PQueue = { add, onIdle } as any;

  return PQueue;
};
