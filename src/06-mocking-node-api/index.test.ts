import path from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import {
  describe,
  expect,
  test,
  jest,
  afterAll,
  beforeAll,
} from '@jest/globals';

import fs from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join').mockReturnValue('mocked/path');
    await readFileAsynchronously('file.txt');
    expect(joinSpy).toHaveBeenCalledWith(__dirname, 'file.txt');
    joinSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(path, 'join').mockReturnValue('/fake/path');

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously('file.txt');

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(path, 'join').mockReturnValue('/fake/path');

    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;

    mockedReadFile.mockResolvedValue(Buffer.from('hello world'));

    const result = await readFileAsynchronously('file.txt');

    expect(result).toBe('hello world');
  });
});
