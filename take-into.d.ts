import {default as ObliteratorIterator} from './iterator.js';

export default function takeInto<C, T>(ArrayClass: C, iterator: Iterator<T>, n: number): C<T>;
