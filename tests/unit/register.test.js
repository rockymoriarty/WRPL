// tests/registration.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/backend/routes/auth'); // Pastikan path ini benar

// Mock dependencies (penting: hindari interaksi DB asli di test unit)
jest.mock('../../src/backend/database/db_config', () => ({
  query: jest.fn()
}));

const db = require('../../src/backend/database/db_config'); // Import mock DB
const app = express(); // Inisialisasi Express app
app.use(express.json()); // Middleware untuk parsing JSON
app.use('/api/auth', authRoutes); // Kaitkan rute autentikasi

// Mock JWT secret (meskipun register tidak langsung pakai, ini standar setup untuk auth tests)
process.env.JWT_SECRET = 'test_secret';

describe('Registration API', () => {
  // Bersihkan mock setelah setiap test untuk memastikan isolasi
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Data pengguna umum untuk test cases
  const validUserData = {
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    password: 'SecurePassword123!'
  };

  // --- Test Case: Registrasi Berhasil ---
  test('should register a new user successfully and return status 201', async () => {
    // Siapkan mock DB untuk mensimulasikan sukses INSERT
    db.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, { insertId: 1, affectedRows: 1 });
    });

    // Kirim permintaan registrasi
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUserData);

    // Verifikasi hasil
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully!');
    
    // Verifikasi interaksi DB
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query.mock.calls[0][0]).toContain('INSERT INTO users'); // Cek query SQL
    // Contoh cek parameter, perhatikan urutan sesuai route handler
    expect(db.query.mock.calls[0][1][0]).toBe(validUserData.fullname);
    expect(db.query.mock.calls[0][1][1]).toBe(validUserData.email);
    // Password akan di-hash, jadi tidak bisa dibandingkan langsung
  });

  // --- Test Case: Gagal karena field kosong ---
  test('should return 400 if required fields are missing', async () => {
    // Data pengguna tanpa fullname
    const incompleteUserData = {
      email: 'incomplete@example.com',
      password: 'password'
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(incompleteUserData);

    // Verifikasi hasil
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('All fields are required!');
    // Pastikan tidak ada interaksi DB karena validasi harusnya dilakukan di awal
    expect(db.query).not.toHaveBeenCalled();
  });

  // --- Test Case: Gagal karena email sudah terdaftar ---
  // Asumsi: Backend melakukan SELECT dulu untuk cek email, lalu baru mencoba INSERT
  test('should return 409 if email already exists', async () => {
    // Mock DB untuk simulasi email sudah ada
    // Panggilan pertama (SELECT) akan mengembalikan user yang sudah ada
    // Panggilan kedua (jika ada, misal INSERT setelah SELECT) kita bisa biarkan error atau tidak dipanggil
    db.query.mockImplementationOnce((sql, params, callback) => {
      // Simulasikan SELECT email yang menemukan user
      callback(null, [{ email: validUserData.email, user_id: 1 }]);
    });
    // Jika backend mencoba INSERT setelah SELECT dan gagal (misal karena constraint unik),
    // kita bisa menambahkan .mockImplementationOnce kedua di sini untuk simulasi error INSERT

    const res = await request(app)
      .post('/api/auth/register')
      .send(validUserData); // Gunakan data yang sama dengan yang sudah ada

    // Verifikasi hasil
    expect(res.statusCode).toBe(409); // 409 Conflict adalah status yang umum untuk resource duplikat
    expect(res.body.error).toBe('Email already exists'); // Sesuaikan pesan error dari backend Anda
    // Cek bahwa query SELECT (untuk cek email) telah dipanggil, tetapi INSERT mungkin tidak
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query.mock.calls[0][0]).toContain('SELECT email FROM users'); // Pastikan SELECT dipanggil
  });

  // --- Test Case: Gagal karena Internal Server Error (misalnya error DB) ---
  test('should return 500 on internal server error', async () => {
    // Siapkan mock DB untuk mensimulasikan error dari database
    db.query.mockImplementationOnce((sql, params, callback) => {
      callback(new Error('Simulated DB connection error'), null);
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send(validUserData);

    // Verifikasi hasil
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
    // Pastikan query DB dipanggil (mencoba interaksi tapi gagal)
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
