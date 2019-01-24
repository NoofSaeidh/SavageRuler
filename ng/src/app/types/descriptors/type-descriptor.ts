export type TypeDescriptor<T, D> = {
  [P in keyof T]?: D;
};
