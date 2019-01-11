function _flatten(arr: any, result: any[] = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      _flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
}

export const arrayHelper = {
  flatten<T>(...args: T[][][]): T[] {
    return _flatten(args);
  },
};
