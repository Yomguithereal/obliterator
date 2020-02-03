import chain from './chain';
import forEach from './foreach';

const set = new Set(['one']);
const map = new Map();

map.set('two', 2);

const chained: Iterator<number> = chain(set.values(), map.keys());

forEach(set.values(), (item, key) => console.log(item, key));
