import {default as ObliteratorIterator} from './iterator.js';

export default function chain<T>(...iterables: Iterable<T>[]): ObliteratorIterator<T>;
