const _ = require("../demo.underscore");

let count = 0;
let previous = _.now();

function func() {
  const now = _.now();
  const wait = now - previous;
  previous = now;

  console.log(++count, wait);
}

const counter = _.throttle(func, 500, { leading: false, trailing: false });

setTimeout(counter, 100);
