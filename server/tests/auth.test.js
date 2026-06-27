import request from 'supertest';
import app from '../app.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import redis from '../config/redis.js';

dotenv.config();

beforeAll(async () => {
  await connectDB();
}, 15000);

afterAll(async () => {
    await mongoose.connection.collection('auths').deleteOne({ email: 'test@test.com' });
    await mongoose.connection.close();
    await redis.quit(); // ← yeh add karo

  });

describe('Auth Tests', () => {

  // Register
  test('POST /api/auth/register should return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'Test User',
        email: 'test@test.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(201);
  }, 15000);

  // Login - correct
  test('POST /api/auth/login should return 200', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456'
      });
    expect(res.statusCode).toBe(200);
  }, 15000);

  // Login - wrong password
  test('POST /api/auth/login wrong password should return 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(401);
  }, 15000);

});



describe('Protected Route Tests', () => {

    let token = '';
  
    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: '123456'
        });
      token = res.body.token; // ✅ yahan hai token
    }, 15000);
  
    // Token ke bina → 401
    test('POST /api/profile/add without token should return 401', async () => {
      const res = await request(app)
        .post('/api/profile/add')
        .send({ name: 'Test' });
      expect(res.statusCode).toBe(401);
    }, 15000);
  
    // Token ke saath → 401 nahi hona chahiye
    test('POST /api/profile/add with token should not return 401', async () => {
      const res = await request(app)
        .post('/api/profile/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' });
      expect(res.statusCode).not.toBe(401);
    }, 15000);
  
  });





  describe('Validation Tests', () => {

    // Email missing
    test('POST /api/auth/register without email should return 422', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: '123456'
        });
      expect(res.statusCode).toBe(422);
    }, 15000);
  
    // Password missing
    test('POST /api/auth/register without password should return 422', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@test.com'
        });
      expect(res.statusCode).toBe(422);
    }, 15000);
  
    // Username missing
    test('POST /api/auth/register without username should return 422', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: '123456'
        });
      expect(res.statusCode).toBe(422);
    }, 15000);
  
    // Empty body
    test('POST /api/auth/login with empty body should return 422', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});
      expect(res.statusCode).toBe(422);
    }, 15000);
  
  });