function* range(min, max) {
  for (let i = min; i < max; i++) {
    yield i;
  }
}

function* gen(min, max) {
  console.log("start");
  yield* range(min, max); // 委托给另一个对象处理
  console.log("end");
}

for (let value of gen(1, 10)) {
  console.log(value);
}
