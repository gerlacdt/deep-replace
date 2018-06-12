## Deep replacement of object keys

This is a simple module which only provides one function:
`deepReplace(o: object, key: string, fn: replacementFunction)`

`deepReplace()` replaces the given key in the given object with the
use of the replacement-function. Nested keys are replaced in all
levels.

Simple use-cases are:
- deeply replace the value of the given key
- deeply delete the given key in the given object
- deeply replace the given key and deeply add additional properties on
  levels where the given key exists


### Install

``` bash
npm install --save deep-replace
```

### Usage

#### Replace key with new value

```typescript
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

const expected = {
   foo: 2,
   list: [{ foo: 3 }],
   nested: {
     foo: 4
   },
};
```

#### Replace key with new key and new value

```typescript
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

const replacement = (_key: string, value: any): object => {
  return {
    foo2: value + '2',
  };
};

const result = deepReplace(obj, 'foo', replacement);

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
```


#### Remove key from object

```typescript
const obj = {
  foo: 'value',
  o: {
    a: 'b',
    foo: 'value2',
  },
};
const replacementFn = (_key: string, _value: any): object => {
  return {}; // replace with empty object means delete key
};
const result = deepReplace(obj, 'foo', replacementFn);

expect(result).toEqual({ o: { a: 'b' } });
```


#### Replace key with new key and new value with additional key-value pairs

```typescript
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
    [key]: value + 1,  // change value of key
    newProp: 1,  // add new property to object on all levels where key exists
  };
};

const result = deepReplace(obj, 'k', replFn);

expect(result).toEqual({
  k: 43,
  newProp: 1,
  list: [{ k: 44, newProp: 1 }],
});
```
