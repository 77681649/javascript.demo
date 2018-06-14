!(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(global);
  } else if (typeof define === "function" && define.amd) {
    define(factory(global));
  } else {
    global.$ = factory(global);
  }
})(this, function factory(global) {
  //
  // utils
  //
  let isFunction = createIsType("Function"),
    isString = createIsType("String"),
    isNumber = createIsType("Number"),
    isNull = createIsType("Null"),
    isUndefined = createIsType("Undefined");

  function createIsType(type) {
    let toString = Object.prototype.toString;
    let className = `[object ${type}]`;
    return o => toString.call(o) === className;
  }

  function toPascalCase(s) {
    s = typeof string === "string" ? s : String(s);
    return s[0].toUpperCase() + s.substr(1);
  }

  let miti = {};

  /**
   * 工厂函数
   *
   * @param {String} selector
   * @param {HTMLElement} [context]
   * @returns
   */
  function $(selector, context) {
    return miti.init(selector, context);
  }

  /**
   *
   */
  miti.init = function(selector, context) {
    if (isString(selector)) return initFromString(selector, context);
    else if (isFunction(selector)) return initFromFunction(selector);
    // else if (isMiti(selector)) return
  };

  miti.isMiti = function(o) {
    return o instanceof miti.Miti;
  };

  function initFromString(selector, context) {
    selector = selector.trim();

    if (isHtmlFrgament(selector)) {
      //
    } else if (context != null) {
      return $(context).find(selector);
    } else {
      return $(miti.qsa(element, selector));
    }
  }

  function initFromFunction(onDOMContentLoaded) {
    document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  }

  miti.qsa = function(element, selector) {
    return element.querySelectorAll(selector);
  };

  /**
   *
   *
   */
  function Miti(selector, context) {
    this.selector = selector;
  }

  /**
   * 原型对象
   */
  $.fn = {
    ready(onDOMContentLoaded) {
      document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    },

    find(selector) {}
  };

  function getAncestor(obj) {
    let ancestors = [];

    while (obj) {
      let name = obj.name ? obj.name : obj.constructor.name;
      ancestors.unshift(name);
      obj = obj.__proto__;
    }

    return ancestors;
  }

  function getProperty(obj, filter, match) {
    let properties = [];

    if (obj) {
      properties = Object.getOwnPropertyNames(obj).map(name => {
        try {
          let value = eval(`obj.${name}`);
          return [name, typeof value === "function" ? "method" : "attr"];
        } catch (err) {
          return [name, "attr"];
        }
      });
    }

    return properties
      .filter(it => it && (!filter || it[1] === filter))
      .filter(it => !match || match.test(it))
      .map(it => it.join(": "))
      .join("\r\n");
  }

  // miti.Miti = 
  // miti.Miti.prototype = Miti.prototype = $.fn;

  $.miti = miti;

  return $;
});
