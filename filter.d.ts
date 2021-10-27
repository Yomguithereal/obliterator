import {default as ObliteratorIterator} from './iterator';
import type {} from './types';

type PredicateFunction<T> = (item: T) => boolean;

export default function filter<T>(predicate: PredicateFunction<T>, iterator: Iterable<T>): ObliteratorIterator<T>;
