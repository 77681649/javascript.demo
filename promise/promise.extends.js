!(function(global, factory) {
  factory(global);
})(this, function factory(global) {
  const Promsie = global && global.Promise;

  if (!Promise) {
    throw new Error("The Promise is undefined.");
  }

  const extendFunctions = {
    isPromise(value) {
      return value && typeof value.then === "function";
    },

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

    any(promises) {
      return new Promise((resolve, reject) => {
        promises.forEach(promise => {
          Promise.resolve(promise).then(resolve);
        });
      });
    },

    some(promises) {},

    map(promises) {},

    filter(promises) {},

    reduce(promises) {}
  };

  for (let key in extendFunctions) {
    if (extendFunctions.hasOwnProperty(key)) {
      if (!Promise[key]) {
        Promise[key] = extendFunctions[key];
      }
    }
  }
});
