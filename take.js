// eslint-disable-next-line no-console
console.warn(
  "[obliterator] 'take' is deprecated since version 2.0.6 and will be removed in version 3. Use Array.from() instead: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from"
);

/* eslint no-constant-condition: 0 */
/**
 * Obliterator Take Function
 * ==========================
 *
 * Function taking n or every value of the given iterator and returns them
 * into an array.
 */
var iter = require('./iter.js');

/**
 * Take.
 *
 * @deprecated since version 2.0.6 and will be removed in version 3. Use Array.from() instead: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 *
 * @param  {Iterable} iterable - Target iterable.
 * @param  {number}   [n]      - Optional number of items to take.
 * @return {array}
 */
module.exports = function take(iterable, n) {
  var l = arguments.length > 1 ? n : Infinity,
    array = l !== Infinity ? new Array(l) : [],
    step,
    i = 0;

  var iterator = iter(iterable);

  while (true) {
    if (i === l) return array;

    step = iterator.next();

    if (step.done) {
      if (i !== n) array.length = i;

      return array;
    }

    array[i++] = step.value;
  }
};
