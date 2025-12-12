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
  progress: number;
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

      // Calculate progress based on the connection that is furthest ahead (since we stop when ANY finishes)
      const maxConnectionBytes = Math.max(...bytesPerXhr);
      const progress = Math.min(1, maxConnectionBytes / fileSizeBytes);

      onUpdate({
        instantaneousMbps: Math.round(instantMbps * 100) / 100,
        avgMbps: Math.round(avgMbps * 100) / 100,
        elapsedSeconds,
        downloadedBytes: totalBytes,
        progress,
      });

      // Stop conditions: time exceeded or ANY xhrs finished or we've downloaded expected bytes
      const downloadedExpected = fileSizeBytes * connections;
      const anyFinished = bytesPerXhr.some((b) => b >= fileSizeBytes);
      if (
        elapsedMs >= maxTestDurationMs ||
        anyFinished ||
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
          const finalAvg =
            speedSamples.length > 0 ? sum / speedSamples.length : 0;

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
    console.log("[UploadTest] Starting test:", {
      uploadEndpoint,
      dataSizeBytes,
      connections,
    });
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
    console.log(
      `[UploadTest] Generated dummy data of size: ${dummyData.length}`
    );

    let payload: any = dummyData;
    try {
      if (typeof Blob !== "undefined") {
        payload = new Blob([dummyData], { type: "text/plain" });
        console.log("[UploadTest] Converted payload to Blob");
      } else {
        console.log("[UploadTest] Blob not available, using string payload");
      }
    } catch (e) {
      console.warn("[UploadTest] Failed to create Blob:", e);
    }

    // Track completion for each XHR
    const completedXhrs = new Array(connections).fill(false);
    const completionTimes = new Array(connections).fill(0);
    let completedCount = 0;
    const startTime = Date.now();
    let stopped = false;
    let avgMbps = 0;
    let previousProgress = 0; // Track to ensure monotonic progress
    const speedSamples: number[] = [];

    // Start all XHRs
    for (let i = 0; i < connections; i++) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadEndpoint, true);

      xhr.onload = () => {
        if (!completedXhrs[i]) {
          const completionTime = Date.now();
          completedXhrs[i] = true;
          completionTimes[i] = completionTime;
          completedCount++;
          console.log(
            `[UploadTest] XHR ${i} completed in ${
              completionTime - startTime
            }ms. Status: ${xhr.status}`
          );
        }
      };

      xhr.onerror = () => {
        console.error(`[UploadTest] XHR ${i} error`);
        if (!completedXhrs[i]) {
          completedXhrs[i] = true;
          completedCount++;
        }
      };

      console.log(
        `[UploadTest] Sending XHR ${i} (payload type: ${
          payload.constructor?.name || typeof payload
        })`
      );
      xhr.send(payload);
    }

    // Sampling loop that provides live updates
    const interval = setInterval(() => {
      if (stopped) return;

      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedSeconds = Math.max(0.001, elapsedMs / 1000);

      // Calculate bytes uploaded based on completed XHRs
      const uploadedBytes = completedCount * dataSizeBytes;

      // Calculate instantaneous speed based on total progress, not per-XHR average
      // This provides more stable speed readings
      let instantMbps = 0;
      if (completedCount > 0) {
        // Use the time of the most recent completion for more accurate speed
        const mostRecentCompletionTime = Math.max(...completionTimes);
        const effectiveElapsedMs = mostRecentCompletionTime - startTime;
        const speedBps = uploadedBytes / (effectiveElapsedMs / 1000);
        instantMbps = (speedBps * 8) / 1_000_000;
      } else {
        // Estimate speed for in-flight uploads based on typical upload speeds
        // This gives a rough estimate until we have actual data
        const estimatedProgressPerXhr = Math.min(
          1,
          elapsedSeconds / (maxTestDurationMs / 1000)
        );
        const estimatedBytes =
          connections * dataSizeBytes * estimatedProgressPerXhr;
        const speedBps = estimatedBytes / elapsedSeconds;
        instantMbps = (speedBps * 8) / 1_000_000;
      }

      console.log(`[UploadTest] Loop:`, {
        elapsedMs,
        completedCount,
        uploadedBytes,
        instantMbps,
        avgMbps,
      });

      if (instantMbps > 0) {
        speedSamples.push(instantMbps);
      }

      avgMbps = smoothingAlpha * instantMbps + (1 - smoothingAlpha) * avgMbps;

      // Progress: Smooth estimation based on completed + in-progress uploads
      let estimatedProgress = completedCount / connections;

      if (completedCount < connections && completedCount > 0) {
        // We have some completions, estimate remaining based on average completion time
        const avgCompletionTime =
          completionTimes.filter((t) => t > 0).reduce((a, b) => a + b, 0) /
          completedCount;
        const remainingXhrs = connections - completedCount;
        const estimatedRemainingProgress =
          Math.min(1, elapsedMs / avgCompletionTime) *
          (remainingXhrs / connections);
        estimatedProgress += estimatedRemainingProgress;
      } else if (completedCount === 0) {
        // No completions yet, provide linear progress estimation
        // Assume average upload will take ~3 seconds for 2MB at 20Mbps
        const estimatedTotalTime = ((dataSizeBytes * 8) / 20_000_000) * 1000; // ms
        estimatedProgress = Math.min(0.9, elapsedMs / estimatedTotalTime); // Cap at 90% until actual completion
      }

      // Ensure progress never decreases (monotonic)
      const progress = Math.max(
        previousProgress,
        Math.min(1, estimatedProgress)
      );
      previousProgress = progress;

      onUpdate({
        instantaneousMbps: Math.round(instantMbps * 100) / 100,
        avgMbps: Math.round(avgMbps * 100) / 100,
        elapsedSeconds,
        downloadedBytes: uploadedBytes,
        progress,
      });

      // Stop when all XHRs complete or max duration exceeded
      if (completedCount >= connections || elapsedMs >= maxTestDurationMs) {
        console.log("[UploadTest] Stop condition met", {
          completedCount,
          connections,
          elapsedMs,
        });
        stopped = true;
        clearInterval(interval);
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

          // Calculate final speed based on total bytes and actual time
          const totalUploadedBytes = completedCount * dataSizeBytes;
          const finalSpeedBps = totalUploadedBytes / elapsedSeconds;
          const finalAvgMbps = (finalSpeedBps * 8) / 1_000_000;

          console.log("[UploadTest] Resolving final result", {
            finalAvgMbps,
            totalBytes: totalUploadedBytes,
            elapsedSeconds,
            completedCount,
            samplesCount: speedSamples.length,
          });

          resolve({
            finalAvgMbps: Math.round(finalAvgMbps * 100) / 100,
            totalBytes: totalUploadedBytes,
            elapsedSeconds,
          });
        }
      }, 100);
    });
  };

  return { startUploadTest };
}
