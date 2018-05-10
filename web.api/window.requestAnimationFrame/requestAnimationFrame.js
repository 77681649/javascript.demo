!(function (global) {
  var vendors = ['webkit', 'moz'];
  var requestAnimationFrame = global.requestAnimationFrame
  var cancelAnimationFrame = global.cancelAnimationFrame
  var interval = 1000 / 60;
  var lastTime = 0;

  for (var i = 0, len = vendors.length; i < len && !requestAnimationFrame; i++) {
    var vendor = vendors[i];

    requestAnimationFrame = global[vendor + 'RequestAnimationFrame'];
    cancelAnimationFrame = global[vendor + 'CancelAnimationFrame'] || global[vendor + 'CancelRequestAnimationFrame'];
  }

  if (!requestAnimationFrame) {
    requestAnimationFrame = function requestAnimationFrame(callback) {
      var now = Date.now();                               // 开始执行
      var nextTime = Math.max(lastTime + interval, now);
      var id = global.setTimeout(function () {
        callback(lastTime = nextTime);
      }, nextTime - now);

      return id
    }
  }

  if (!cancelAnimationFrame) {
    cancelAnimationFrame = global.clearTimeout
  }

  global.requestAnimationFrame = requestAnimationFrame
  global.cancelAnimationFrame = cancelAnimationFrame
})(window);