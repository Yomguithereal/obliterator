import {default as ObliteratorIterator} from './iterator';
import type {IntoInterator} from './types';

type PredicateFunction<T> = (item: T) => boolean;

export default function filter<T>(
  predicate: PredicateFunction<T>,
  target: IntoInterator<T>
): ObliteratorIterator<T>;
