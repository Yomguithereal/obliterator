/**
 * Obliterator Map Function
 * ===========================
 *
 * Function returning a iterator mapping the given iterator's values.
 */
var Iterator = require('./iterator.js');
var iter = require('./iter.js');

/**
 * Map.
 *
 * @param  {function} mapper - Map function.
 * @param  {Iterator} target - Target iterable.
 * @return {Iterator}
 */
module.exports = function map(mapper, target) {
  var iterator = iter(target);

  return new Iterator(function next() {
    var step = iterator.next();

    if (step.done) return step;

    return {
      value: mapper(step.value)
    };
  });
};
