import { deleteNestedKey, replaceKey } from '../nested';

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
        const result = replaceKey(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar' });
      });

      test('simple array', () => {
        const obj = {
          list: [{ key: 'http://www.example.com' }],
        };
        const result = replaceKey(obj, 'key', replacement);

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
        const result = replaceKey(obj, 'key', replacement);
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
        const result = replaceKey(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar', key1: undefined });
      });

      test('simple object with null', () => {
        const obj = {
          key: 'value',
          key1: null,
        };
        const result = replaceKey(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar', key1: null });
      });

      it('simple object with function', () => {
        const fn = () => 42;
        const obj = {
          key: 'value',
          fn,
        };
        const result = replaceKey(obj, 'key', replacement);

        expect(result).toEqual({ foo: 'bar', fn });
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
        const result = replaceKey(obj, 'key', replacementFn);

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

        const result = replaceKey(obj, 'k', replFn);

        expect(result).toEqual({
          k: 43,
          newProp: 1,
          list: [{ k: 44, newProp: 1 }],
        });
      });
    });
  });

  describe('delete', () => {
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
      const result = replaceKey(obj, 'key', replacementFn);

      expect(result).toEqual({ o: { foo: 'bar' } });
    });

    it('simple object', () => {
      const obj = {
        key: 'value',
        foo: 'bar',
      };
      const result = deleteNestedKey(obj, 'key');

      expect(result).toEqual({ foo: 'bar' });
    });

    it('nested object', () => {
      const obj = {
        key: 'value',
        foo: 'bar',
        o: {
          key: 'value2',
          foo2: 'bar2',
        },
      };
      const result = deleteNestedKey(obj, 'key');

      expect(result).toEqual({ foo: 'bar', o: { foo2: 'bar2' } });
    });
  });
});
