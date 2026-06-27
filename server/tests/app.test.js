import request from 'supertest';
import app from '../app.js';
import connectDB from '../config/db.js';
import redis from '../config/redis.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await connectDB();
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
  await redis.quit();

});

describe('API Health Tests', () => {
  test('GET / should return 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/projects should return 200', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
  }, 15000);

  test('GET /api/skills should return 200', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.statusCode).toBe(200);
  }, 15000);

  test('GET /api/services should return 200', async () => {
    const res = await request(app).get('/api/services');
    expect(res.statusCode).toBe(200);
  }, 15000);

  test('GET /api/profile should return 200', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.statusCode).toBe(200);
  }, 15000);

  test('GET /api/unknown should return 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});