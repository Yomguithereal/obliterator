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

var s, o;

console.time('Iterator');
while ((s = iterator.next(), !s.done))
  o = s.value;
console.timeEnd('Iterator');

console.time('Unsafe Iterator');
while ((s = unsafeIterator.next(), !s.done))
  o = s.value;
console.timeEnd('Unsafe Iterator');
