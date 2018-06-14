import { deepReplace } from '../';

describe('nested', () => {
  describe('replace', () => {
    describe('with new key and value', () => {
      function replacement(_key: string, _value: any): object {
        return {
          foo: 'bar',
        };
      }

      test('simple object', () => {
        const obj = {
          key: 'value',
        };
        const result = deepReplace(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar' });
      });

      test('simple array', () => {
        const obj = {
          list: [{ key: 'http://www.example.com' }],
        };
        const result = deepReplace(obj, 'key', replacement);

        expect(result).toEqual({ list: [{ foo: 'bar' }] });
      });

      test('complex object with nested arrays and objects', () => {
        const obj = {
          list: [
            {
              a: 'b',
              foo: 'value',
              c: { foo: 'value' },
            },
          ],
          o: {
            foo: 'value',
            list: [{ foo: 'value' }, { a: 'b' }],
          },
        };

        const replaceFn = (_key: string, value: any): object => {
          return {
            foo2: value + '2',
          };
        };

        const result = deepReplace(obj, 'foo', replaceFn);
        const expected = {
          list: [
            {
              a: 'b',
              foo2: 'value2',
              c: { foo2: 'value2' },
            },
          ],
          o: {
            foo2: 'value2',
            list: [{ foo2: 'value2' }, { a: 'b' }],
          },
        };

        expect(result).toEqual(expected);
      });

      test('simple object with undefined', () => {
        const obj = {
          key: 'value',
          key1: undefined,
        };
        const result = deepReplace(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar', key1: undefined });
      });

      test('simple object with null', () => {
        const obj = {
          key: 'value',
          key1: null,
        };
        const result = deepReplace(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar', key1: null });
      });

      test('simple object with function', () => {
        const fn = () => 42;
        const obj = {
          key: 'value',
          fn,
        };
        const result = deepReplace(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar', fn });
      });

      test('simple object, delete nested keys', () => {
        const obj = {
          foo: 'value',
          o: {
            a: 'b',
            foo: 'value2',
          },
        };
        const replacementFn = (_key: string, _value: any): object => {
          return {}; // set empty object means delete given key
        };
        const result = deepReplace(obj, 'foo', replacementFn);

        expect(result).toEqual({ o: { a: 'b' } });
      });
    });

    describe('re-use existing key and value', () => {
      test('simple replacement', () => {
        const obj = {
          foo: 1,
          list: [{ foo: 2 }],
          nested: {
            foo: 3,
          },
        };
        const replacementFn = (key: string, value: any): object => {
          return {
            [key]: value + 1,
          };
        };
        const result = deepReplace(obj, 'foo', replacementFn);
        expect(result).toEqual({
          foo: 2,
          list: [{ foo: 3 }],
          nested: { foo: 4 },
        });
      });

      test('add new key-value pairs', () => {
        const obj = {
          k: 42,
          list: [
            {
              k: 43,
            },
          ],
        };
        const replFn = (key: string, value: any): object => {
          return {
            [key]: value + 1,
            newProp: 1,
          };
        };

        const result = deepReplace(obj, 'k', replFn);

        expect(result).toEqual({
          k: 43,
          newProp: 1,
          list: [{ k: 44, newProp: 1 }],
        });
      });
    });
  });
});
