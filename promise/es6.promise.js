/**
 * 基于Promise/A+
 * @param {} handler
 */

const window = {};

!(function(global) {
  var STATUS_PENDING = "pending"; // 等待
  var STATUS_FULFILLED = "resolved"; // 满足
  var STATUS_REJECTED = "rejected"; // 拒绝

  var isFunction = function(v) {
    return Object.prototype.toString.call(v) === "[object Function]";
  };

  var only = function(fn) {
    var done = false;

    return function onlyCallback() {
      done = true;
      return fn.apply(null, arguments);
    };
  };

  var uid = 0;

  /**
   *
   * @param {Function} resolver
   * @returns {Promise}
   */
  function Promise(resolver) {
    this.uid = ++uid;
    console.log("new Promise", uid);

    var that = this;

    // 存储promise的状态
    var status = STATUS_PENDING;

    // 存储promise的最终结果 ( status=FULFILLED,为返回的结果; status=REJECTED,为发生的错误 )
    var value;

    // 存储成功和失败的回调函数 { onFulfilled , onRejected }
    var handlers = [];

    var fullfiled = only(function fullfiled(result) {
      that.status = status = STATUS_FULFILLED;
      that.value = value = result;
      handlers.forEach(execCallback); // 执行积压的回调函数
      handlers = [];

      return value;
    });

    var reject = only(function reject(reason) {
      that.status = status = STATUS_REJECTED;
      that.value = value = reason;
      handlers.forEach(execCallback); // 执行积压的回调函数
      handlers = [];

      return value;
    });

    if (!isFunction(resolver)) {
      throw new Error("Promise resolver undefined is not a function");
    }

    // 执行resolver
    resolver(resolve, reject);

    this.done = function done(onFulfilled, onRejected) {
      // 确保操作始终都是异步的
      setTimeout(function() {
        execCallback({ onFulfilled, onRejected });
      }, 0);
    };

    /**
     * 处理获得result的情况
     * @param {Any} result
     */
    function resolve(result) {
      try {
        var then = getThen(result);

        if (then) {
          // 如果是一个Thenable,那么Promise的状态和值都将由它的执行结果决定
          then.call(result, fullfiled, reject);
        } else {
          fullfiled(result);
        }
      } catch (err) {
        reject(err);
      }
    }

    function execCallback(handler) {
      //
      // fufilled/rejected会处理掉挤压的,所有这里无需关注挤压的回调函数
      if (status === STATUS_PENDING) {
        handlers.push(handler);
      } else if (
        status === STATUS_FULFILLED &&
        isFunction(handler.onFulfilled)
      ) {
        handler.onFulfilled(value);
      } else if (status === STATUS_REJECTED && isFunction(handler.onRejected)) {
        handler.onRejected(value);
      }
    }
  }

  Promise.prototype = {
    then: function(onFulfilled, onRejected) {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.done(
          function(value) {
            try {
              isFunction(onFulfilled)
                ? resolve(onFulfilled(value))
                : resolve(value);
            } catch (err) {
              reject(err);
            }
          },
          function(err) {
            try {
              isFunction(onRejected) ? reject(onRejected(err)) : reject(err);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    },
    catch: function(onRejected) {
      var that = this;

      return new Promise(function(resolve, reject) {
        that.done(null, function(err) {
          try {
            isFunction(onRejected) ? reject(onRejected(err)) : reject(err);
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  };

  // Promise.all = function all() {

  // }

  // 1. 将非Thenable对象包装状态为Fulfilled的Promise对象,它的最终值为value
  // 2. 将Thenable对象转换为Promise对象 , 状态不变 , 它的最终值为Thenable对象的值
  Promise.resolve = function resolve(value) {
    return new Promise(function(resolve, reject) {
      resolve(value);
    });
  };

  Promise.reject = function reject(reason) {
    return new Promise(function(resolve, reject) {
      reject(reason);
    });
  };

  function getThen(o) {
    return isThenable(o) ? o.then : null;
  }

  function isThenable(o) {
    return o && isFunction(o.then);
  }

  global.Promise = Promise;
})(window);


