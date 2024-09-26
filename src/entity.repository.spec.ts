import { NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

import { EntityRepository } from './entity.repository';
import { ESortOrder } from './types';

const PAGINATION = {
  field: 'created',
};

jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common');
  return {
    ...originalModule,
    Logger: jest.fn().mockImplementation(() => ({
      debug: jest.fn(),
      error: jest.fn(),
    })),
  };
});

class TestEntityRepository extends EntityRepository<Document> {}

describe('EntityRepository', () => {
  let entityRepository: EntityRepository<Document>;
  let entityModel: Model<Document>;

  const mockQuery = {
    exec: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
  };

  const mockTotalQuery = {
    exec: jest.fn(),
  };

  beforeEach(() => {
    mockQuery.exec.mockReset();
    mockQuery.populate.mockReset();
    mockQuery.skip.mockReset().mockReturnThis();
    mockQuery.limit.mockReset().mockReturnThis();
    mockQuery.sort.mockReset().mockReturnThis();

    mockTotalQuery.exec.mockReset();

    // Define the MockEntityModel class with constructor and static methods
    class MockEntityModel {
      constructor(data) {
        this.data = data;
      }
      data: any;
      save() {
        // Will be mocked in tests
      }

      // Static methods
      static find = jest.fn().mockReturnValue(mockQuery);
      static findOne = jest.fn().mockReturnValue(mockQuery);
      static countDocuments = jest.fn().mockReturnValue(mockTotalQuery);
      static findOneAndUpdate = jest.fn().mockReturnValue(mockQuery);
      static findOneAndDelete = jest.fn().mockReturnValue(mockQuery);
    }

    // Assign the mock class to entityModel
    entityModel = MockEntityModel as any;

    // Instantiate the repository with the mock model
    entityRepository = new TestEntityRepository(entityModel);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('find', () => {
    it('should call entityModel.find with correct parameters and return result', async () => {
      const filter = { name: 'test' };
      const projection = { name: 1 };
      const options = { populate: ['field1'], sort: { created: -1 } };
      const result = [{ name: 'test' }];

      entityModel.find = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(result);

      const data = await entityRepository.find(filter, projection, options);

      expect(entityModel.find).toHaveBeenCalledWith(filter, projection, {
        sort: { created: -1 },
        ...options,
      });
      expect(mockQuery.populate).toHaveBeenCalledWith('field1');
      expect(data).toEqual(result);
    });

    it('should call entityModel.find without populate when options.populate is not provided', async () => {
      const filter = { name: 'test' };
      const projection = { name: 1 };
      const options = { sort: { created: -1 } };
      const result = [{ name: 'test' }];

      entityModel.find = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(result);

      const data = await entityRepository.find(filter, projection, options);

      expect(entityModel.find).toHaveBeenCalledWith(filter, projection, {
        sort: { created: -1 },
        ...options,
      });
      expect(mockQuery.populate).not.toHaveBeenCalled();
      expect(data).toEqual(result);
    });

    it('should set default options when options are not provided', async () => {
      const filter = { name: 'test' };
      const projection = { name: 1 };
      const result = [{ name: 'test' }];

      entityModel.find = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(result);

      const data = await entityRepository.find(filter, projection);

      expect(entityModel.find).toHaveBeenCalledWith(filter, projection, {
        sort: { created: -1 },
      });
      expect(mockQuery.populate).not.toHaveBeenCalled();
      expect(data).toEqual(result);
    });

    it('should handle errors and rethrow', async () => {
      const error = new Error('test error');
      entityModel.find = jest.fn().mockImplementation(() => {
        throw error;
      });

      await expect(entityRepository.find({}, {}, {})).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should call entityModel.findOne with correct parameters and return result', async () => {
      const filter = { name: 'test' };
      const projection = { name: 1 };
      const options = { populate: ['field1'] };
      const result = { name: 'test' };

      entityModel.findOne = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(result);

      const data = await entityRepository.findOne(filter, projection, options);

      expect(entityModel.findOne).toHaveBeenCalledWith(
        filter,
        projection,
        options,
      );
      expect(mockQuery.populate).toHaveBeenCalledWith('field1');
      expect(data).toEqual(result);
    });

    it('should throw NotFoundException when entity not found', async () => {
      const filter = { name: 'test' };

      entityModel.findOne = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(null);

      await expect(entityRepository.findOne(filter)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle errors and rethrow', async () => {
      const error = new Error('test error');
      entityModel.findOne = jest.fn().mockImplementation(() => {
        throw error;
      });

      await expect(entityRepository.findOne({}, {})).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    it('should create a new entity and save it', async () => {
      const data = { name: 'test' };
      const result = { name: 'test', _id: 'someId' };

      // Mock the save method to resolve with the result
      const saveMock = jest
        .spyOn(entityModel.prototype, 'save')
        .mockResolvedValue(result);

      const savedEntity = await entityRepository.create(data);

      expect(savedEntity).toEqual(result);
      expect(saveMock).toHaveBeenCalled();
    });

    it('should handle errors and rethrow', async () => {
      const error = new Error('test error');

      // Mock the save method to reject with an error
      const saveMock = jest
        .spyOn(entityModel.prototype, 'save')
        .mockRejectedValue(error);

      await expect(entityRepository.create({})).rejects.toThrow(error);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('findOneAndUpdate', () => {
    it('should update and return the updated entity', async () => {
      const filter = { _id: 'someId' };
      const data = { name: 'updated' };
      const options = { populate: ['field1'] };
      const result = { _id: 'someId', name: 'updated' };

      entityModel.findOneAndUpdate = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(result);

      const updatedEntity = await entityRepository.findOneAndUpdate(
        filter,
        data,
        options,
      );

      expect(entityModel.findOneAndUpdate).toHaveBeenCalledWith(filter, data, {
        new: true,
        runValidators: true,
        context: 'query',
        ...options,
      });
      expect(mockQuery.populate).toHaveBeenCalledWith('field1');
      expect(updatedEntity).toEqual(result);
    });

    it('should throw NotFoundException when entity not found', async () => {
      const filter = { _id: 'someId' };
      const data = { name: 'updated' };

      entityModel.findOneAndUpdate = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(null);

      await expect(
        entityRepository.findOneAndUpdate(filter, data),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle errors and rethrow', async () => {
      const error = new Error('test error');
      entityModel.findOneAndUpdate = jest.fn().mockImplementation(() => {
        throw error;
      });

      await expect(entityRepository.findOneAndUpdate({}, {})).rejects.toThrow(
        error,
      );
    });
  });

  describe('findOneAndDelete', () => {
    it('should delete and return the deleted entity', async () => {
      const filter = { _id: 'someId' };
      const options = { populate: ['field1'] };
      const result = { _id: 'someId', name: 'deleted' };

      entityModel.findOneAndDelete = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(result);

      const deletedEntity = await entityRepository.findOneAndDelete(
        filter,
        options,
      );

      expect(entityModel.findOneAndDelete).toHaveBeenCalledWith(
        filter,
        options,
      );
      expect(mockQuery.populate).toHaveBeenCalledWith('field1');
      expect(deletedEntity).toEqual(result);
    });

    it('should throw NotFoundException when entity not found', async () => {
      const filter = { _id: 'someId' };

      entityModel.findOneAndDelete = jest.fn().mockReturnValue(mockQuery);
      mockQuery.exec.mockResolvedValue(null);

      await expect(entityRepository.findOneAndDelete(filter)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle errors and rethrow', async () => {
      const error = new Error('test error');
      entityModel.findOneAndDelete = jest.fn().mockImplementation(() => {
        throw error;
      });

      await expect(entityRepository.findOneAndDelete({})).rejects.toThrow(
        error,
      );
    });
  });

  describe('findPaginated', () => {
    it('should return paginated results', async () => {
      const filter = { name: 'test' };
      const projection = { name: 1 };
      const options = { populate: ['field1'] };
      const page = 2;
      const limit = 5;
      const sort = ESortOrder.ASC;
      const field = 'name';
      const total = 20;
      const data = [{ name: 'test1' }, { name: 'test2' }];

      mockTotalQuery.exec.mockResolvedValue(total);
      mockQuery.exec.mockResolvedValue(data);

      const result = await entityRepository.findPaginated(
        filter,
        projection,
        options,
        page,
        limit,
        sort,
        field,
      );

      expect(entityModel.countDocuments).toHaveBeenCalledWith(filter);
      expect(entityModel.find).toHaveBeenCalledWith(filter, projection, {
        ...options,
        sort: { [field]: 1 },
      });
      expect(mockQuery.skip).toHaveBeenCalledWith((page - 1) * limit);
      expect(mockQuery.limit).toHaveBeenCalledWith(limit);
      expect(mockQuery.populate).toHaveBeenCalledWith('field1');
      expect(result).toEqual({
        data,
        total,
        totalPages: Math.ceil(total / limit),
        page,
        limit,
      });
    });

    it('should set default values for page, limit, sort, and field', async () => {
      const filter = {};
      const projection = {};
      const options = {};
      const total = 10;
      const data = [{ name: 'test1' }];

      mockTotalQuery.exec.mockResolvedValue(total);
      mockQuery.exec.mockResolvedValue(data);

      const result = await entityRepository.findPaginated(
        filter,
        projection,
        options,
      );

      expect(entityModel.countDocuments).toHaveBeenCalledWith(filter);
      expect(entityModel.find).toHaveBeenCalledWith(filter, projection, {
        ...options,
        sort: { [PAGINATION.field]: -1 },
      });
      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        data,
        total,
        totalPages: Math.ceil(total / 10),
        page: 1,
        limit: 10,
      });
    });

    it('should set page and limit to at least 1', async () => {
      const filter = {};
      const projection = {};
      const options = {};
      const total = 10;
      const data = [{ name: 'test1' }];

      mockTotalQuery.exec.mockResolvedValue(total);
      mockQuery.exec.mockResolvedValue(data);

      const result = await entityRepository.findPaginated(
        filter,
        projection,
        options,
        -1,
        0,
      );

      expect(mockQuery.skip).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
    });

    it('should handle errors and rethrow', async () => {
      const error = new Error('test error');
      entityModel.countDocuments = jest.fn().mockImplementation(() => {
        throw error;
      });

      await expect(entityRepository.findPaginated({}, {})).rejects.toThrow(
        error,
      );
    });
  });
});
