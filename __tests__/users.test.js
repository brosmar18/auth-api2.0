const supertest = require('supertest');
const { app } = require('../src/server');
const { sequelizeDatabase } = require('../src/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mockRequest = supertest(app);

describe('/users route', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    await sequelizeDatabase.sync();

    // Creating an admin user and user with 'delete' capabilities
    const adminResponse = await mockRequest.post('/signup').send({ username: 'admin', password: 'adminPass', role: 'admin' });
    adminToken = adminResponse.body.token;

    // Creating a regular user without 'delete' capabilities
    const userResponse = await mockRequest.post('/signup').send({ username: 'user', password: 'userPass', role: 'user' });
    userToken = userResponse.body.token;
  });

  afterAll(async () => {
    await sequelizeDatabase.close();
  });

  test('Admin with delete permission should get list of users', async () => {
    const response = await mockRequest.get('/users').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body).toContain('admin');
  });

  test('User without delete permission should be denied', async () => {
    const response = await mockRequest.get('/users').set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);

  });

  test('Should deny access without token', async () => {
    const response = await mockRequest.get('/users');
    expect(response.status).toBe(500);

  });


});
