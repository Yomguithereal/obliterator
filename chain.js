/**
 * Obliterator Chain Function
 * ===========================
 *
 * Variadic function combining the given iterators.
 */
var Iterator = require('./iterator.js');

/**
 * Chain.
 *
 * @param  {...Iterator} iterators - Target iterators.
 * @return {Iterator}
 */
module.exports = function chain() {
  var iterators = arguments,
      done = false,
      current,
      i = -1;

  return new Iterator(function iterate() {
    if (done)
      return {done: true};

    if (!current) {
      i++;

      if (i >= iterators.length) {
        done = true;
        return {done: true};
      }

      current = iterators[i];
    }

    var step = current.next();

    if (step.done) {
      current = null;
      return iterate();
    }

    return step;
  });
};
