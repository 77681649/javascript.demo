console.log("A");

setTimeout(() => console.log("B"), 0);
setTimeout(() => console.log("B"), 0);

setImmediate(() => console.log("D"));
setImmediate(() => console.log("D"));

process.nextTick(() => console.log("C"));
process.nextTick(() => console.log("C"));

new Promise(function(resolve) {
  console.log("E");
  resolve()
}).then(() => console.log("F"));
