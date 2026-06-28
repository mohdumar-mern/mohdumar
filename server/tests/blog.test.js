import request from 'supertest';
import app from '../app.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/blogModel.js';

dotenv.config();

let token = '';
let blogId = '';
let blogSlug = '';

beforeAll(async () => {
  await connectDB();

  // Login karke token lo
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.EMAIL_USER,
      password: process.env.TEST_PASSWORD,
    });
  token = res.body.token;
}, 15000);

afterAll(async () => {
  // Test blogs cleanup
  await Blog.deleteMany({ tags: 'test-blog' });
  await mongoose.connection.close();
});

describe('Blog API Tests', () => {

  // Create Blog
  test('POST /api/blogs should create blog', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog Post',
        content: '<p>Test content here</p>',
        metaTitle: 'Test Blog',
        metaDescription: 'Test blog description',
        tags: ['test-blog'],
        isPublished: true,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.blog).toBeDefined();
    blogId = res.body.blog._id;
    blogSlug = res.body.blog.slug;
  }, 15000);

  // Get All Blogs
  test('GET /api/blogs should return blogs', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.statusCode).toBe(200);
    expect(res.body.blogs).toBeDefined();
  }, 15000);

  // Get Blog by Slug
  test('GET /api/blogs/:slug should return single blog', async () => {
    const res = await request(app).get(`/api/blogs/${blogSlug}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.blog).toBeDefined();
  }, 15000);

  // Get Tags
  test('GET /api/blogs/tags should return tags', async () => {
    const res = await request(app).get('/api/blogs/tags');
    expect(res.statusCode).toBe(200);
    expect(res.body.tags).toBeDefined();
  }, 15000);

  // Admin Blogs
  test('GET /api/blogs/admin/all should return all blogs', async () => {
    const res = await request(app)
      .get('/api/blogs/admin/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  }, 15000);

  // Update Blog
  test('PUT /api/blogs/:id should update blog', async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Blog',
        content: '<p>Updated content</p>',
      });
    expect(res.statusCode).toBe(200);
  }, 15000);

  // No Token
  test('POST /api/blogs without token should return 401', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({ title: 'Test', content: 'Test' });
    expect(res.statusCode).toBe(401);
  }, 15000);

  // Delete Blog
  test('DELETE /api/blogs/:id should delete blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  }, 15000);

});