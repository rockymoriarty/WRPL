const request = require("supertest");
const express = require("express");
const authRoutes = require("../../../backend/routes/auth");
const bcrypt = require("bcryptjs");

jest.mock("../../../backend/database/db_config", () => ({
  query: jest.fn(),
}));
const db = require("../../../backend/database/db_config");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

process.env.JWT_SECRET = "testsecret";

describe("POST /auth/login", () => {
  it("should return 400 if fields are missing", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email and password are required!");
  });

  // Tambahkan test lainnya di sini...
});
