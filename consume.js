/**
 * Obliterator Consume Function
 * =============================
 *
 * Function consuming the given iterator into an array.
 */

/**
 * Consume.
 *
 * @param  {Iterator} iterator - Target iterator.
 * @param  {number}   [size]   - Optional size.
 * @return {array}
 */
module.exports = function consume(iterator, size) {
  var array = arguments.length > 1 ? new Array(size) : [],
      step,
      i = 0;

  while ((step = iterator.next(), !step.done))
    array[i++] = step.value;

  return array;
};
