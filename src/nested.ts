type replacementFn = (key: string, value: any) => object;

export function replaceKey(
  o: any,
  key: string,
  replacement: replacementFn,
): any {
  if (Array.isArray(o)) {
    // handle array first, because array is an object too
    const result = [];
    for (const item of o) {
      result.push(replaceKey(item, key, replacement));
    }
    return result;
  } else if (typeof o === 'object' && o !== null) {
    // handle object
    let result: any = {};
    for (const prop in o) {
      if (prop === key) {
        const replacementObj = replacement(key, o[prop]);
        // if (replacementObj.value) {
        // support nested property delete (only replace if value is defined)
        result = { ...result, ...replacementObj };
        // result[replacementObj.key] = replacementObj.value;
        // }
      } else {
        result[prop] = replaceKey(o[prop], key, replacement);
      }
    }
    return result;
  }
  return o; // handle number, string, function
}

export function deleteNestedKey(o: any, key: string): any {
  const fn = (_key: string, _value: any): object => {
    return {};
  };
  return replaceKey(o, key, fn);
}