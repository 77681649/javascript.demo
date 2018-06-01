/**
 * 实现 finally 功能
 */
Promise.observe = function(promise, cb) {
  return promise.then(
    function fulfilled(msg) {
      return Promise.resolve(msg).then(cb);
    },
    function rejected(err) {
      return Promise.resolve(err).then(cb);
    }
  );
};

Promise.observe(Promise.resolve(1), function(value) {
  console.log(value);
  console.log("cleanup");
});

Promise.observe(Promise.resolve(1), function(value) {
  console.log(value);
  console.log("cleanup");
});
