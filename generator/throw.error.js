function* genFn() {
  console.log('exec')
  try {
    yield 1;
  } catch (err) {
    return err;
  }

  return "ok";
}

const gen = genFn();

const { value } = gen.return('haha');

// if (value == 1) {
//   console.log(gen.throw("error"));
// }

console.log(gen.next());
