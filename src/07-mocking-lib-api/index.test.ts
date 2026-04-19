import axios from 'axios';
import { throttledGetDataFromApi } from './index';
import { describe, expect, test, jest, beforeEach } from '@jest/globals';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with baseURL', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} } as never);

    mockedAxios.create.mockImplementation(() => {
      return {
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        request: jest.fn(),
      } as unknown as ReturnType<typeof axios.create>;
    });

    await throttledGetDataFromApi('/test');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should call correct url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: {} } as never);

    mockedAxios.create.mockImplementation(() => {
      return {
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        request: jest.fn(),
      } as unknown as ReturnType<typeof axios.create>;
    });

    await throttledGetDataFromApi('/posts');

    expect(mockGet).toHaveBeenCalledWith('/posts');
  });

  test('should return response data', async () => {
    const mockResponse = {
      data: { id: 1, title: 'test' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '/posts' },
    };

    const mockGet = jest.fn().mockResolvedValue(mockResponse as never);

    mockedAxios.create.mockImplementation(() => {
      return {
        get: mockGet,
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        patch: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        request: jest.fn(),
      } as unknown as ReturnType<typeof axios.create>;
    });

    const result = await throttledGetDataFromApi('/posts');

    expect(result).toEqual({ id: 1, title: 'test' });
  });
});
