/**
 * Obliterator Library Unit Tests
 * ===============================
 *
 * Unit test for the library's functions.
 */
var assert = require('assert'),
    lib = require('./');

var Iterator = lib.Iterator;

describe('Iterator', function() {

  describe('Iterator.is', function() {
    it('should properly detect iterators.', function() {

      assert.strictEqual(Iterator.is(null), false);
      assert.strictEqual(Iterator.is([1, 2, 3]), false);
      assert.strictEqual(Iterator.is(new Iterator(function() {
        return {done: true};
      })), true);
      assert.strictEqual(Iterator.is((new Set()).values()), true);
    });
  });

  describe('Iterator.empty', function() {

    it('should return an empty iterator.', function() {

      var empty = Iterator.empty();

      assert.strictEqual(empty.next().done, true);
    });
  });

  describe('Iterator.of', function() {

    it('should return an iterator of a single value.', function() {

      var iterator = Iterator.of(34);

      assert.strictEqual(iterator.next().value, 34);
      assert.strictEqual(iterator.next().done, true);
    });

    it('should be variadic.', function() {
      var iterator = Iterator.of(1, 2, 3);

      assert.deepEqual(lib.take(iterator), [1, 2, 3]);
    });
  });

  describe('Iterator.fromSequence', function() {

    it('should work with strings.', function() {
      var iterator = Iterator.fromSequence('hello');

      assert.deepStrictEqual(lib.take(iterator), ['h', 'e', 'l', 'l', 'o']);
    });

    it('should work with arrays.', function() {
      var iterator = Iterator.fromSequence([3, 4, 5]);

      assert.deepStrictEqual(lib.take(iterator), [3, 4, 5]);
    });
  });
});

describe('#.iter', function() {
  it('should properly coerce targets to iterators or throw.', function() {
    var tests = [
      [null, false],
      [new Set([0, 1, 2]), true],
      [(new Set([0, 1, 2])).values(), true],
      ['test', true],
      [{hello: 'world'}, false],
      [[3, 4, 5], true],
      [new Uint16Array([4, 5, 6]), true]
    ];

    tests.forEach(function(test) {
      if (test[1]) {
        assert.strictEqual(Iterator.is(lib.iter(test[0])), true);
      }
      else {
        assert.throws(function() {
          lib.iter(test[0]);
        }, /not/);
      }
    });
  });
});

describe('#.chain', function() {

  it('should properly chain the given iterators.', function() {
    var set1 = new Set([1, 2, 3]),
        set2 = new Set([3, 4, 5]);

    var iterator = lib.chain(set1.values(), set2.values());

    assert.deepEqual(lib.take(iterator), [1, 2, 3, 3, 4, 5]);
  });

  it('should also work with iterables.', function() {
    var set1 = new Set([1, 2, 3]),
        set2 = new Set([3, 4, 5]);

    var iterator = lib.chain(set1, set2.values(), set1);

    assert.deepEqual(lib.take(iterator), [1, 2, 3, 3, 4, 5, 1, 2, 3]);
  });
});

describe('#.combinations', function() {

  it('should throw when given arguments are invalid.', function() {
    assert.throws(function() {
      lib.combinations(null, 3);
    }, /array/);

    assert.throws(function() {
      lib.combinations([1, 2, 3], 'test');
    }, /number/);

    assert.throws(function() {
      lib.combinations([1, 2, 3], 5);
    }, /exceed/);
  });

  it('should produce the correct combinations.', function() {
    var iterator = lib.combinations('ABCD'.split(''), 2);

    assert.deepEqual(iterator.next().value, ['A', 'B']);
    assert.deepEqual(iterator.next().value, ['A', 'C']);
    assert.deepEqual(iterator.next().value, ['A', 'D']);
    assert.deepEqual(iterator.next().value, ['B', 'C']);
    assert.deepEqual(iterator.next().value, ['B', 'D']);
    assert.deepEqual(iterator.next().value, ['C', 'D']);
    assert.deepEqual(iterator.next().done, true);

    iterator = lib.combinations([0, 1, 2, 3], 3);

    assert.deepEqual(iterator.next().value, [0, 1, 2]);
    assert.deepEqual(iterator.next().value, [0, 1, 3]);
    assert.deepEqual(iterator.next().value, [0, 2, 3]);
    assert.deepEqual(iterator.next().value, [1, 2, 3]);
    assert.deepEqual(iterator.next().done, true);
  });

  it('should handle cases when the size of subsequence is the same as the array.', function() {
    var iterator = lib.combinations([1, 2, 3], 3);

    assert.deepEqual(iterator.next().value, [1, 2, 3]);
    assert.deepEqual(iterator.next().done, true);
  });
});

describe('#.consume', function() {

  it('should properly consume the given iterator.', function() {
    var set = new Set([1, 2, 3]);
    var iterator = set.values();

    lib.consume(iterator);

    assert.strictEqual(iterator.next().done, true);
  });

  it('should be able to consume n elements', function() {
    var set = new Set([1, 2, 3]);
    var iterator = set.values();

    lib.consume(iterator, 2);

    assert.deepEqual(lib.take(iterator), [3]);
  });
});

describe('#.filter', function() {

  it('should correctly filter the given iterator.', function() {
    var set = new Set([1, 2, 3, 4, 5]);

    var even = function(a) {
      return a % 2 === 0;
    };

    var iterator = lib.filter(even, set.values());

    assert.deepEqual(lib.take(iterator), [2, 4]);
  });

  it('should work with arbitrary iterable.', function() {
    var set = new Set([1, 2, 3, 4, 5]);

    var even = function(a) {
      return a % 2 === 0;
    };

    var iterator = lib.filter(even, set);

    assert.deepEqual(lib.take(iterator), [2, 4]);
  });
});

describe('#.forEachWithNullKeys', function() {
  var forEach = lib.forEach.forEachWithNullKeys;

  it('should throw when given arguments are invalid.', function() {
    assert.throws(function() {
      forEach(null, 3);
    }, /iterable/);

    assert.throws(function() {
      forEach(Iterator.of(4), 'test');
    }, /callback/);
  });

  it('should correctly iterate over the given iterator.', function() {
    var set = new Set([1, 2, 3]);

    var c = 0;

    forEach(set.values(), function(value, i) {
      assert.strictEqual(value, c + 1);
      assert.strictEqual(i, null);
      c++;
    });

    assert.strictEqual(c, 3);
  });

  it('should properly iterate over an array.', function() {
    var array = [1, 2, 3],
        i = 0;

    forEach(array, function(value, key) {
      assert.strictEqual(key, null);
      assert.strictEqual(value, i + 1);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an arguments object.', function() {
    var i = 0;

    function test() {
      forEach(arguments, function(value, key) {
        assert.strictEqual(key, null);
        assert.strictEqual(value, i + 1);
        i++;
      });
    }

    test(1, 2, 3);

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over a string.', function() {
    var string = 'abc',
        map = ['a', 'b', 'c'],
        i = 0;

    forEach(string, function(value, key) {
      assert.strictEqual(key, null);
      assert.strictEqual(value, map[i]);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an object.', function() {
    var object = Object.create({four: 5});
    object.one = 1;
    object.two = 2;
    object.three = 3;

    var keys = Object.keys(object),
        i = 1;

    forEach(object, function(value, key) {
      assert.strictEqual(value, i);
      assert.strictEqual(key, keys[i - 1]);
      i++;
    });

    assert.strictEqual(i - 1, 3);
  });

  it('should properly iterate over a set.', function() {
    var set = new Set([1, 2, 3]),
        i = 0;

    forEach(set, function(value, key) {
      assert.strictEqual(value, ++i);
      assert.strictEqual(key, null);
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over a map.', function() {
    var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
        values = [1, 2, 3],
        keys = ['one', 'two', 'three'],
        i = 0;

    forEach(map, function(value, key) {
      assert.strictEqual(value, values[i]);
      assert.strictEqual(key, keys[i]);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an arbitrary iterator.', function() {
    var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
        i = 0;

    forEach(map.values(), function(value, key) {
      assert.strictEqual(value, i + 1);
      assert.strictEqual(key, null);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an arbitrary iterable.', function() {
    function Iterable() {}

    Iterable.prototype[Symbol.iterator] = function() {
      var i = 0;

      return {
        next: function() {
          if (i < 3)
            return {value: ++i};
          return {done: true};
        }
      };
    };

    var j = 0;

    forEach(new Iterable(), function(value, key) {
      assert.strictEqual(value, j + 1);
      assert.strictEqual(key, null);
      j++;
    });

    assert.strictEqual(j, 3);
  });
});

describe('#.forEach', function() {

  it('should throw when given arguments are invalid.', function() {
    assert.throws(function() {
      lib.forEach(null, 3);
    }, /iterable/);

    assert.throws(function() {
      lib.forEach(Iterator.of(4), 'test');
    }, /callback/);
  });

  it('should correctly iterate over the given iterator.', function() {
    var set = new Set([1, 2, 3]);

    var c = 0;

    lib.forEach(set.values(), function(value, i) {
      assert.strictEqual(value, i + 1);
      c++;
    });

    assert.strictEqual(c, 3);
  });

  it('should properly iterate over an array.', function() {
    var array = [1, 2, 3],
        i = 0;

    lib.forEach(array, function(value, key) {
      assert.strictEqual(i, key);
      assert.strictEqual(value, i + 1);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an arguments object.', function() {
    var i = 0;

    function test() {
      lib.forEach(arguments, function(value, key) {
        assert.strictEqual(i, key);
        assert.strictEqual(value, i + 1);
        i++;
      });
    }

    test(1, 2, 3);

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over a string.', function() {
    var string = 'abc',
        map = ['a', 'b', 'c'],
        i = 0;

    lib.forEach(string, function(value, key) {
      assert.strictEqual(i, key);
      assert.strictEqual(value, map[i]);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an object.', function() {
    var object = Object.create({four: 5});
    object.one = 1;
    object.two = 2;
    object.three = 3;

    var keys = Object.keys(object),
        i = 1;

    lib.forEach(object, function(value, key) {
      assert.strictEqual(value, i);
      assert.strictEqual(key, keys[i - 1]);
      i++;
    });

    assert.strictEqual(i - 1, 3);
  });

  it('should properly iterate over a set.', function() {
    var set = new Set([1, 2, 3]),
        i = 0;

    lib.forEach(set, function(value, key) {
      assert.strictEqual(value, ++i);
      assert.strictEqual(key, i);
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over a map.', function() {
    var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
        values = [1, 2, 3],
        keys = ['one', 'two', 'three'],
        i = 0;

    lib.forEach(map, function(value, key) {
      assert.strictEqual(value, values[i]);
      assert.strictEqual(key, keys[i]);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an arbitrary iterator.', function() {
    var map = new Map([['one', 1], ['two', 2], ['three', 3]]),
        i = 0;

    lib.forEach(map.values(), function(value, key) {
      assert.strictEqual(value, i + 1);
      assert.strictEqual(key, i);
      i++;
    });

    assert.strictEqual(i, 3);
  });

  it('should properly iterate over an arbitrary iterable.', function() {
    function Iterable() {}

    Iterable.prototype[Symbol.iterator] = function() {
      var i = 0;

      return {
        next: function() {
          if (i < 3)
            return {value: ++i};
          return {done: true};
        }
      };
    };

    var j = 0;

    lib.forEach(new Iterable(), function(value, key) {
      assert.strictEqual(value, j + 1);
      assert.strictEqual(key, j);
      j++;
    });

    assert.strictEqual(j, 3);
  });
});

describe('#.map', function() {

  it('should correctly map the given iterator.', function() {
    var set = new Set([1, 2, 3, 4, 5]);

    var inc = function(a) {
      return a + 1;
    };

    var iterator = lib.map(inc, set.values());

    assert.deepEqual(lib.take(iterator), [2, 3, 4, 5, 6]);
  });

  it('should also work with arbitrary iterables.', function() {
    var concat = function(a) {
      return a + 't';
    };

    var iterator = lib.map(concat, 'abc');

    assert.deepEqual(lib.take(iterator), ['at', 'bt', 'ct']);
  });
});

describe('#.match', function() {

  it('should throw when given invalid arguments.', function() {
    assert.throws(function() {
      lib.match(null);
    }, /pattern/);

    assert.throws(function() {
      lib.match(/t/, null);
    }, /target/);
  });

  it('should correctly iterate over the matches.', function() {
    var index = function(match) {
      return match.index;
    };

    var iterator = lib.match(/t/, 'test');

    var result = lib.take(iterator).map(index);

    assert.deepEqual(result, [0]);

    iterator = lib.match(/t/g, 'test');

    result = lib.take(iterator).map(index);

    assert.deepEqual(result, [0, 3]);
  });
});

describe('#.permutations', function() {

  it('should throw when given arguments are invalid.', function() {
    assert.throws(function() {
      lib.permutations(null, 3);
    }, /array/);

    assert.throws(function() {
      lib.permutations([1, 2, 3], 'test');
    }, /number/);

    assert.throws(function() {
      lib.permutations([1, 2, 3], 5);
    }, /exceed/);
  });

  it('should produce the correct permutations.', function() {
    var iterator = lib.permutations('ABCD'.split(''), 2);

    assert.deepEqual(iterator.next().value, ['A', 'B']);
    assert.deepEqual(iterator.next().value, ['A', 'C']);
    assert.deepEqual(iterator.next().value, ['A', 'D']);
    assert.deepEqual(iterator.next().value, ['B', 'A']);
    assert.deepEqual(iterator.next().value, ['B', 'C']);
    assert.deepEqual(iterator.next().value, ['B', 'D']);
    assert.deepEqual(iterator.next().value, ['C', 'A']);
    assert.deepEqual(iterator.next().value, ['C', 'B']);
    assert.deepEqual(iterator.next().value, ['C', 'D']);
    assert.deepEqual(iterator.next().value, ['D', 'A']);
    assert.deepEqual(iterator.next().value, ['D', 'B']);
    assert.deepEqual(iterator.next().value, ['D', 'C']);
    assert.deepEqual(iterator.next().done, true);

    iterator = lib.permutations([0, 1, 2], 3);

    assert.deepEqual(iterator.next().value, [0, 1, 2]);
    assert.deepEqual(iterator.next().value, [0, 2, 1]);
    assert.deepEqual(iterator.next().value, [1, 0, 2]);
    assert.deepEqual(iterator.next().value, [1, 2, 0]);
    assert.deepEqual(iterator.next().value, [2, 0, 1]);
    assert.deepEqual(iterator.next().value, [2, 1, 0]);
    assert.deepEqual(iterator.next().done, true);

    iterator = lib.permutations([0, 1, 2]);

    assert.deepEqual(iterator.next().value, [0, 1, 2]);
    assert.deepEqual(iterator.next().value, [0, 2, 1]);
    assert.deepEqual(iterator.next().value, [1, 0, 2]);
    assert.deepEqual(iterator.next().value, [1, 2, 0]);
    assert.deepEqual(iterator.next().value, [2, 0, 1]);
    assert.deepEqual(iterator.next().value, [2, 1, 0]);
    assert.deepEqual(iterator.next().done, true);
  });
});

describe('#.powerSet', function() {

  it('should return the correct power set.', function() {
    var iterator = lib.powerSet('ABC'.split(''));

    assert.deepEqual(iterator.next().value, []);
    assert.deepEqual(iterator.next().value, ['A']);
    assert.deepEqual(iterator.next().value, ['B']);
    assert.deepEqual(iterator.next().value, ['C']);
    assert.deepEqual(iterator.next().value, ['A', 'B']);
    assert.deepEqual(iterator.next().value, ['A', 'C']);
    assert.deepEqual(iterator.next().value, ['B', 'C']);
    assert.deepEqual(iterator.next().value, ['A', 'B', 'C']);
    assert.deepEqual(iterator.next().done, true);
  });
});

describe('#.range', function() {

  it('should return the correct range.', function() {

    assert.deepEqual(
      lib.take(lib.range(4)),
      [0, 1, 2, 3]
    );

    assert.deepEqual(
      lib.take(lib.range(1, 5)),
      [1, 2, 3, 4]
    );

    assert.deepEqual(
      lib.take(lib.range(0, 20, 5)),
      [0, 5, 10, 15]
    );

    // TODO: handle 0 step
    // TODO: handle negatives
    // assert.deepEqual(
    //   lib.take(lib.range(1, 4, 0)),
    //   [0, 1, 1, 1]
    // );

    assert.deepEqual(
      lib.take(lib.range(0)),
      []
    );
  });
});

describe('#.split', function() {

  it('should throw when given invalid arguments.', function() {
    assert.throws(function() {
      lib.split(null);
    }, /pattern/);

    assert.throws(function() {
      lib.split(/t/, null);
    }, /target/);
  });

  it('should correctly iterate over the splits.', function() {
    var iterator = lib.split(/t/, 'hellotworldtsuper');

    var results = lib.take(iterator);

    assert.deepEqual(results, ['hello', 'world', 'super']);

    iterator = lib.split(/\|/g, '|hello|world|');

    results = lib.take(iterator);

    assert.deepEqual(results, ['', 'hello', 'world', '']);
  });
});

describe('#.take', function() {

  it('should properly take the given iterator.', function() {
    var set = new Set([1, 2, 3]);

    assert.deepEqual(lib.take(set.values()), [1, 2, 3]);
  });

  it('should be able to return n elements', function() {
    var set = new Set([1, 2, 3]);

    assert.deepEqual(lib.take(set.values(), 2), [1, 2]);
  });

  it('should slice end arrays.', function() {
    var set = new Set([1, 2, 3]);
    var iterator = set.values();

    var chunk = lib.take(iterator, 2);
    assert.deepEqual(chunk, [1, 2]);

    chunk = lib.take(iterator, 2);
    assert.deepEqual(chunk, [3]);

    chunk = lib.take(iterator, 2);
    assert.deepEqual(chunk, []);
  });

  it('should work with arbitrary iterables.', function() {
    var set = new Set([1, 2, 3]);

    assert.deepEqual(lib.take(set), [1, 2, 3]);
  });
});

describe('#.takeInto', function() {

  it('should properly take the given iterator.', function() {
    var set = new Set([1, 2, 3]);

    var array = lib.takeInto(Uint8Array, set.values(), 3);

    assert.deepEqual(Array.from(array), [1, 2, 3]);
    assert(array instanceof Uint8Array);
  });

  it('should be able to return n elements', function() {
    var set = new Set([1, 2, 3]);

    var array = lib.takeInto(Uint8Array, set.values(), 2);

    assert.deepEqual(Array.from(array), [1, 2]);
    assert(array instanceof Uint8Array);
  });

  it('should slice end arrays.', function() {
    var set = new Set([1, 2, 3]);
    var iterator = set.values();

    var chunk = lib.takeInto(Uint8Array, iterator, 2);
    assert.deepEqual(Array.from(chunk), [1, 2]);
    assert(chunk instanceof Uint8Array);

    chunk = lib.takeInto(Uint8Array, iterator, 2);
    assert.deepEqual(Array.from(chunk), [3]);
    assert(chunk instanceof Uint8Array);

    chunk = lib.takeInto(Uint8Array, iterator, 2);
    assert.deepEqual(Array.from(chunk), []);
    assert(chunk instanceof Uint8Array);
  });

  it('should be able to work with arbitrary iterables.', function() {
    var set = new Set([1, 2, 3]);

    var array = lib.takeInto(Uint8Array, set, 3);

    assert.deepEqual(Array.from(array), [1, 2, 3]);
    assert(array instanceof Uint8Array);
  });
});

