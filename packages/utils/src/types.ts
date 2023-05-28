export type TypeAtPath<T, P extends string[]> = P extends [infer K, ...infer Rest]
  ? K extends keyof T
    ? TypeAtPath<T[K], Rest extends string[] ? Rest : never>
    : never
  : T;

export type TypeAtStrPath<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? TypeAtStrPath<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
