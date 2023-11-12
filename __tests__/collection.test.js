const Collection = require('../src/models/collection');
const SequelizeMock = require('sequelize-mock');

const DBConnectionMock = new SequelizeMock();

const modelMock = DBConnectionMock.define('ModelMock', {
    id: 1,
    name: 'Example',
});

const collectionInstance = new Collection(modelMock);

describe('Collection class methods', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should create a new record', async () => {
        const result = await collectionInstance.create({ name: 'Example'});
        expect(result.name).toBe('Example');
    });

    test('Should read a new record by id', async () => {
        const result = await collectionInstance.read(1);
        expect(result.id).toBe(1);
        expect(result.name).toBe('Example');
    });
})