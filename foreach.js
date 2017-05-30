/**
 * Obliterator ForEach Function
 * =============================
 *
 * Helper function used to easily iterate over an iterator.
 */
var Iterator = require('./iterator.js');

/**
 * ForEach.
 *
 * @param  {Iterator} iterator - Target iterator.
 * @param  {function} callback - Callback function.
 */
module.exports = function forEach(iterator, callback) {

  if (!Iterator.is(iterator))
    throw new Error('obliterator/foreach: invalid iterator.');

  if (typeof callback !== 'function')
    throw new Error('obliterator/foreach: callback is not a function.');

  var step,
      i = 0;

  while ((step = iterator.next(), !step.done))
    callback(step.value, i++);
};
