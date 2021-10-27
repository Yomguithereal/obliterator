import chain from './chain';
import forEach from './foreach';

const set = new Set(['one']);
const map: Map<string, number> = new Map();

map.set('two', 2);

const chained: Iterator<string> = chain(set, map.keys());

forEach(set.values(), (item, key) => console.log(item, key));
