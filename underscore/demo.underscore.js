(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(global);
  } else if (typeof define === "function" && typeof require === "function") {
    define(function() {
      return factory(global);
    });
  } else {
    global._ = factory(global);
  }
})(this, function(global) {
  const _ = {};

  /**
   * 获得当前日期的UTC时间
   */
  _.now = () => Date.now();

  _.throttle = function(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;

    options = options || {};

    let later = function() {
      timeout = null;

      previous = options.leading === false ? 0 : _.now();

      result = func.apply(context, args);
      context = args = null;
    };

    return function() {
      let now = _.now();
      let remaining = 0;

      // 第一次调用时,如果leading=false 那么不会理解触发第一次调用
      if (!previous && options.leading === false) previous = now;

      remaining = wait - (now - previous);

      context = this;
      args = arguments;

      if (remaining <= 0) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        previous = now;

        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, wait);
      }

      return result;
    };
  };

  _.debounce = function(func, wait) {
    var timestamp;
    var context, args, result;

    var later = function() {
      let last = _.now() - timestamp; // 间隔时间

      // last>= 0 防止用户临时修改时间
      // 导致_.now() < timestamp
      if (last < wait && last >= 0) {
        // 还没有到指定间隔
        timerout = setTimeout(later, wait - last);
      } else {
        timeout = null;

        // 到达wait间隔
        result = func.apply(context, args);
        context = args = null;
      }
    };

    return function() {
      context = this;
      args = arguments;

      timestamp = _.now();

      setTimeout(later, wait);

      return result;
    };
  };

  return _;
});
