const _ = require("../demo.underscore");

let count = 0;
let previous = _.now();

function func() {
  const now = _.now();
  const wait = now - previous;
  previous = now;

  console.log(++count, wait);
}

const counter = _.debounce(func, 500);

setInterval(counter, 100);
