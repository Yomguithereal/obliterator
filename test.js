/**
 * Obliterator Library Unit Tests
 * ===============================
 *
 * Unit test for the library's functions.
 */
var assert = require('assert'),
    lib = require('./');

describe('#.chain', function() {

  it('should properly chain the given iterators.', function() {
    var set1 = new Set([1, 2, 3]),
        set2 = new Set([3, 4, 5]);

    var iterator = lib.chain(set1.values(), set2.values());

    assert.deepEqual(lib.consume(iterator), [1, 2, 3, 3, 4, 5]);
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

    assert.deepEqual(lib.consume(set.values()), [1, 2, 3]);
  });
});
