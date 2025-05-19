const request = require("supertest");
const express = require("express");
const orderRoutes = require("../../../backend/routes/order");

jest.mock("../../../backend/database/db_config", () => ({
  query: jest.fn(),
}));
const db = require("../../../backend/database/db_config");

// Mock middleware verifyToken agar langsung melewati autentikasi
jest.mock("../../../backend/middleware/verifyToken", () =>
  (req, res, next) => {
    req.user = { id: 1 }; // Mocked user
    next();
  }
);

// Setup Express app
const app = express();
app.use(express.json());
app.use("/", orderRoutes);

describe("POST / (Create Order)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if ticket_id or quantity is missing or invalid", async () => {
    const res = await request(app).post("/").send({
      ticket_id: null,
      quantity: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", expect.any(String));
  });

  it("should return 500 if DB error occurs", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error("DB insert error"), null);
    });

    const res = await request(app).post("/").send({
      ticket_id: 123,
      quantity: 2,
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to create order");
  });

  it("should return 201 and order_id if order creation succeeds", async () => {
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { insertId: 10 });
    });

    const res = await request(app).post("/").send({
      ticket_id: 123,
      quantity: 2,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      message: "Order created successfully",
      order_id: 10,
      order_date: expect.any(String),
    });
  });
});
