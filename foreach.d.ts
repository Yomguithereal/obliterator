import type {IntoInterator} from './types';

export default function forEach<T>(
  iterable: IntoInterator<T>,
  callback: (item: any, key: any) => void
): void;
