//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined,
    key,
    $,
    classList,
    emptyArray = [],
    concat = emptyArray.concat,
    filter = emptyArray.filter,
    slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {},
    classCache = {},
    // 不需要添加单位的属性
    cssNumber = {
      "column-count": 1,
      columns: 1,
      "font-weight": 1,
      "line-height": 1,
      opacity: 1,
      "z-index": 1,
      zoom: 1
    },
    // 匹配HTML标签的正则表达式
    // <html ...>
    // <!....>  == > <![^>]*>
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    // 匹配没有属性的HTML标签
    // <div></div>
    // <div>
    // <div />
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    //匹配需要闭合标签的HTML标签
    // ?! -- 非获取匹配 ( 排除 指定项)
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,
    // 定义需要通过Zepto[key]方法获得属性值的属性名
    methodAttributes = [
      "val",
      "css",
      "html",
      "text",
      "data",
      "width",
      "height",
      "offset"
    ],
    adjacencyOperators = ["after", "prepend", "before", "append"],
    //
    // 通过innerHTML创建DOM树的容器 , 指定的标签必须放在指定的容器下 , 否则无法使用innerHTML创建DOM节点
    //
    table = document.createElement("table"),
    tableRow = document.createElement("tr"),
    containers = {
      tr: document.createElement("tbody"),
      tbody: table,
      thead: table,
      tfoot: table,
      td: tableRow,
      th: tableRow,
      "*": document.createElement("div")
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize,
    uniq,
    tempParent = document.createElement("div"),
    propMap = {
      tabindex: "tabIndex",
      readonly: "readOnly",
      for: "htmlFor",
      class: "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder",
      contenteditable: "contentEditable"
    },
    // isArray = Array.isArray || function(object){ return object instanceof Array }
    isArray = _.isArray;

  var ELEMENT_NODE = 1;
  var ATTRIBUTE_NODE = 2;
  var TEXT_NODE = 3;
  var CDATA_SECTION_NODE = 4;
  var ENTITY_REFERENCE_NODE = 5;
  var ENTITY_NODE = 6;
  var PROCESSING_INSTRUCTION_NODE = 7;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE = 9;
  var DOCUMENT_TYPE_NODE = 10;
  var DOCUMENT_FRAGMENT_NODE = 11;
  var NOTATION_NODE = 12;

  var elementPrototype = Element.prototype;

  /**
   *
   */
  var matchesSelector =
    elementPrototype.matches ||
    elementPrototype.webkitMatchesSelector ||
    elementPrototype.mozMatchesSelector ||
    elementPrototype.oMatchesSelector ||
    elementPrototype.matchesSelector ||
    function(selector) {
      // fall back to performing a selector:
      var match,
        parent = element.parentNode,
        temp = !parent;

      // 临时的 , 即没有插入到DOM树中的 -- 将tempParent作为临时的父级
      if (temp) {
        parent = tempParent;
        parent.appendChild(element);
      }

      // 是否匹配
      match = ~zepto.qsa(parent, selector).indexOf(element);

      // 匹配结束 , 清空tempParent
      temp && tempParent.removeChild(element);

      return match;
    };

  /**
   * 判断当前元素是否匹配指定的选择器
   * @param  {Node} element  元素
   * @param  {String} selector 选择器
   * @return {Boolean} 匹配返回true , 不匹配返回false
   */
  zepto.matches = function(element, selector) {
    return !selector || !element || element.nodeType !== ELEMENT_NODE
      ? false
      : matchesSelectorl.call(element, selector);
  };

  function type(obj) {
    return obj == null
      ? String(obj)
      : class2type[toString.call(obj)] || "object";
  }

  function isFunction(value) {
    return type(value) == "function";
  }
  function isWindow(obj) {
    return obj != null && obj == obj.window;
  }
  function isDocument(obj) {
    return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
  }
  function isObject(obj) {
    return type(obj) == "object";
  }
  function isPlainObject(obj) {
    return (
      isObject(obj) &&
      !isWindow(obj) &&
      Object.getPrototypeOf(obj) == Object.prototype
    );
  }

  function likeArray(obj) {
    var length = !!obj && "length" in obj && obj.length,
      type = $.type(obj);

    return (
      "function" != type &&
      !isWindow(obj) &&
      ("array" == type ||
        length === 0 ||
        (typeof length == "number" && length > 0 && length - 1 in obj))
    );
  }
  // var isFunction = _.isFunction
  // var isWindow   = function()      { return obj != null && obj == obj.window }
  // var isDocument = function(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  // var isObject = _.isObject
  // var isPlainObject = _.isPlainObject

  // 从数组中删除为空的
  function compact(array) {
    return filter.call(array, function(item) {
      return item != null;
    });
  }

  // 扁平化数组
  function flatten(array) {
    return array.length > 0 ? $.fn.concat.apply([], array) : array;
  }

  // 将一个或多个 '-'
  // (.)? 零个或多个  替换成大写
  camelize = function(str) {
    return str.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : "";
    });
  };

  function dasherize(str) {
    return str
      .replace(/::/g, "/")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
      .replace(/([a-z\d])([A-Z])/g, "$1_$2")
      .replace(/_/g, "-")
      .toLowerCase();
  }
  uniq = function(array) {
    return filter.call(array, function(item, idx) {
      return array.indexOf(item) == idx;
    });
  };

  function classRE(name) {
    return name in classCache
      ? classCache[name]
      : (classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)"));
  }

  function maybeAddPx(name, value) {
    return typeof value == "number" && !cssNumber[dasherize(name)]
      ? value + "px"
      : value;
  }

  function defaultDisplay(nodeName) {
    var element, display;
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName);
      document.body.appendChild(element);
      display = getComputedStyle(element, "").getPropertyValue("display");
      element.parentNode.removeChild(element);
      display == "none" && (display = "block");
      elementDisplay[nodeName] = display;
    }
    return elementDisplay[nodeName];
  }

  function children(element) {
    return "children" in element
      ? slice.call(element.children)
      : $.map(element.childNodes, function(node) {
          if (node.nodeType == 1) return node;
        });
  }

  /**
   * 如果arg是个函数就执行,并将返回值作为最终的返回值 , 否则,直接返回arg
   * @param  {Object} context 上下文
   * @param  {Function} arg 参数
   * @param  {Number} idx 索引
   * @param  {Any} payload 有效数据
   * @return {Any}
   */
  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg;
  }

  /**
   * 设置节点的属性
   * @param {Node} node 节点
   * @param {String} name 属性名
   * @param {Any} value 属性值 =null|undefined,表示删除属性
   */
  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value) {
    var klass = node.className || "",
      svg = klass && klass.baseVal !== undefined;

    if (value === undefined) return svg ? klass.baseVal : klass;
    svg ? (klass.baseVal = value) : (node.className = value);
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value
        ? value == "true" ||
            (value == "false"
              ? false
              : value == "null"
                ? null
                : +value + "" == value
                  ? +value
                  : /^[\[\{]/.test(value)
                    ? $.parseJSON(value)
                    : value)
        : value;
    } catch (e) {
      return value;
    }
  }

  /**
   *
   * @param  {[type]} nodes    [description]
   * @param  {[type]} selector [description]
   * @return {[type]}          [description]
   */
  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector);
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {};
        if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
        extend(target[key], source[key], deep);
      } else if (source[key] !== undefined) target[key] = source[key];
  }

  /**
   * Zepto 构造函数
   * @param {Node | NodeList} dom DOM节点
   * @param {String} selector 选择器
   */
  function Z(dom, selector) {
    var i,
      len = dom ? dom.length : 0;
    for (i = 0; i < len; i++) this[i] = dom[i];

    this.length = len;
    this.selector = selector || "";
  }

  /**
   * 根据Html字符串 , 生成对应的HTML片段
   * `$.zepto.fragment` takes a html string and an optional tag name
   * to generate DOM nodes from the given html string.
   * The generated DOM nodes are returned as an array.
   * This function can be overridden in plugins for example to make
   * it compatible with browsers that don't support the DOM fully.
   * @param {String} html
   * @param {String} name
   * @param {Object} properties
   */
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container;

    //
    // 处理简单标签 -- 没有属性的标签 , 直接创建 document.createElement
    //
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

    //
    // 处理复杂标签 -- 通过innerHTML生成
    //
    if (!dom) {
      // 补全需要闭合的HTML标签
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");

      // 名字无效 , 从字符串中取
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;

      // 通过innerHTML , 获得DOM树
      // 不是特定标签 , 那么默认使用div作为容器
      if (!(name in containers)) name = "*";
      container = containers[name];
      container.innerHTML = "" + html;

      // 从容器中取出DOM节点 , 并清空DOM树
      dom = $.each(slice.call(container.childNodes), function() {
        container.removeChild(this);
      });
    }

    //
    // 处理attributes
    //
    if (isPlainObject(properties)) {
      nodes = $(dom);
      $.each(properties, function(key, value) {
        ~methodAttributes.indexOf(key)
          ? nodes[key](value) // 调用响应的方法
          : nodes.attr(key, value); // 通过attr直接设置
      });
    }

    return dom;
  };

  // 返回一个Zepto实例
  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overridden in plugins.
  zepto.Z = function(dom, selector) {
    return new Z(dom, selector);
  };

  // 判断是否是一个Zepto实例
  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overridden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z;
  };

  /**
   * 根据不同的selector实例化一个Zepto
   * `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
   * takes a CSS selector and an optional context (and handles various
   * special cases).
   * This method can be overridden in plugins.
   * @param {String | Function | Zepto | Object | Array } selector
   * @param {Node} context 不为空时 , 执行selector的上下文 ( 父级节点 )
   * @returns {Zepto} 返回一个Zepto实例
   */
  zepto.init = function(selector, context) {
    var dom;

    // 返回空的Zepto实例
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z();
    // 字符串
    // Optimize for string selectors
    else if (typeof selector == "string") {
      selector = selector.trim();

      // HTML片段 -- TML片段 '<html>...</html>'
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == "<" && fragmentRE.test(selector))
        (dom = zepto.fragment(selector, RegExp.$1, context)), (selector = null);
      // context存在 , 在context中做查询操作
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector);
      // 其他情况
      // CSS 选择器
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector);
    }

    // 函数 -- 当做ready处理
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector);
    // Zepto 实例 , 原样返回
    else if (zepto.isZ(selector)) return selector;
    else {
      // 数组
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector);
      // 对象 Node | NodeList | HtmlCollection
      // Wrap DOM nodes.
      else if (isObject(selector)) (dom = [selector]), (selector = null);
      // 正则表达式
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        (dom = zepto.fragment(selector.trim(), RegExp.$1, context)),
          (selector = null);
      // find
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector);
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector);
    }

    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector);
  };

  /**
   * 从element中根据selector找出对应的DOM元素
   * 实现 CSS 选择器 -- 基于querySelectorAll
   * `$.zepto.qsa` is Zepto's CSS selector implementation which
   * uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
   * This method can be overridden in plugins.
   * @param {Node} element
   * @param {string} selector
   * @returns {Array} 返回找到的Html元素 , 没有找到数组为空
   */
  zepto.qsa = function(element, selector) {
    var found,
      maybeID = selector[0] == "#",
      maybeClass = !maybeID && selector[0] == ".",
      nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
      // #id , .class , tag
      isSimple = simpleSelectorRE.test(nameOnly);

    return (
      // Safari DocumentFragment doesn't have getElementById
      // DocumentFragment doesn't have getElementsByClassName/TagName
      element.getElementById && isSimple && maybeID
        ? // 处理id
          (found = element.getElementById(nameOnly))
          ? [found]
          : []
        : // element是否有效
          element.nodeType !== ELEMENT_NODE &&
          element.nodeType !== DOCUMENT_NODE &&
          element.nodeType !== DOCUMENT_FRAGMENT_NODE
          ? []
          : slice.call(
              // 是否是简单处理器
              isSimple && !maybeID && element.getElementsByClassName
                ? maybeClass
                  ? element.getElementsByClassName(nameOnly)
                  : element.getElementsByTagName(selector)
                : element.querySelectorAll(selector)
            )
    );
  };

  // 入口
  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context) {
    return zepto.init(selector, context);
  };

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target) {
    var deep,
      args = slice.call(arguments, 1);
    if (typeof target == "boolean") {
      deep = target;
      target = args.shift();
    }
    args.forEach(function(arg) {
      extend(target, arg, deep);
    });
    return target;
  };

  /**
   * 判断node是否是parent的子节点 ,
   * parent == node , 直接返回false
   * @param {Node} parent
   * @param {Node} node
   * @returns {Boolean} 返回true表示包含在父节点内
   */
  $.contains = document.documentElement.contains
    ? (parent, node) => parent !== node && parent.contains(node)
    : (parent, node) => {
        // 逐级判断 , parent是否为node的祖先
        while (node && (node = node.parentNode))
          if (node === parent) return true;

        return false;
      };

  $.type = type;
  $.isFunction = isFunction;
  $.isWindow = isWindow;
  $.isArray = isArray;
  $.isPlainObject = isPlainObject;

  /**
   * 判断对象是否为一个空对象 , 是否包含属性 ( 包括原型对象 )
   * @param  {Object}  obj
   * @return {Boolean}
   */
  $.isEmptyObject = function(obj) {
    var name;
    for (name in obj) return false;
    return true;
  };

  // $.isNumeric = function(val) {
  //   var num = Number(val), type = typeof val
  //   return val != null && type != 'boolean' &&
  //     (type != 'string' || val.length) &&
  //     !isNaN(num) && isFinite(num) || false
  // }

  /**
   * 判断elem是否在元素内 , 或在元素指定位置  ( === 比较 )
   * @param  {Any} elem
   * @param  {Array} array
   * @param  {Index} i
   * @return {Boolean}
   */
  $.inArray = function(elem, array, i) {
    return emptyArray.indexOf.call(array, elem, i);
  };

  $.camelCase = camelize;

  /**
   * 去掉首位空格
   * @param  {String} str
   * @return {String}
   */
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str);
  };

  // plugin compatibility
  // $.uuid = 0
  // $.support = { }
  // $.expr = { }
  // $.noop = function() {}

  /**
   * Map 集合
   * @param  {LikeArray | Object}   elements 元素数组
   * @param  {Function} callback 遍历函数 (el , key)=>any
   * @return {Array} 返回一个数组 , 会对结果做降维操作  , 返回一个一维数组
   */
  $.map = function(elements, callback) {
    var value,
      values = [],
      i,
      key;

    function iterate(el, idx) {
      value = callback(elements[i], i);
      if (value != null) values.push(value);
    }

    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) iterate(elements[i], i);
    else for (key in elements) iterate(elements[key], key);

    return flatten(values);
  };

  /**
   * forEach
   * @param  {Node[]}   elements
   * @param  {Function} callback (index , el) => bool , @this = el
   * @return {Node[]} 返回elements
   */
  $.each = function(elements, callback) {
    var i, key;

    //
    // 当返回false时 , 表示退出循环
    //
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false)
          return elements;
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false)
          return elements;
    }

    return elements;
  };

  $.grep = function(elements, callback) {
    return filter.call(elements, callback);
  };

  if (window.JSON) $.parseJSON = JSON.parse;

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    constructor: zepto.Z,
    length: 0,

    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,

    concat: function() {
      var i,
        value,
        args = [];
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i];
        args[i] = zepto.isZ(value) ? value.toArray() : value;
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn) {
      return $(
        $.map(this, function(el, i) {
          return fn.call(el, i, el);
        })
      );
    },
    slice: function() {
      return $(slice.apply(this, arguments));
    },

    ready: function(callback) {
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($);
      else
        document.addEventListener(
          "DOMContentLoaded",
          function() {
            callback($);
          },
          false
        );
      return this;
    },
    get: function(idx) {
      return idx === undefined
        ? slice.call(this)
        : this[idx >= 0 ? idx : idx + this.length];
    },
    toArray: function() {
      return this.get();
    },
    size: function() {
      return this.length;
    },
    remove: function() {
      return this.each(function() {
        if (this.parentNode != null) this.parentNode.removeChild(this);
      });
    },

    /**
     * 遍历
     * @param  {Function} callback
     * @return {Zepto} 返回this , 用于链式调用
     */
    each: function(iteratee) {
      // 遍历this , 当遇到返回值为false时 , 停止遍历
      emptyArray.every.call(
        this,
        (el, idx) => iteratee.call(el, idx, el) !== false
      );

      return this;
    },

    add: function(selector, context) {
      return $(uniq(this.concat($(selector, context))));
    },

    /**
     * 根据selector,从当前元素中筛选出指定元素
     *
     * deps : fn.not , zepto.matches
     *
     * @param  {String | Function | Object} selector
     * @return {Array} 返回筛选之后的DOM元素
     */
    filter: function(selector) {
      // 双重否定  --> 肯定
      // 函数交给not处理 , not函数中有处理函数的过程
      if (isFunction(selector)) return this.not(this.not(selector));

      // 遍历this , 筛选匹配的元素
      var filted = filter.call(this, el => zepto.matches(el, selector));

      return $(filted);
    },

    /**
     * 过滤当前对象集合，获取一个新的对象集合，它里面的元素不能匹配css选择器。
     *
     * 1. selector:String 过滤吊CSS选择匹配到的元素
     * 2. selector:Function 过滤掉Function为false的元素
     * 3. selector:HtmlCollection | NodeList 过滤掉指定元素
     *
     * deps : this.filter , this.each
     *
     * @param  {Node | NodeList | HtmlCollection | String | Zepto | Function} selector 选择器
     * @return {Zepto}
     */
    not: function(selector) {
      var nodes = [];

      // 因为 , safari下的typeof NodeList === 'function'
      // 所以 , 判断selector.call !== undefined
      if (isFunction(selector) && selector.call !== undefined)
        // 函数返回false的 , 保存到结果中
        this.each(function(idx) {
          if (!selector.call(this, idx)) nodes.push(this);
        });
      else {
        // 获得需要排除的元素
        // string -- 排除元素 = selector匹配的元素
        // NodeList | HtmlCollection -- selector
        var excludes =
          typeof selector == "string"
            ? this.filter(selector)
            : likeArray(selector) && isFunction(selector.item)
              ? slice.call(selector)
              : $(selector);

        // 获得排除之后的元素
        this.forEach(el => excludes.indexOf(el) < 0 && nodes.push(el));
      }

      return $(nodes);
    },

    /**
     * 判断当前对象集合的子元素是否有符合选择器的元素，或者是否包含指定的DOM节点，
     * 如果有，则返回新的对象集合，该对象过滤掉不含有选择器匹配元素或者不含有指定DOM节点的对象。
     *
     * deps : $.contains , $.fn.find
     * @param  {String | HtmlCollection | NodeList | Node}  selector
     * @return {Boolean} 返回true表示包含selector对应的子节点
     */
    has: function(selector) {
      return this.filter(
        () =>
          isObject(selector)
            ? $.contains(this, selector)
            : !!$(this)
                .find(selector)
                .size()
      );
    },

    /**
     * 判断当前元素集合中的第一个元素是否符css选择器
     * @param  {String} selector
     * @return {Boolean}
     */
    is: function(selector) {
      return this.length > 0 && zepto.matches(this[0], selector);
    },

    /**
     * 从元素中过滤指定选择器的元素
     * @param  {String | Object} selector 选择器
     * @return {Zepto} 返回一个含有找到元素的Zepto实例
     */
    find: function(selector) {
      var result,
        $this = this;

      // 处理无效选择器
      if (!selector) result = $();
      // find
      else if (typeof selector == "object")
        result = $(selector).filter(function() {
          var node = this;
          return emptyArray.some.call($this, function(parent) {
            return $.contains(parent, node);
          });
        });
      // 处理单元素 , 直接在第一个元素中查找
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector));
      // 处理多元素 , 遍历查找
      else result = this.map(() => zepto.qsa(this, selector));

      return result;
    },

    /**
     *
     * @param  {[type]} selector [description]
     * @param  {[type]} context  [description]
     * @return {[type]}          [description]
     */
    closest: function(selector, context) {
      var nodes = [],
        collection = typeof selector == "object" && $(selector);
      this.each(function(_, node) {
        while (
          node &&
          !(collection
            ? collection.indexOf(node) >= 0
            : zepto.matches(node, selector))
        )
          node = node !== context && !isDocument(node) && node.parentNode;
        if (node && nodes.indexOf(node) < 0) nodes.push(node);
      });
      return $(nodes);
    },

    /**
     * [parents description]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    parents: function(selector) {
      var ancestors = [],
        nodes = this;
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node) {
          if (
            (node = node.parentNode) &&
            !isDocument(node) &&
            ancestors.indexOf(node) < 0
          ) {
            ancestors.push(node);
            return node;
          }
        });
      return filtered(ancestors, selector);
    },

    /**
     * [parent description]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    parent: function(selector) {
      return filtered(uniq(this.pluck("parentNode")), selector);
    },

    /**
     * [children description]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    children: function(selector) {
      return filtered(
        this.map(function() {
          return children(this);
        }),
        selector
      );
    },

    /**
     * [siblings description]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    siblings: function(selector) {
      return filtered(
        this.map(function(i, el) {
          return filter.call(children(el.parentNode), function(child) {
            return child !== el;
          });
        }),
        selector
      );
    },

    /**
     * 从idx开始截取元素
     * @param  {Number} idx
     * @return {Array}
     */
    eq: function(idx) {
      return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
    },

    /**
     * 返回第一个元素
     * @return {Node}
     */
    first: function() {
      var el = this[0];
      return el && !isObject(el) ? el : $(el);
    },

    /**
     * 返回最后一个元素
     * @return {Zepto | Node}
     */
    last: function() {
      var el = this[this.length - 1];
      return el && !isObject(el) ? el : $(el);
    },

    contents: function() {
      return this.map(function() {
        return this.contentDocument || slice.call(this.childNodes);
      });
    },

    empty: function() {
      return this.each(function() {
        this.innerHTML = "";
      });
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property) {
      return $.map(this, function(el) {
        return el[property];
      });
    },
    show: function() {
      return this.each(function() {
        this.style.display == "none" && (this.style.display = "");
        if (getComputedStyle(this, "").getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName);
      });
    },
    replaceWith: function(newContent) {
      return this.before(newContent).remove();
    },
    wrap: function(structure) {
      var func = isFunction(structure);
      if (this[0] && !func)
        var dom = $(structure).get(0),
          clone = dom.parentNode || this.length > 1;

      return this.each(function(index) {
        $(this).wrapAll(
          func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom
        );
      });
    },
    
    wrapAll: function(structure) {
      if (this[0]) {
        $(this[0]).before((structure = $(structure)));
        var children;
        // drill down to the inmost element
        while ((children = structure.children()).length)
          structure = children.first();
        $(structure).append(this);
      }
      return this;
    },

    wrapInner: function(structure) {
      var func = isFunction(structure);
      return this.each(function(index) {
        var self = $(this),
          contents = self.contents(),
          dom = func ? structure.call(this, index) : structure;
        contents.length ? contents.wrapAll(dom) : self.append(dom);
      });
    },

    unwrap: function() {
      this.parent().each(function() {
        $(this).replaceWith($(this).children());
      });
      return this;
    },

    clone: function() {
      return this.map(function() {
        return this.cloneNode(true);
      });
    },

    hide: function() {
      return this.css("display", "none");
    },

    toggle: function(setting) {
      return this.each(function() {
        var el = $(this);
        (setting === undefined
        ? el.css("display") == "none"
        : setting)
          ? el.show()
          : el.hide();
      });
    },

    prev: function(selector) {
      return $(this.pluck("previousElementSibling")).filter(selector || "*");
    },

    next: function(selector) {
      return $(this.pluck("nextElementSibling")).filter(selector || "*");
    },

    html: function(html) {
      return 0 in arguments
        ? this.each(function(idx) {
            var originHtml = this.innerHTML;
            $(this)
              .empty()
              .append(funcArg(this, html, idx, originHtml));
          })
        : 0 in this
          ? this[0].innerHTML
          : null;
    },

    text: function(text) {
      return 0 in arguments
        ? this.each(function(idx) {
            var newText = funcArg(this, text, idx, this.textContent);
            this.textContent = newText == null ? "" : "" + newText;
          })
        : 0 in this
          ? this.pluck("textContent").join("")
          : null;
    },

    /**
     * 获得/设置属性的值
     * @param  {String | Object} name  属性名 name | {name : value}
     * @param  {Any} [value] 属性值 , 没有时作设值操作
     * @return {Any | undefined} 返回获得的属性
     */
    attr: function(name, value) {
      var result;

      return typeof name == "string" && !(1 in arguments)
        ? // 若是取单个属性的值
          0 in this &&
          this[0].nodeType == ELEMENT_NODE &&
          (result = this[0].getAttribute(name)) != null
          ? result
          : undefined
        : this.each(function(idx) {
            // 非法元素
            if (this.nodeType !== ELEMENT_NODE) return;

            // name = 对象 , 设置多个属性的值
            if (isObject(name))
              for (key in name) setAttribute(this, key, name[key]);
            else
              setAttribute(
                this,
                name,
                funcArg(this, value, idx, this.getAttribute(name))
              );
          });
    },

    /**
     * 移除指定属性
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    removeAttr: function(name) {
      return this.each(function() {
        this.nodeType === 1 &&
          name.split(" ").forEach(function(attribute) {
            setAttribute(this, attribute);
          }, this);
      });
    },

    prop: function(name, value) {
      name = propMap[name] || name;
      return 1 in arguments
        ? this.each(function(idx) {
            this[name] = funcArg(this, value, idx, this[name]);
          })
        : this[0] && this[0][name];
    },

    removeProp: function(name) {
      name = propMap[name] || name;
      return this.each(function() {
        delete this[name];
      });
    },

    data: function(name, value) {
      var attrName = "data-" + name.replace(capitalRE, "-$1").toLowerCase();

      var data =
        1 in arguments ? this.attr(attrName, value) : this.attr(attrName);

      return data !== null ? deserializeValue(data) : undefined;
    },

    val: function(value) {
      if (0 in arguments) {
        if (value == null) value = "";
        return this.each(function(idx) {
          this.value = funcArg(this, value, idx, this.value);
        });
      } else {
        return (
          this[0] &&
          (this[0].multiple
            ? $(this[0])
                .find("option")
                .filter(function() {
                  return this.selected;
                })
                .pluck("value")
            : this[0].value)
        );
      }
    },

    offset: function(coordinates) {
      if (coordinates)
        return this.each(function(index) {
          var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top: coords.top - parentOffset.top,
              left: coords.left - parentOffset.left
            };

          if ($this.css("position") == "static") props["position"] = "relative";
          $this.css(props);
        });
      if (!this.length) return null;
      if (
        document.documentElement !== this[0] &&
        !$.contains(document.documentElement, this[0])
      )
        return { top: 0, left: 0 };
      var obj = this[0].getBoundingClientRect();
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      };
    },

    css: function(property, value) {
      if (arguments.length < 2) {
        var element = this[0];
        if (typeof property == "string") {
          if (!element) return;
          return (
            element.style[camelize(property)] ||
            getComputedStyle(element, "").getPropertyValue(property)
          );
        } else if (isArray(property)) {
          if (!element) return;
          var props = {};
          var computedStyle = getComputedStyle(element, "");
          $.each(property, function(_, prop) {
            props[prop] =
              element.style[camelize(prop)] ||
              computedStyle.getPropertyValue(prop);
          });
          return props;
        }
      }

      var css = "";
      if (type(property) == "string") {
        if (!value && value !== 0)
          this.each(function() {
            this.style.removeProperty(dasherize(property));
          });
        else css = dasherize(property) + ":" + maybeAddPx(property, value);
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function() {
              this.style.removeProperty(dasherize(key));
            });
          else
            css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
      }

      return this.each(function() {
        this.style.cssText += ";" + css;
      });
    },

    index: function(element) {
      return element
        ? this.indexOf($(element)[0])
        : this.parent()
            .children()
            .indexOf(this[0]);
    },

    hasClass: function(name) {
      if (!name) return false;
      return emptyArray.some.call(
        this,
        function(el) {
          return this.test(className(el));
        },
        classRE(name)
      );
    },

    addClass: function(name) {
      if (!name) return this;
      return this.each(function(idx) {
        if (!("className" in this)) return;
        classList = [];
        var cls = className(this),
          newName = funcArg(this, name, idx, cls);
        newName.split(/\s+/g).forEach(function(klass) {
          if (!$(this).hasClass(klass)) classList.push(klass);
        }, this);
        classList.length &&
          className(this, cls + (cls ? " " : "") + classList.join(" "));
      });
    },

    removeClass: function(name) {
      return this.each(function(idx) {
        if (!("className" in this)) return;
        if (name === undefined) return className(this, "");
        classList = className(this);
        funcArg(this, name, idx, classList)
          .split(/\s+/g)
          .forEach(function(klass) {
            classList = classList.replace(classRE(klass), " ");
          });
        className(this, classList.trim());
      });
    },

    toggleClass: function(name, when) {
      if (!name) return this;
      return this.each(function(idx) {
        var $this = $(this),
          names = funcArg(this, name, idx, className(this));
        names.split(/\s+/g).forEach(function(klass) {
          (when === undefined
          ? !$this.hasClass(klass)
          : when)
            ? $this.addClass(klass)
            : $this.removeClass(klass);
        });
      });
    },

    scrollTop: function(value) {
      if (!this.length) return;
      var hasScrollTop = "scrollTop" in this[0];
      if (value === undefined)
        return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
      return this.each(
        hasScrollTop
          ? function() {
              this.scrollTop = value;
            }
          : function() {
              this.scrollTo(this.scrollX, value);
            }
      );
    },

    scrollLeft: function(value) {
      if (!this.length) return;
      var hasScrollLeft = "scrollLeft" in this[0];
      if (value === undefined)
        return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
      return this.each(
        hasScrollLeft
          ? function() {
              this.scrollLeft = value;
            }
          : function() {
              this.scrollTo(value, this.scrollY);
            }
      );
    },

    position: function() {
      if (!this.length) return;

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName)
          ? { top: 0, left: 0 }
          : offsetParent.offset();

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top -= parseFloat($(elem).css("margin-top")) || 0;
      offset.left -= parseFloat($(elem).css("margin-left")) || 0;

      // Add offsetParent borders
      parentOffset.top +=
        parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
      parentOffset.left +=
        parseFloat($(offsetParent[0]).css("border-left-width")) || 0;

      // Subtract the two offsets
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left
      };
    },

    offsetParent: function() {
      return this.map(function() {
        var parent = this.offsetParent || document.body;
        while (
          parent &&
          !rootNodeRE.test(parent.nodeName) &&
          $(parent).css("position") == "static"
        )
          parent = parent.offsetParent;
        return parent;
      });
    }
  };

  // for now
  $.fn.detach = $.fn.remove;

  // 填充用于判断类型的字符串
  // Populate the class2type map
  $.each(
    "Boolean Number String Function Array Date RegExp Object Error".split(" "),
    function(i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    }
  );

  // 生成width,height属性
  // Generate the `width` and `height` functions
  ["width", "height"].forEach(function(dimension) {
    // 格式化 -- 大写开头
    var dimensionProperty = dimension.replace(/./, m => m[0].toUpperCase());

    // add to $.fn
    $.fn[dimension] = function(value) {
      var offset,
        el = this[0];

      if (value === undefined)
        return isWindow(el)
          ? el["inner" + dimensionProperty]
          : isDocument(el)
            ? el.documentElement["scroll" + dimensionProperty]
            : (offset = this.offset()) && offset[dimension];
      else
        return this.each(function(idx) {
          el = $(this);
          el.css(dimension, funcArg(this, value, idx, el[dimension]()));
        });
    };
  });

  function traverseNode(node, fun) {
    fun(node);
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun);
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2; //=> prepend, append

    $.fn[operator] = function() {
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType,
        nodes = $.map(arguments, function(arg) {
          var arr = [];
          argType = type(arg);
          if (argType == "array") {
            arg.forEach(function(el) {
              if (el.nodeType !== undefined) return arr.push(el);
              else if ($.zepto.isZ(el)) return (arr = arr.concat(el.get()));
              arr = arr.concat(zepto.fragment(el));
            });
            return arr;
          }
          return argType == "object" || arg == null ? arg : zepto.fragment(arg);
        }),
        parent,
        copyByClone = this.length > 1;
      if (nodes.length < 1) return this;

      return this.each(function(_, target) {
        parent = inside ? target : target.parentNode;

        // convert all methods to a "before" operation
        target =
          operatorIndex == 0
            ? target.nextSibling
            : operatorIndex == 1
              ? target.firstChild
              : operatorIndex == 2
                ? target
                : null;

        var parentInDocument = $.contains(document.documentElement, parent);

        nodes.forEach(function(node) {
          if (copyByClone) node = node.cloneNode(true);
          else if (!parent) return $(node).remove();

          parent.insertBefore(node, target);
          if (parentInDocument)
            traverseNode(node, function(el) {
              if (
                el.nodeName != null &&
                el.nodeName.toUpperCase() === "SCRIPT" &&
                (!el.type || el.type === "text/javascript") &&
                !el.src
              ) {
                var target = el.ownerDocument
                  ? el.ownerDocument.defaultView
                  : window;
                target["eval"].call(target, el.innerHTML);
              }
            });
        });
      });
    };

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[
      inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")
    ] = function(html) {
      $(html)[operator](this);
      return this;
    };
  });

  //绑定原型
  zepto.Z.prototype = Z.prototype = $.fn;

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq;
  zepto.deserializeValue = deserializeValue;
  $.zepto = zepto;

  return $;
})();

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto);
