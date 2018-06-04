function* producer(produce) {
  try {
    while (true) {
      yield produce();
    }
  } finally {
    console.log("generator finally");
  }
}

function fibBuilder() {
  let fib1 = 0;
  let fib2 = 1;

  return function() {
    [fib1, fib2] = [fib2, fib1 + fib2];
    return fib2;
  };
}

let gen = producer(fibBuilder());
let count = 0;

for (let fib of gen) {
  console.log(fib);
  count++;
  if (count > 9) break;
}
