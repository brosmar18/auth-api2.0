const supertest = require('supertest');
const { app } = require('../src/server'); // Adjust the path as needed
const { sequelizeDatabase } = require('../src/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mockRequest = supertest(app);

describe('/course routes', () => {
  let adminToken, userToken, courseId;

  beforeAll(async () => {
    await sequelizeDatabase.sync();

    // Creating an admin user with all capabilities including 'create', 'read', 'update', 'delete'
    const adminResponse = await mockRequest.post('/signup').send({ username: 'admin', password: 'adminPass', role: 'admin' });
    adminToken = adminResponse.body.token;

    // Creating a regular user without 'create', 'update', 'delete' capabilities
    const userResponse = await mockRequest.post('/signup').send({ username: 'user', password: 'userPass', role: 'user' });
    userToken = userResponse.body.token;
  });

  afterAll(async () => {
    await sequelizeDatabase.close();
  });

  test('Admin should be able to create a course', async () => {
    const courseData = { courseName: 'Test Course', credits: 3, instructor: 'Test Instructor' };
    const response = await mockRequest.post('/course').set('Authorization', `Bearer ${adminToken}`).send(courseData);

    courseId = response.body.course.id; 

    expect(response.status).toBe(201);
    expect(response.body.course.courseName).toBe(courseData.courseName);

  });

  test('User should be able to read all courses', async () => {
    const response = await mockRequest.get('/course').set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('Admin should be able to update a course', async () => {
    const updatedCourseData = { courseName: 'Updated Course', credits: 4, instructor: 'Updated Instructor' };
    const response = await mockRequest.put(`/course/${courseId}`).set('Authorization', `Bearer ${adminToken}`).send(updatedCourseData);

    expect(response.status).toBe(200);
    expect(response.body.courseName).toBe(updatedCourseData.courseName);

  });

  test('Admin should be able to delete a course', async () => {
    const response = await mockRequest.delete(`/course/${courseId}`).set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

  });


});
