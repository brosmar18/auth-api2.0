const supertest = require('supertest');
const { app } = require('../src/server');
const { sequelizeDatabase } = require('../src/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mockRequest = supertest(app)

beforeAll( async () => {
    sequelizeDatabase.sync();
});

afterAll( async () => {
    sequelizeDatabase.close();
});

describe('Auth Routes', () => {
    let savedUser;
    const userData = { username: 'testUser', password: 'testPass123', role: 'admin' };

    test('Should create a new user with valid credentials', async () => {
        const response = await mockRequest.post('/signup').send(userData);
        savedUser = response.body.user;

        expect(response.status).toBe(201);
        expect(response.body.user).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.user.username).toBe(userData.username);
        expect(response.body.user.role).toBe(userData.role);
        expect(bcrypt.compareSync(userData.password, response.body.user.password)).toBe(true);
        const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
        expect(decodedToken.username).toBe(userData.username);
    });

    test('Created user should be in the database', async () => {
        const foundUser = await sequelizeDatabase.models.User.findOne({ where: { username: userData.username } });
        expect(foundUser).toBeDefined();
        expect(foundUser.username).toBe(savedUser.username);
        expect(foundUser.role).toBe(savedUser.role);
        // Verify that the password is hashed in the database
        expect(bcrypt.compareSync(userData.password, foundUser.password)).toBe(true);
    });

    test('Should sign in a user with valid credentials', async () => {
        // Basic auth headers format: 'Basic base64(username:password)'
        const credentials = Buffer.from(`${userData.username}:${userData.password}`).toString('base64');
        const response = await mockRequest.post('/signin').set('Authorization', `Basic ${credentials}`);

        expect(response.status).toBe(200);
        expect(response.body.user).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(response.body.user.username).toBe(userData.username);
        const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
        expect(decodedToken.username).toBe(userData.username);
    });

    test('Should not sign in a user with invalid credentials', async () => {
        const credentials = Buffer.from(`${userData.username}:wrongpassword`).toString('base64');
        const response = await mockRequest.post('/signin').set('Authorization', `Basic ${credentials}`);

        expect(response.status).toBe(403);
        expect(response.body.user).toBeUndefined();
    });
});