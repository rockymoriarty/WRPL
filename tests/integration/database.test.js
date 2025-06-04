const mysql = require('mysql');
const util = require('util'); // For promisifying
// const express = require('express');
// const request = require('supertest'); // Removed

// --- IMPORTANT ASSUMPTION ---
// Assuming you have a userRoutes.js file that exports an Express router
// and handles user-related API endpoints like POST /api/users.
// If your user routes are structured differently, you'll need to adjust this require path
// and how the app is set up.
// const userRoutes = require('../../src/backend/routes/userRoutes'); // EXAMPLE PATH

// const app = express();
// app.use(express.json());
// Mount your user routes - adjust the base path as needed (e.g., /api if your routes are /api/users)
// app.use('/users', userRoutes); // EXAMPLE MOUNTING - ADJUST AS PER YOUR ACTUAL USER ROUTES

describe.skip('Database Integration Tests', () => {
  let dbConnection;
  let query; // Promisified query function

  beforeAll(async () => {
    // Database connection for tests - uses TEST_DB_ environment variables
    dbConnection = mysql.createConnection({
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 3306, // MySQL default port
      database: process.env.TEST_DB_NAME || 'test_db_concertrev', // Suggesting a distinct test DB name
      user: process.env.TEST_DB_USER || 'test_user_concertrev',
      password: process.env.TEST_DB_PASSWORD || 'test_password'
    });

    // Promisify for async/await usage
    query = util.promisify(dbConnection.query).bind(dbConnection);
    dbConnection.connect = util.promisify(dbConnection.connect).bind(dbConnection);
    dbConnection.end = util.promisify(dbConnection.end).bind(dbConnection);

    try {
      await dbConnection.connect();
      console.log('Connected to TEST MySQL database for integration tests.');

      // Create users table if it doesn't exist - MySQL syntax
      await query(
        'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL)'
      );
    } catch (err) {
      console.error('Failed to connect or setup the test database:', err);
      process.exit(1); // Exit if DB setup fails
    }
  });

  afterAll(async () => {
    if (dbConnection) {
      try {
        // Clean up test data: Drop the table (or delete specific test entries)
        await query('DROP TABLE IF EXISTS users');
        await dbConnection.end();
        console.log('Disconnected from TEST MySQL database.');
      } catch (err) {
        console.error('Failed to clean up or disconnect test database:', err);
      }
    }
  });

  beforeEach(async () => {
    // Clear test data from users table before each test
    try {
      await query('DELETE FROM users');
    } catch (err) {
      console.error('Failed to clear users table in beforeEach:', err);
      // Decide if this should be a fatal error for the test suite
    }
  });

  // Basic test to check database connectivity and table creation
  test('should connect to the test database and users table should exist', async () => {
    const describeResult = await query('DESCRIBE users');
    expect(describeResult.length).toBeGreaterThan(0); // Check if table has columns
  });

  // ---- EXAMPLE API INTERACTION TEST (NEEDS YOUR ACTUAL USER ROUTES) ----
  // The following test is commented out because it depends on your specific
  // '/api/users' endpoint and the 'userRoutes' module.
  // You will need to:
  // 1. Create/Ensure 'src/backend/routes/userRoutes.js' exists and exports your user router.
  // 2. Uncomment the 'require' for 'userRoutes' at the top of this file.
  // 3. Uncomment the 'app.use('/users', userRoutes);' line (adjust '/users' if your base path is different, e.g., '/api').
  // 4. Ensure your user creation endpoint returns { id: newUserId, ... } or similar on success.

  /*
  test('should create a user via API and retrieve them from the database', async () => {
    // This test assumes you have a POST /users endpoint (or /api/users, etc.)
    // that creates a user and that you've mounted userRoutes on the 'app' instance above.

    const userData = { email: 'test.integration@example.com' };

    // Create user via API (adjust endpoint as needed)
    const createResponse = await request(app)
      .post('/users') // Or '/api/users' or whatever your user creation endpoint is
      .send(userData)
      .expect(201); // Assuming 201 Created on success

    expect(createResponse.body).toHaveProperty('id');
    const newUserId = createResponse.body.id;

    // Verify user exists in database
    const dbResult = await query('SELECT * FROM users WHERE id = ?', [newUserId]);
    expect(dbResult).toHaveLength(1);
    expect(dbResult[0].email).toBe(userData.email);
  });
  */

  // Add more integration tests here, e.g., for other CRUD operations,
  // interactions between different services, etc.
});
