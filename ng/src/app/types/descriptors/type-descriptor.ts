export type TypeDescriptor<K, T> = {
  [P in keyof K]?: T;
};
