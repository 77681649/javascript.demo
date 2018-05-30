function* fib(max) {
  var a = 1;
  var b = 1;
  var i = 0;

  while (i < max) {
    yield a;

    [a, b] = [b, a + b];
    i++;
  }
}

for (let f of fib(10)) {
  console.log(f);
}
