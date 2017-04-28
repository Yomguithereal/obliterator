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
 * @return {array}
 */
module.exports = function consume(iterator) {
  var array = [],
      step;

  while ((step = iterator.next(), !step.done))
    array.push(step.value);

  return array;
};
