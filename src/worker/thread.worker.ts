import { parentPort, workerData } from "worker_threads";

/**
 * Simulating CPU intensive work
 * Replace with real logic like image processing, PDF parsing etc.
 */

function heavyComputation(data: any) {
  let result = 0;

  for (let i = 0; i < 1e8; i++) {
    result += i;
  }

  return {
    type: data.type,
    payload: data,
    result,
    completedAt: new Date().toISOString(),
  };
}

const output = heavyComputation(workerData);

parentPort?.postMessage(output);