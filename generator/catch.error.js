function* genFn() {
  try {
    xx = sdf;
    yield 1;
  } catch (err) {
    return err
  }
}

const gen = genFn();

console.log(gen.next());
