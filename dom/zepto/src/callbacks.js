//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){

  /**
   * 回调函数管理器 , 主要用于Deferred
   *
   * 通过如下方法管理异步队列
   * add()
   * remove()
   * fire()
   * lock()
   * disable()
   *
   * 异步函数的标记
   * once         - 回调函数只会被触发一次
   * memory       - 存储最近一次执行回调时的参数 ( 上下文 , 执行参数 )
   * unique       - 同一个回调函数只能被添加一次
   * stopOnFalse  - 当回调函数返回false时 , 中断执行
   */
  $.Callbacks = function(options) {
    options = $.extend({}, options)

    var
        // 记录
        memory,

        // 是否已被触发
        fired,

        // 是否正在回调
        firing,

        // 执行的开始位置
        firingStart,

        // 回调函数列表长度
        firingLength,

        // 当前执行的回调函数的索引号
        firingIndex,

        // 回调函数列表
        list = [],

        // 暂存栈 , 只执行一次的函数 , 没有调用栈
        stack = !options.once && [], // Stack of fire calls for repeatable lists

        /**
         * 触发回调
         * @param  {[type]} data
         */
        fire = function(data) {
          memory = options.memory && data
          fired = true
          firingIndex = firingStart || 0
          firingStart = 0
          firingLength = list.length

          // 标记 , 正在执行
          firing = true

          // 从开始位置依次调用回调函数
          // 当返回 stopOnFalse = true && 返回false时 , 中断执行
          for ( ; list && firingIndex < firingLength ; ++firingIndex ) {
            if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
              // 中断执行时 , 清除 memory 记录
              memory = false
              break
            }
          }

          // 标记 , 执行结束
          firing = false

          // 执行被暂存的回调函数
          if (list) {
            if (stack) stack.length && fire(stack.shift())
            else if (memory) list.length = 0
            else Callbacks.disable()
          }
        },

        Callbacks = {
          /**
           * 新增一个或多个回调函数到列表中
           * @param {...Function} callbacks
           * @returns {Callbacks} 返回自身 , 链式调用
           */
          add: function() {
            if (list) {
              var
                  start = list.length,
                  add = function(args) {

                    $.each(args, function(_, arg){
                      if (typeof arg === "function") {

                        // 如果是unique的 , 要检查是否已在列表中
                        if (!options.unique || !Callbacks.has(arg))
                          list.push(arg)
                      }
                      else if (arg && arg.length && typeof arg !== 'string')
                        add(arg) // 处理多回调函数的情况
                    })
                  }

              // 添加到列表
              add(arguments)

              // 如果正在fireing , 那么更新队列长度
              if (firing) firingLength = list.length
              else if (memory) {
                firingStart = start
                fire(memory)
              }
            }

            return this
          },

          /**
           * 移除一个或多个回调函数
           * @param {...Function} callbacks
           * @returns {Callbacks} 返回自身 , 链式调用
           */
          remove: function() {
            if (list) {
              $.each(arguments, function(_, arg){
                var index
                while ((index = $.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1)
                  // Handle firing indexes
                  if (firing) {
                    if (index <= firingLength) --firingLength
                    if (index <= firingIndex) --firingIndex
                  }
                }
              })
            }
            return this
          },

          /**
           * 判断执行函数是否已在列表中
           * @param  {Function} fn
           * @return {Boolean} 返回true表示已在列表中
           */
          has: function(fn) {
            return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length))
          },

          /**
           * 清空回调函数列表
           * @return {Callbacks} 返回自身 , 链式调用
           */
          empty: function() {
            firingLength = list.length = 0
            return this
          },

          /**
           * 禁用回调函数列表
           * @return {Callbacks} 返回自身 , 链式调用
           */
          disable: function() {
            list = stack = memory = undefined
            return this
          },

          /**
           * 判断是否回调函数列表已被禁用
           * @return {Boolean}
           */
          disabled: function() {
            return !list
          },

          /**
           * 锁定回调函数列表
           * @return {Callbacks} 返回自身 , 链式调用
           */
          lock: function() {
            stack = undefined // 锁定 , 导致无法触发fire

            // 非memory模式 , 直接禁用列表
            if (!memory) Callbacks.disable()

            return this
          },

          /**
           * 是否已被锁定
           * @return {Boolean}
           */
          locked: function() {
            return !stack
          },

          /**
           * 执行回调函数列表中的所有函数
           * @param  {Object} context 执行的上下文
           * @param  {Array} args    执行的参数
           * @return {Callbacks} 返回自身 , 链式调用
           */
          fireWith: function(context, args) {
            // 执行条件 :
            // 启用
            // 没有被调用
            // 没有被锁定
            if (list && (!fired || stack)) {
              args = args || []
              args = [context, args.slice ? args.slice() : args]

              // 如果正在执行 , 暂存参数
              // 否则执行
              if (firing) stack.push(args)
              else fire(args)
            }

            return this
          },

          /**
           * 用指定参数执行回调函数列表中的所有函数
           * @return {Any} 函数执行的返回结果
           */
          fire: function() {
            return Callbacks.fireWith(this, arguments)
          },

          /**
           * 是否已被触发
           * @return {Boolean}
           */
          fired: function() {
            return !!fired
          }
        }

    return Callbacks
  }
})(Zepto)
