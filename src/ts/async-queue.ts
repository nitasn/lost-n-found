/**
 * Run the next task task when the previous one ends.
 * Good for DB transactions, etc.
 */
export function createAsyncQueue() {
  const queue = [];
  let isProcessingQueue = false;

  const processQueue = async () => {
    isProcessingQueue = true;
    while (queue.length) {
      const task = queue.shift();
      await task();
    }
    isProcessingQueue = false;
  };

  return (task: () => Promise<any>) => {
    queue.push(task);
    !isProcessingQueue && processQueue();
  };
}

/**
 * Creates a queue that limits to one ongoing async task, and one queued async task.
 * Subsequent tasks requested while there's a queued task are ignored.
 */
export function createReducedAsyncQueue() {
  let onGoingPromise = null;
  let anotherOneQueued = false;

  return async function schedule(func: () => Promise<void>) {
    if (!onGoingPromise) {
      onGoingPromise = (async () => {
        await func();
        onGoingPromise = null;
      })();
    } else {
      if (anotherOneQueued) return;
      anotherOneQueued = true;
      await onGoingPromise;
      anotherOneQueued = false;
      schedule(func);
    }
  };
}
