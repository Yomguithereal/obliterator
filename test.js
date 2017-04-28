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

describe('#.consume', function() {

  it('should properly consume the given iterator.', function() {
    var set = new Set([1, 2, 3]);

    assert.deepEqual(lib.consume(set.values()), [1, 2, 3]);
  });
});
