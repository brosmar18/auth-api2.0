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

    test('Should read all records if no id is provided', async () => {
        const results = await collectionInstance.read();
        expect(Array.isArray(results)).toBe(true);
    });

    test('Should update a record by id', async () => {
        modelMock.update = jest.fn().mockReturnValueOnce([1]);
        modelMock.findByPk = jest.fn().mockReturnValueOnce(modelMock.build({ name: 'Updated '}));
        const result = await collectionInstance.update(1, { name: 'Updated'});
        expect(result.name).toBe('Updated');
    });

    test('Should throw an error if update fails to find the record', async () => {
        modelMock.findByPk = jest.fn().mockReturnValueOnce(null);
        const result = await collectionInstance.update(2, {});
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Record not found');
    });

    test('should delete a record by id', async () => {
        modelMock.destroy = jest.fn().mockReturnValueOnce(1);
        const result = await collectionInstance.delete(1);
        expect(result.message).toBe('Record deleted successfully');
    });

    test('should throw an error if deletion fails', async () => {
        modelMock.destroy = jest.fn().mockReturnValueOnce(0);
        const result = await collectionInstance.delete(2);
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Record not found or not deleted');
    });

    test('should handle creation errors gracefully', async () => {
        modelMock.create = jest.fn().mockRejectedValueOnce(new Error('Creation error'));
        const result = await collectionInstance.create({ name: 'Fail' });
        expect(result).toBeUndefined();
    });

    test('Should handle read errors gracefully', async () => {
        modelMock.findOne = jest.fn().mockRejectedValueOnce(new Error('Read error'));
        await expect(collectionInstance.read(1)).rejects.toThrow('Read error');
    });
});