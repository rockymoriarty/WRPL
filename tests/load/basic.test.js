const request = require('supertest');
// Correctly import the app from its new export location
const app = require('../../src/backend/server.js');

describe('Load Tests for /api/concerts', () => {
  // Test for handling multiple concurrent requests
  test('should handle multiple concurrent requests to /api/concerts', async () => {
    const concurrentRequests = 50; // Number of concurrent requests
    const requests = Array(concurrentRequests)
      .fill(null)
      .map(
        () => request(app).get('/api/concerts').expect(200) // Target the /api/concerts endpoint
      );

    const startTime = Date.now();
    await Promise.all(requests);
    const endTime = Date.now();

    const totalTime = endTime - startTime;
    const averageResponseTime = totalTime / concurrentRequests;

    console.log(
      `Load Test (Concurrent): ${concurrentRequests} requests to /api/concerts took ${totalTime}ms. Average: ${averageResponseTime.toFixed(2)}ms`
    );
    // Assertion: average response time should be less than 1000ms (1 second)
    expect(averageResponseTime).toBeLessThan(1000);
  }, 30000); // Test timeout: 30 seconds

  // Test for maintaining performance under sustained load
  test('should maintain performance for /api/concerts under sustained load', async () => {
    const requestsPerSecond = 10;
    const durationSeconds = 5;
    const totalRequests = requestsPerSecond * durationSeconds;
    const results = [];

    for (let i = 0; i < totalRequests; i++) {
      const startTime = Date.now();
      await request(app).get('/api/concerts').expect(200); // Target the /api/concerts endpoint
      const endTime = Date.now();
      results.push(endTime - startTime);

      // Wait to maintain the approximate rate of requests per second
      await new Promise(resolve => setTimeout(resolve, 1000 / requestsPerSecond));
    }

    const averageResponseTime = results.reduce((a, b) => a + b, 0) / results.length;
    const maxResponseTime = Math.max(...results);

    console.log(
      `Load Test (Sustained): ${totalRequests} requests to /api/concerts over ${durationSeconds}s. Avg: ${averageResponseTime.toFixed(2)}ms, Max: ${maxResponseTime}ms`
    );
    // Assertions: average response time less than 500ms, max response time less than 2000ms
    expect(averageResponseTime).toBeLessThan(500);
    expect(maxResponseTime).toBeLessThan(2000);
  }, 30000); // Test timeout: 30 seconds
});
