const { app } = require('../src/server');
const supertest = require('supertest');
const mockRequest = supertest(app);

describe('API Server', () => {
    test('Handles the root path', async () => {
        const response = await mockRequest.get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBeTruthy();
        expect(response.text).toEqual('Hello World!');
    });

    test('Handles invalid requests', async () => {
        const response = await mockRequest.get('/invalid');

        expect(response.status).toEqual(404);
    });

    test('Handles server errors', async () => {
        const response = await mockRequest.get('/error');

        expect(response.status).toEqual(500);
        expect(response.body.error).toEqual(500);
        expect(response.body.message).toContain('Forced Error for Testing');
    })
});