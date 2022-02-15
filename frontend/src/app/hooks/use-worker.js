import { wrap, releaseProxy } from "comlink";
import { useEffect, useMemo } from "react";

export function useWorker() {
  // memoise a worker so it can be reused; create one worker up front
  // and then reuse it subsequently; no creating new workers each time
  //for future improvements, find a way to stablaize web worker creation to once per graph. 
  // currently, it is inefficient and upon mounting the component, will load 2 web workers
  //and not remove the previous one.
  const workerApiAndCleanup = useMemo(() => makeWorkerApiAndCleanup(), []);
  useEffect(() => {
    const { cleanup } = workerApiAndCleanup;

    // cleanup our worker when we're done with it
    return () => {
      cleanup();
    };
  }, [workerApiAndCleanup]);

  return workerApiAndCleanup;
}
/**
 * Creates a worker, a cleanup function and returns it
 */
 function makeWorkerApiAndCleanup() {

    // Here we create our worker and wrap it with comlink so we can interact with it
    let worker = new Worker(new URL("../../workers", {
      name: "parseData",
      type: "module"
    }));
    const workerApi = wrap(worker);
    // A cleanup function that releases the comlink proxy and terminates the worker
    const cleanup = () => {
      workerApi[releaseProxy]();
      if(!worker) return
      worker.terminate();
      worker = undefined
    };
  
    const workerApiAndCleanup = { workerApi, cleanup };
  
    return workerApiAndCleanup;
  }