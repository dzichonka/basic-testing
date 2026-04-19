import { generateLinkedList } from './index';
import { describe, expect, test } from '@jest/globals';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3];
    const expectedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(elements);

    expect(result).toStrictEqual(expectedList);
  });

  test('should generate linked list from values 2', () => {
    const elements = ['a', 'b', 'c'];
    const result = generateLinkedList(elements);

    expect(result).toMatchSnapshot();
  });
});
