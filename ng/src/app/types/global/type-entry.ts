export type RawTypeEntry<K, V = any> = [keyof K, V];

export interface TypeEntry<K, V = any> {
  key: keyof K;
  value: V;
}

export function toTypeEntries<T>(item: T): TypeEntry<T>[];

export function toTypeEntries<T, V>(item:  { [s: string]: V } | ArrayLike<V>): TypeEntry<T, V>[] {
  return Object.entries<V>(item).map(([key, value]) => {
    return { key, value } as TypeEntry<T, V>;
  });
}
