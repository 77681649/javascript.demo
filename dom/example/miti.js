!(function(global) {
  if (
    module &&
    typeof module === "object" &&
    typeof module.exports === "object"
  ) {
    module.exports = factory(global);
  } else if (typeof define === "function" && define.amd) {
    define(() => factory(global));
  } else {
    let Miti = factory(global);

    global.Miti = Miti;
    global.$ = Miti;
  }
})(this, function factory(global) {
  let miti = {};

  function $(selector, context) {
    return miti.init(selector, context);
  }

  $.getNodeName = function(node) {
    if (node && node.nodeName) {
      return node.nodeName;
    } else {
      return null;
    }
  };

  $.getNodeType = function(node) {
    if (node && node.nodeType) {
      return node.nodeType;
    } else {
      return null;
    }
  };

  return $;
});
