[![Build Status](https://travis-ci.org/Yomguithereal/obliterator.svg)](https://travis-ci.org/Yomguithereal/obliterator)

# Obliterator

Obliterator is a dead simple JavaScript library providing miscellaneous higher-order iterator functions such as combining two or more iterators into a single one.

# Installation

```
npm install --save obliterator
```

# Usage

## Summary

* [chain](#chain)
* [combinations](#combinations)
* [consume](#consume)
* [permutations](#permutations)

## chain

Variadic function chaining all the given iterators.

```js
import chain from 'obliterator/chain';
// Or
import {chain} from 'obliterator';

const set1 = new Set('a');
const set2 = new Set('bc');

const chained = chain(set1.values(), set2.values());

chained.next();
>>> {done: false, value: 'a'}
chained.next();
>>> {done: false, value: 'b'}
```

## combinations

Returns an iterator of combinations of the given array and of the given size.

Note that for performance reasons, the yielded combination is always the same object.

```js
import combinations from 'obliterator/combinations';
// Or
import {combinations} from 'obliterator';

const iterator = combinations(['A', 'B', 'C', 'D'], 2);

iterator.next().value;
>>> ['A', 'B']
iterator.next().value;
>>> ['A', 'C']
```

## consume

Function consuming the given iterator and returning its values in an array.

```js
import consume from 'obliterator/consume';
// Or
import {consume} from 'obliterator';

const set = new Set([1, 2, 3]);

consume(set.values());
>>> [1, 2, 3]
```

## permutations

Returns an iterator of permutations of the given array and of the given size.

Note that for performance reasons, the yielded permutation is always the same object.

```js
import permutations from 'obliterator/permutations';
// Or
import {permutations} from 'obliterator';

let iterator = permutations([1, 2, 3]);

iterator.next().value
>>> [1, 2, 3]
iterator.next().value
>>> [1, 3, 2]

iterator = permutations(['A', 'B', 'C', 'D'], 2);

iterator.next().value;
>>> ['A', 'B']
iterator.next().value;
>>> ['A', 'C']
```

# Contribution

Contributions are obviously welcome. Please be sure to lint the code & add the relevant unit tests before submitting any PR.

```
git clone git@github.com:Yomguithereal/obliterator.git
cd obliterator
npm install

# To lint the code
npm run lint

# To run the unit tests
npm test
```

# License

[MIT](LICENSE.txt)
