export type RawTypeEntry<K, V = any> = [keyof K, V];

export interface TypeEntry<K, V = any> {
  key: keyof K;
  value: V;
}

export function toTypeEntries<T>(item: T): TypeEntry<T>[];

export function toTypeEntries<T, V>(
  item: { [s: string]: V } | ArrayLike<V> & T
): TypeEntry<T, V>[] {
  return Object.entries<V>(item).map(([key, value]) => {
    return { key: key as keyof T, value };
  });
}

export function toTypeEntriesMap<T, V, R>(
  item: { [s: string]: V } | ArrayLike<V> & T,
  map: (item: { key: keyof T; value: V }) => R
): TypeEntry<T, R>[] {
  return Object.entries<V>(item).map(([key_, value]) => {
    const key = key_ as keyof T;
    return { key, value: map({ key, value }) };
  });
}
