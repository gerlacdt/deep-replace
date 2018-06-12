import { deepReplace } from '../nested';

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
              key: 'value',
              c: { key: 'value' },
            },
          ],
          o: {
            key: 'value',
            list: [{ key: 'value' }, { a: 'b' }],
          },
        };
        const result = deepReplace(obj, 'key', replacement);
        const expected = {
          list: [{ a: 'b', foo: 'bar', c: { foo: 'bar' } }],
          o: { foo: 'bar', list: [{ foo: 'bar' }, { a: 'b' }] },
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
          key: 'value',
          o: {
            foo: 'bar',
            key: 'value2',
          },
        };
        const replacementFn = (_key: string, _value: any): object => {
          return {};
        };
        const result = deepReplace(obj, 'key', replacementFn);

        expect(result).toEqual({ o: { foo: 'bar' } });
      });
    });

    describe('re-use existing key and value', () => {
      test('simple object', () => {
        const obj = {
          key: 42,
        };
        const replacementFn = (key: string, value: any): object => {
          return {
            [key]: key + JSON.stringify(value),
          };
        };
        const result = deepReplace(obj, 'key', replacementFn);

        expect(result).toEqual({ key: 'key42' });
      });

      test('complex object, add new key-value pairs', () => {
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
