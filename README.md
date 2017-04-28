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
* [consume](#consume)

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
