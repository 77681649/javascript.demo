function co(generatorFunction) {
  return function(...args) {
    var gen = generatorFunction(...args);

    return new Promise((resolve, reject) => {
      handle(gen.next());

      function handle(result) {
        var { value, done } = result;

        // 根据结果判断,是继续执行还是结束执行
        try {
          done ? resolve(value) : next(value);
        } catch (err) {
          reject(err);
        }
      }

      function next(value) {
        isPromise(value) 
          ? value.then(_next).catch(onRejected)   // 等到Promise resolve之后,继续执行
          : _next(value);                         // 非Promise,直接继续执行
      }

      function _next(value) {
        handle(gen.next(value));
      }

      function onRejected(err) {
        // 如果, gen内部捕获了错误,那么继续执行
        // 否则, promise = "reject" 结束执行
        try {
          handle(gen.throw(err));
        } catch (err) {
          reject(err);
        }
      }
    });
  };
}

function isPromise(v) {
  return v && typeof v === "object" && typeof v.then === "function";
}

module.exports = co;
