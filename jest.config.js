module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/backend/**/*.js', // Adjusted to target JS files within src/backend
    '!src/backend/server.js', // Exclude server.js if it mainly bootstraps
    '!**/node_modules/**',
    // Add other specific files or patterns to exclude from coverage if needed
    // e.g., '!src/backend/database/db_config.js', if you don't want to cover db config
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
}; 