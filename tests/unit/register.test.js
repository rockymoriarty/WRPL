const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const authRoutes = require("../../../backend/routes/auth");

jest.mock("../../../backend/database/db_config", () => ({
  query: jest.fn(),
}));
const db = require("../../../backend/database/db_config");

// Setup Express app
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("POST /auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any field is missing", async () => {
    const res = await request(app).post("/auth/register").send({
      fullname: "John Doe",
      email: "", // missing email
      password: "secret123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "All fields are required!");
  });

  it("should return 500 if database error occurs", async () => {
    db.query.mockImplementationOnce((sql, params, callback) => {
      callback(new Error("DB error"), null);
    });

    const res = await request(app).post("/auth/register").send({
      fullname: "John Doe",
      email: "john@example.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Internal server error");
  });

  it("should return 201 when registration is successful", async () => {
    db.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const res = await request(app).post("/auth/register").send({
      fullname: "Jane Doe",
      email: "jane@example.com",
      password: "secret123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully!");
  });
});
