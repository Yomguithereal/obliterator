import {default as ObliteratorIterator} from './iterator';

type MapFunction<S, T> = (item: S) => T;

export default function map<S, T>(predicate: MapFunction<S, T>, iterator: Iterator<S>): ObliteratorIterator<T>;
