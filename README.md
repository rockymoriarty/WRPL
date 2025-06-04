# TixVibe - Concert Ticketing API

[![Tests](https://github.com/rockymoriarty/WRPL/actions/workflows/tests.yml/badge.svg?branch=tixvibeautomatedtesting)](https://github.com/rockymoriarty/WRPL/actions/workflows/tests.yml)
[![Security Audit](https://github.com/rockymoriarty/WRPL/actions/workflows/security.yml/badge.svg?branch=tixvibeautomatedtesting)](https://github.com/rockymoriarty/WRPL/actions/workflows/security.yml)
[![Coverage](https://codecov.io/gh/rockymoriarty/WRPL/branch/tixvibeautomatedtesting/graph/badge.svg)](https://codecov.io/gh/rockymoriarty/WRPL/branch/tixvibeautomatedtesting)

TixVibe is a Node.js backend application for managing concert ticket sales, built with a focus on robust automated testing and CI/CD practices.

## Features

-   **REST API:** Built with Express.js for handling concerts, orders, and user authentication.
-   **Database:** Uses MySQL, managed with Docker Compose.
-   **Authentication:** JWT-based authentication for secure endpoints.
-   **Automated Testing:**
    -   Unit tests, Integration tests (setup required), and Load tests with Jest and Supertest.
    -   Code coverage reporting via Codecov.
-   **Code Quality:**
    -   Linting with ESLint.
    -   Code formatting with Prettier.
-   **Containerization:** Dockerized application and database for consistent development and deployment environments.
-   **CI/CD:**
    -   GitHub Actions for running tests, linters, formatters, and security audits on push/pull requests.
    -   Automated dependency updates and security checks.

## Project Structure

\`\`\`
.
├── .github/                # GitHub Actions workflows
│   ├── workflows/
│   │   ├── security.yml    # Security audit workflow
│   │   └── tests.yml       # CI test workflow
├── coverage/               # Code coverage reports (generated)
├── node_modules/           # Project dependencies (managed by npm)
├── src/                    # Source code
│   ├── backend/            # Backend application (Node.js/Express)
│   │   ├── database/       # Database configuration and migrations
│   │   ├── middleware/     # Express middleware (e.g., auth)
│   │   ├── routes/         # API route definitions
│   │   └── server.js       # Main application entry point
│   └── public/             # Static public assets (if any, currently empty)
├── tests/                  # Automated tests
│   ├── integration/        # Integration tests
│   ├── load/               # Load tests
│   ├── unit/               # Unit tests
│   └── setup.js            # Jest global setup
├── .dockerignore           # Specifies files to ignore in Docker image
├── .eslintignore           # Specifies files/directories for ESLint to ignore
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Specifies intentionally untracked files that Git should ignore
├── .prettierignore         # Specifies files/directories for Prettier to ignore
├── .prettierrc             # Prettier configuration
├── concertrev5.sql         # Database schema/initial data (if applicable)
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Dockerfile for the application
├── jest.config.js          # Jest test runner configuration
├── package-lock.json       # Records exact versions of dependencies
├── package.json            # Project metadata and dependencies
└── README.md               # This file
\`\`\`

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x recommended, as used in Dockerfile)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/rockymoriarty/WRPL.git
    cd WRPL
    \`\`\`

2.  **Switch to the development branch (optional but recommended):**
    \`\`\`bash
    git checkout tixvibeautomatedtesting
    \`\`\`

3.  **Install Node.js dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

### Environment Configuration

1.  Create a \`.env\` file in the project root by copying the example:
    \`\`\`bash
    cp .env.example .env
    \`\`\`
2.  Modify the \`.env\` file with your specific database credentials, JWT secret, and other environment variables as needed. The default values are set up to work with the \`docker-compose.yml\` configuration.
    -   \`DB_HOST=db\` (This should be the service name in \`docker-compose.yml\`)
    -   \`DB_USER=your_mysql_user\`
    -   \`DB_PASSWORD=your_mysql_password\`
    -   \`DB_NAME=your_mysql_database\`
    -   \`JWT_SECRET=your_strong_jwt_secret\`

    **Note:** For integration tests (\`tests/integration/database.test.js\`), you will need to set up a separate test database and configure environment variables like \`TEST_DB_HOST\`, \`TEST_DB_USER\`, etc., or adjust the test configuration accordingly.

## Running the Application

### With Docker Compose (Recommended)

This is the easiest way to run the application with its database.

1.  **Build and run the containers:**
    \`\`\`bash
    docker-compose up -d --build
    \`\`\`
    The application will be accessible at \`http://localhost:8080\` (or the port mapped in your \`docker-compose.yml\`).

2.  **To stop the containers:**
    \`\`\`bash
    docker-compose down
    \`\`\`

3.  **To view logs:**
    \`\`\`bash
    docker-compose logs app
    docker-compose logs db
    \`\`\`

### Locally (Without Docker - for development/testing specific parts)

If you have a MySQL instance running locally and configured, you can run the Node.js application directly:

1.  Ensure your local MySQL server is running and accessible.
2.  Update your \`.env\` file to point to your local MySQL instance (e.g., \`DB_HOST=localhost\`).
3.  Start the application:
    \`\`\`bash
    npm start
    \`\`\`
    Or for development with Nodemon (auto-restarts on file changes):
    \`\`\`bash
    npm run dev
    \`\`\`

## Running Tests

-   **Run all tests (unit, integration - if configured, load):**
    \`\`\`bash
    npm test
    \`\`\`

-   **Run tests in watch mode (re-runs on file changes):**
    \`\`\`bash
    npm run test:watch
    \`\`\`

-   **Run tests and generate coverage report:**
    \`\`\`bash
    npm run test:coverage
    \`\`\`
    The coverage report will be available in the \`coverage/\` directory.

-   **Run tests for CI environment (includes coverage, no watch mode):**
    \`\`\`bash
    npm run test:ci
    \`\`\`

**Note:** Integration tests in \`tests/integration/database.test.js\` require a separate test database setup and environment variables (\`TEST_DB_*\`) to be configured. They are currently skipped by default.

## Code Quality

-   **Lint code with ESLint:**
    \`\`\`bash
    npm run lint
    \`\`\`

-   **Automatically fix linting issues:**
    \`\`\`bash
    npm run lint:fix
    \`\`\`

-   **Check code formatting with Prettier:**
    \`\`\`bash
    npm run format:check
    \`\`\`

-   **Automatically fix formatting issues:**
    \`\`\`bash
    npm run format
    \`\`\`

## Available npm Scripts

-   \`npm start\`: Starts the application using \`node src/backend/server.js\`.
-   \`npm run dev\`: Starts the application using Nodemon for development.
-   \`npm test\`: Runs all tests using Jest.
-   \`npm run test:watch\`: Runs tests in watch mode.
-   \`npm run test:coverage\`: Runs tests and generates a coverage report.
-   \`npm run test:ci\`: Runs tests for CI (no watch, includes coverage).
-   \`npm run lint\`: Lints the codebase.
-   \`npm run lint:fix\`: Lints and attempts to fix issues.
-   \`npm run format\`: Formats code using Prettier.
-   \`npm run format:check\`: Checks code formatting using Prettier.

## Contributing

Please refer to the contributing guidelines (to be created) before submitting pull requests. For now, ensure your changes pass all linting and testing checks.