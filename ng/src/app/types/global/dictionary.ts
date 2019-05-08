export type EntryKey = string | number | symbol;

export type Dictionary<T, TKey extends EntryKey = string> = {
  [key in TKey]: T;
};
