/**
 * Measure download speed using multiple parallel connections
 * This better saturates bandwidth and gives more accurate results
 * @param testFileUrl URL of test file to download
 * @param fileSizeBytes Expected file size in bytes per connection
 * @param connections Number of parallel connections (default: 4)
 * @returns {Promise<number>} download speed in Mbps
 */
// useSpeedTest.tsx

export const measureDownloadSpeed = async (
  testFileUrl: string,
  fileSizeBytes: number,
  connections: number = 4
): Promise<number> => {
  try {
    const startTime = Date.now();

    // Create multiple parallel download promises
    const downloadPromises = Array.from({ length: connections }, () =>
      fetch(testFileUrl).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download test file");
        }
        return response.blob();
      })
    );

    // Wait for all downloads to complete
    await Promise.all(downloadPromises);
    const endTime = Date.now();

    const totalBytes = fileSizeBytes * connections;
    const durationSeconds = (endTime - startTime) / 1000;
    const speedBps = totalBytes / durationSeconds;
    const speedMbps = (speedBps * 8) / 1_000_000; // Convert to Mbps

    return Math.round(speedMbps * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error("Error measuring download speed:", error);
    return -1;
  }
};

/**
 * Measure upload speed
 * Uploads test data and calculates speed
 * @param uploadEndpoint Server endpoint that accepts POST requests
 * @param dataSizeBytes Size of data to upload in bytes
 * @returns {Promise<number>} upload speed in Mbps
 */
export const measureUploadSpeed = async (
  uploadEndpoint: string,
  dataSizeBytes: number = 1_000_000 // 1MB default
): Promise<number> => {
  try {
    // Create dummy data to upload (React Native compatible)
    // Generate a string of random characters
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let dummyData = "";
    // Generate data in chunks to avoid stack overflow or memory issues with large strings
    const chunkSize = 1024;
    const chunks = Math.ceil(dataSizeBytes / chunkSize);

    for (let i = 0; i < chunks; i++) {
      let chunk = "";
      for (let j = 0; j < chunkSize && i * chunkSize + j < dataSizeBytes; j++) {
        chunk += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      dummyData += chunk;
    }

    const startTime = Date.now();
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      body: dummyData,
      headers: {
        "Content-Type": "text/plain",
        "Content-Length": dataSizeBytes.toString(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload test data");
    }

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const speedBps = dataSizeBytes / durationSeconds;
    const speedMbps = (speedBps * 8) / 1_000_000; // Convert to Mbps

    return Math.round(speedMbps * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error("Error measuring upload speed:", error);
    return -1;
  }
};

type Update = {
  instantaneousMbps: number; // current sample
  avgMbps: number; // EMA-smoothed
  elapsedSeconds: number;
  downloadedBytes: number;
};

export function useSpeedTest() {
  // Returns a function startTest(...) that accepts a callback to receive updates
  const startTest = async (
    testFileUrl: string,
    fileSizeBytes: number,
    onUpdate: (u: Update) => void,
    {
      connections = 3,
      sampleIntervalMs = 200,
      maxTestDurationMs = 15000,
      smoothingAlpha = 0.2,
    }: {
      connections?: number;
      sampleIntervalMs?: number;
      maxTestDurationMs?: number;
      smoothingAlpha?: number;
    } = {}
  ) => {
    // guard
    if (!testFileUrl) throw new Error("testFileUrl required");

    let xhrs: XMLHttpRequest[] = [];
    let lastTotalBytes = 0;
    let totalBytes = 0;
    const startTime = Date.now();
    let avgMbps = 0;
    let stopped = false;
    const speedSamples: number[] = []; // Store all samples

    // Per-XHR bytes (for debugging/internals)
    const bytesPerXhr = new Array(connections).fill(0);

    // Create XHRs
    for (let i = 0; i < connections; i++) {
      const xhr = new XMLHttpRequest();
      // add cache-buster to avoid cached responses
      const url = `${testFileUrl}${
        testFileUrl.includes("?") ? "&" : "?"
      }cb=${Date.now()}_${i}`;

      // If server provides content-length it will be in event.total
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer"; // or "blob"

      // onprogress gives partial bytes received
      xhr.onprogress = (evt: ProgressEvent) => {
        if (stopped) return;
        const loaded = evt.loaded || 0;
        bytesPerXhr[i] = loaded;
        // recompute total
        totalBytes = bytesPerXhr.reduce((a, b) => a + b, 0);
      };

      xhr.onerror = () => {
        // ignore single connection errors — we'll handle overall result later
      };

      xhr.onloadend = () => {
        // final loaded for this xhr already accounted in onprogress
      };

      xhr.send();
      xhrs.push(xhr);
    }

    // Sampling loop
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedSeconds = Math.max(0.001, elapsedMs / 1000);

      // bytes since last sample
      const deltaBytes = totalBytes - lastTotalBytes;
      lastTotalBytes = totalBytes;

      // instantaneous bps and Mbps
      const instantBps = deltaBytes / (sampleIntervalMs / 1000); // bytes per second
      const instantMbps = (instantBps * 8) / 1_000_000;
      
      if (instantMbps > 0) {
        speedSamples.push(instantMbps);
      }

      // rolling average (EMA)
      avgMbps = smoothingAlpha * instantMbps + (1 - smoothingAlpha) * avgMbps;

      onUpdate({
        instantaneousMbps: Math.round(instantMbps * 100) / 100,
        avgMbps: Math.round(avgMbps * 100) / 100,
        elapsedSeconds,
        downloadedBytes: totalBytes,
      });

      // Stop conditions: time exceeded or all xhrs finished or we've downloaded expected bytes
      const downloadedExpected = fileSizeBytes * connections;
      const allFinished = bytesPerXhr.every((b) => b > 0 && b >= fileSizeBytes);
      if (
        elapsedMs >= maxTestDurationMs ||
        allFinished ||
        totalBytes >= downloadedExpected
      ) {
        // finalize
        stopped = true;
        clearInterval(interval);
        // abort any still running xhrs
        xhrs.forEach((x) => {
          try {
            x.abort();
          } catch (e) {
            /* ignore */
          }
        });
      }
    }, sampleIntervalMs);

    // Return a promise that resolves when sampling stops
    return new Promise<{
      finalAvgMbps: number;
      totalBytes: number;
      elapsedSeconds: number;
    }>((resolve) => {
      const pollEnd = setInterval(() => {
        if (stopped) {
          clearInterval(pollEnd);
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          
          // Calculate arithmetic mean of all samples
          const sum = speedSamples.reduce((a, b) => a + b, 0);
          const finalAvg = speedSamples.length > 0 ? sum / speedSamples.length : 0;
          
          resolve({
            finalAvgMbps: Math.round(finalAvg * 100) / 100,
            totalBytes,
            elapsedSeconds,
          });
        }
      }, 100);
    });
  };

  return { startTest };
}

export function useUploadSpeedTest() {
  const startUploadTest = async (
    uploadEndpoint: string,
    dataSizeBytes: number,
    onUpdate: (u: Update) => void,
    {
      connections = 3,
      sampleIntervalMs = 200,
      maxTestDurationMs = 15000,
      smoothingAlpha = 0.2,
    }: {
      connections?: number;
      sampleIntervalMs?: number;
      maxTestDurationMs?: number;
      smoothingAlpha?: number;
    } = {}
  ) => {
    if (!uploadEndpoint) throw new Error("uploadEndpoint required");

    // Generate dummy data
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let dummyData = "";
    const chunkSize = 1024;
    const chunks = Math.ceil(dataSizeBytes / chunkSize);
    for (let i = 0; i < chunks; i++) {
      let chunk = "";
      for (let j = 0; j < chunkSize && i * chunkSize + j < dataSizeBytes; j++) {
        chunk += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      dummyData += chunk;
    }

    let xhrs: XMLHttpRequest[] = [];
    let lastTotalBytes = 0;
    let totalBytes = 0;
    const startTime = Date.now();
    let avgMbps = 0;
    let stopped = false;
    let lastLoaded = 0;
    const speedSamples: number[] = []; // Store all samples

    // Per-XHR bytes
    const bytesPerXhr = new Array(connections).fill(0);

    for (let i = 0; i < connections; i++) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadEndpoint, true);
      xhr.setRequestHeader("Content-Type", "text/plain");

      xhr.upload.onprogress = (evt: ProgressEvent) => {
        if (stopped) return;
        bytesPerXhr[i] = evt.loaded;
        totalBytes = bytesPerXhr.reduce((a, b) => a + b, 0);
        // console.log(`[Upload] XHR ${i} progress: ${evt.loaded}/${evt.total}`);
      };

      xhr.onloadend = () => {
        // console.log(`[Upload] XHR ${i} finished. Status: ${xhr.status}`);
        stopped = true;
      };

      xhr.onerror = () => {
        console.error(`[Upload] XHR ${i} error`);
        stopped = true;
      };

      xhr.send(dummyData);
      xhrs.push(xhr);
    }

    // Sampling loop
    const interval = setInterval(() => {
      if (stopped) {
        clearInterval(interval);
        return;
      }

      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedSeconds = Math.max(0.001, elapsedMs / 1000);

      const deltaBytes = totalBytes - lastLoaded;
      lastLoaded = totalBytes;

      const instantBps = deltaBytes / (sampleIntervalMs / 1000);
      const instantMbps = (instantBps * 8) / 1_000_000;
      
      if (instantMbps > 0) {
        speedSamples.push(instantMbps);
      }

      avgMbps = smoothingAlpha * instantMbps + (1 - smoothingAlpha) * avgMbps;

      console.log(
        `[Upload] Update: instant=${instantMbps.toFixed(
          2
        )} Mbps, avg=${avgMbps.toFixed(2)} Mbps, totalBytes=${totalBytes}`
      );

      onUpdate({
        instantaneousMbps: Math.round(instantMbps * 100) / 100,
        avgMbps: Math.round(avgMbps * 100) / 100,
        elapsedSeconds,
        downloadedBytes: totalBytes,
      });

      // Stop conditions
      const uploadedExpected = dataSizeBytes * connections;
      const allFinished = bytesPerXhr.every((b) => b > 0 && b >= dataSizeBytes);

      if (
        elapsedMs >= maxTestDurationMs ||
        allFinished ||
        totalBytes >= uploadedExpected
      ) {
        console.log("[Upload] Stopping test. Condition met.");
        stopped = true;
        clearInterval(interval);
        xhrs.forEach((x) => {
          try {
            x.abort();
          } catch (e) {
            /* ignore */
          }
        });
      }
    }, sampleIntervalMs);

    return new Promise<{
      finalAvgMbps: number;
      totalBytes: number;
      elapsedSeconds: number;
    }>((resolve) => {
      const pollEnd = setInterval(() => {
        if (stopped) {
          clearInterval(pollEnd);
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          
          // Calculate arithmetic mean of all samples
          const sum = speedSamples.reduce((a, b) => a + b, 0);
          const finalAvg = speedSamples.length > 0 ? sum / speedSamples.length : 0;

          console.log(
            `[Upload] Resolved. Final Avg: ${finalAvg.toFixed(2)} Mbps`
          );
          resolve({
            finalAvgMbps: Math.round(finalAvg * 100) / 100,
            totalBytes,
            elapsedSeconds,
          });
        }
      }, 100);
    });
  };

  return { startUploadTest };
}
