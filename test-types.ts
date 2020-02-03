import chain from './chain';

const set = new Set(['one']);
const map = new Map();

map.set('two', 2);

const chained: Iterator<number> = chain(set.values(), map.keys());
