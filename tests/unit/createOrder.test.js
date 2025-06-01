// tests/auth.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../backend/routes/auth');

// Mock dependencies
jest.mock('../../backend/database/db_config', () => ({
  query: jest.fn(),
}));

const db = require('../../backend/database/db_config');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock JWT secret
process.env.JWT_SECRET = 'test_secret';

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'All fields are required!');
    });

    it('should return 201 on successful registration', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, { insertId: 1 });
      });

      const res = await request(app).post('/api/auth/register').send({
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully!');
    });

    it('should return 500 on database error', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(new Error('DB error'), null);
      });

      const res = await request(app).post('/api/auth/register').send({
        fullname: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('POST /login', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Email and password are required!');
    });

    it('should return 401 if user not found', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, []);
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'notfound@example.com',
        password: 'somepassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 if password is incorrect', async () => {
      db.query.mockImplementation((sql, params, callback) => {
        callback(null, [{ user_id: 1, name: 'User', email: 'user@example.com', password: '$2a$10$wronghash' }]);
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Incorrect password');
    });

    it('should return token if login is successful', async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      db.query.mockImplementation((sql, params, callback) => {
        callback(null, [{ user_id: 1, name: 'User', email: 'user@example.com', password: hashedPassword }]);
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'user@example.com',
        password: 'correctpassword',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('message', 'Login successful');
    });
  });
});
