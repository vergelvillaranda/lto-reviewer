export interface SerializedOperationQueue {
  enqueue: <Result>(operation: () => Promise<Result>) => Promise<Result>;
  waitForIdle: () => Promise<void>;
}

export function createSerializedOperationQueue(): SerializedOperationQueue {
  let pendingOperations: Promise<void> = Promise.resolve();

  return {
    enqueue: <Result>(operation: () => Promise<Result>) => {
      const result = pendingOperations.then(operation);
      pendingOperations = result.then(
        () => undefined,
        () => undefined,
      );
      return result;
    },
    waitForIdle: () => pendingOperations,
  };
}
