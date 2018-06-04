!(function(global, factory) {
  factory(global);
})(this, function factory(global) {
  const Promsie = global && global.Promise;

  if (!Promise) {
    throw new Error("The Promise is undefined.");
  }

  const extendFunctions = {
    wrap(fn) {
      return function(...args) {
        return new Promise((resolve, reject) => {
          fn.apply(
            null,
            args.concat(function(err, v) {
              err ? reject(err) : resolve(v);
            })
          );
        });
      };
    },

    /**
     * 判断value是否是一个Thenable
     * @param {Any} value
     * @returns {Boolean}
     */
    isPromise(value) {
      return value && typeof value.then === "function";
    },

    /**
     * 类似done, 无论promise最终的状态如何 , 都会执行指定的callback
     * @param {Promise} promise
     * @param {Function} callback
     * @returns {Promise}
     */
    observe(promise, callback) {
      return promise.then(
        function fulfulled(value) {
          return Promise.resolve(reason).then(callback);
        },
        function rejected(reason) {
          return Promise.resolve(reason).then(callback);
        }
      );
    },

    /**
     * 所有的Promise "rejected"时 , 返回"fulfilled"
     * @param {Promise[]} promises
     * @returns {Promise}
     */
    none(promises) {
      let resolvedCount = 0;
      let rejectedCount = 0;
      let total = promises.length;

      return new Promise((resolve, reject) => {
        function onFulfilled() {
          resolvedCount++;

          if (resolvedCount >= total) {
            reject();
          }
        }

        function onResolved() {
          resolvedCount++;
          rejectedCount++;

          if (rejectedCount >= total) {
            resolve();
          }

          if (resolvedCount >= total) {
            reject();
          }
        }

        promises.forEach(promise => {
          promise.then(onFulfilled, onResolved);
        });
      });
    },

    /**
     * 任意一个Promise为"fulfilled",则返回的Promise为"fulfilled"
     * @param {Promise[]} promises
     * @returns {Promise}
     */
    any(promises) {
      return new Promise((resolve, reject) => {
        promises.forEach(promise => {
          Promise.resolve(promise).then(resolve);
        });
      });
    },

    map(promises, iteratee, context) {
      let result = [];

      return serie(promises, function(value, index) {
        value = iteratee.call(context, value, index - 1);
        result.push(value);

        return result;
      });
    },

    filter(promises, iteratee, context) {
      let result = [];

      return serie(promises, function(value, index) {
        const test = iteratee.call(context, value, index - 1);

        if (test) {
          result.push(value);
        }

        return result;
      });
    },

    reduce(promises, iteratee, init, context) {
      let r = init;
      let result = [];

      return serie(promises, function(value, index) {
        r = iteratee.call(context, r, value, index - 1);
        return r;
      });
    }
  };

  function serie(promises, handler) {
    let chain = promises[0];

    for (let i = 1, len = promises.length; i <= len; i++) {
      chain = chain.then(value => {
        let result = handler(value, i);
        return i == len ? result : promises[i];
      });
    }

    return chain;
  }

  for (let key in extendFunctions) {
    if (extendFunctions.hasOwnProperty(key)) {
      if (!Promise[key]) {
        Promise[key] = extendFunctions[key];
      }
    }
  }

  Promise.map(
    [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    function iteratee(value, index) {
      return value * 2;
    }
  )
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log("error", err);
    });

  Promise.filter(
    [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    function iteratee(value, index) {
      return value > 2;
    }
  )
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log("error", err);
    });

  Promise.reduce(
    [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
    function iteratee(r, v, index) {
      r += v;
      return r;
    },
    0
  )
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log("error", err);
    });
});
