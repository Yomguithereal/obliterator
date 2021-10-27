export interface Sequence {
  length: number;
  slice(from: number, to?: number): Sequence;
}

export type IntoInterator<T> = Iterable<T> | Iterator<T> | Sequence;
