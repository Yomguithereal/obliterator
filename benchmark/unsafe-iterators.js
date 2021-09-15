var Obliterator = require('../iterator.js');

var SIZE = 500000000;

var i = 0;

var iterator = {
  next: function() {
    if (i >= SIZE)
      return {done: true};

    return {done: false, value: i++};
  }
};

var j = 0;
var payload = {done: false, value: null};

var unsafeIterator = {
  next() {
    if (j >= SIZE) {
      payload.done = true;
      payload.value = null;
    }

    payload.value = j++;

    return payload;
  }
};

var k = 0;

var obliterator = new Obliterator(function() {
  if (k >= SIZE)
    return {done: true};

  return {done: false, value: k++};
});

function* generator() {
  var l = 0;

  while (l < SIZE)
    yield l++;
}

var s, o, t;

console.time('Iterator');
while ((s = iterator.next(), !s.done))
  o = s.value;
console.timeEnd('Iterator');

console.time('Unsafe Iterator');
while ((s = unsafeIterator.next(), !s.done))
  o = s.value;
console.timeEnd('Unsafe Iterator');

console.time('Obliterator');
while ((s = obliterator.next(), !s.done))
  o = s.value;
console.timeEnd('Obliterator');

console.time('Generator');
var g = generator();
while ((s = g.next(), !s.done))
  o = s.value;
console.timeEnd('Generator');

console.time('Generator for...of');
var g = generator();
for (t of g)
  o = t;
console.timeEnd('Generator for...of');
