/**
 * Obliterator Match Function
 * ===========================
 *
 * Function returning an iterator over the matches of the given regex on the
 * target string.
 */
var Iterator = require('./iterator.js');

/**
 * Match.
 *
 * @param  {RegExp}   pattern - Regular expression to use.
 * @param  {string}   string  - Target string.
 * @return {Iterator}
 */
module.exports = function match(pattern, string) {
  var executed = false;

  if (!(pattern instanceof RegExp))
    throw new Error(
      'obliterator/match: invalid pattern. Expecting a regular expression.'
    );

  if (typeof string !== 'string')
    throw new Error('obliterator/match: invalid target. Expecting a string.');

  return new Iterator(function () {
    if (executed && !pattern.global) {
      pattern.lastIndex = 0;
      return {done: true};
    }

    executed = true;

    var m = pattern.exec(string);

    if (m) {
      // Empty matches don't move lastIndex. Unicode modes advance by a full code point.
      if (pattern.global && m[0] === '') {
        var index = pattern.lastIndex,
          first = string.charCodeAt(index),
          second = string.charCodeAt(index + 1);

        pattern.lastIndex +=
          (pattern.unicode || pattern.unicodeSets) &&
          first >= 0xd800 &&
          first <= 0xdbff &&
          second >= 0xdc00 &&
          second <= 0xdfff
            ? 2
            : 1;
      }

      return {value: m};
    }

    pattern.lastIndex = 0;
    return {done: true};
  });
};
