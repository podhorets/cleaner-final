/**
 * Measure download speed using multiple parallel connections
 * This better saturates bandwidth and gives more accurate results
 * @param testFileUrl URL of test file to download
 * @param fileSizeBytes Expected file size in bytes per connection
 * @param connections Number of parallel connections (default: 4)
 * @returns {Promise<number>} download speed in Mbps
 */
export const measureDownloadSpeed = async (
  testFileUrl: string,
  fileSizeBytes: number,
  connections: number = 4
): Promise<number> => {
  try {
    const startTime = Date.now();
    
    // Create multiple parallel download promises
    const downloadPromises = Array.from({ length: connections }, () =>
      fetch(testFileUrl).then(response => {
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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let dummyData = '';
    // Generate data in chunks to avoid stack overflow or memory issues with large strings
    const chunkSize = 1024;
    const chunks = Math.ceil(dataSizeBytes / chunkSize);
    
    for (let i = 0; i < chunks; i++) {
        let chunk = '';
        for (let j = 0; j < chunkSize && (i * chunkSize + j) < dataSizeBytes; j++) {
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
