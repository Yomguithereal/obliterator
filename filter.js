/**
 * Obliterator Filter Function
 * ===========================
 *
 * Function returning a iterator filtering the given iterator.
 */
var Iterator = require('./iterator.js');
var iter = require('./iter.js');

/**
 * Filter.
 *
 * @param  {function} predicate - Predicate function.
 * @param  {Iterable} target - Target iterable.
 * @return {Iterator}
 */
module.exports = function filter(predicate, target) {
  const iterator = iter(target);

  return new Iterator(function next() {
    var step = iterator.next();

    if (step.done)
      return step;

    if (!predicate(step.value))
      return next();

    return step;
  });
};
