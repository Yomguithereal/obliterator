/**
 * Obliterator Iter Function
 * ==========================
 *
 * Function coercing values to an iterator. It can be quite useful when needing
 * to handle iterables and iterators the same way.
 */
var Iterator = require('./iterator.js');

function iterOrNull(target) {
  // Indexed sequence
  if (
    typeof target === 'string' ||
    Array.isArray(target) ||
    (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(target))
  )
    return Iterator.fromSequence(target);

  // Invalid value
  if (typeof target !== 'object' || target === null) return null;

  // Iterable
  if (
    typeof Symbol !== 'undefined' &&
    typeof target[Symbol.iterator] === 'function'
  )
    return target[Symbol.iterator]();

  // Iterator duck-typing
  if (typeof target.next === 'function') return target;

  // Invalid object
  return null;
}

module.exports = function iter(target) {
  var iterator = iterOrNull(target);

  if (!iterator)
    throw new Error(
      'obliterator: target is not iterable nor a valid iterator.'
    );

  return iterator;
};
