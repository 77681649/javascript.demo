//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
//
//     Some code (c) 2005, 2013 jQuery Foundation, Inc. and other contributors

;(function($){
  var slice = Array.prototype.slice

  /**
   * Deferred -- 封装一个返回Promise对象的异步操作
   * @param {Function} func (deferred) => void
   * @returns {Deferred} 返回一个deferred实例
   */
  function Deferred(func) {
    var
        // 元组
        tuples = [
          // action,    add listener,       listener list,             final state
          [ "resolve",  "done",     $.Callbacks({once:1, memory:1}),  "resolved"  ],
          [ "reject",   "fail",     $.Callbacks({once:1, memory:1}),  "rejected"  ],
          [ "notify",   "progress", $.Callbacks({memory:1})                       ]
        ],

        // 状态
        state = "pending",

        /**
         * Promise
         *
         * @type {Object}
         */
        promise = {
          /**
           * 获得当前状态
           * "pending"   - 等待 , 异步操作还未完成
           * "resolved"  - 解决 , 异步操作成功
           * "rejected"  - 拒绝 , 异步操作失败
           * @return {String}
           */
          state: function() {
            return state
          },

          /**
           * 无论异步操作成功失败与否 , 都会被调用
           * @return {this}
           */
          always: function() {
            deferred.done(arguments).fail(arguments)
            return this
          },

          /**
           * 处理Deferred
           * @param {Function} onResolved/onDone 当异步操作成功时调用 ( deferred.resolve )
           * @param {Function} [onRejected/onFailed] 当异步操作失败时调用 ( deferred.rejected )
           * @param {Function} [onProgress]
           * @return {Promise} 返回Promise
           */
          then: function(/* fnDone [, fnFailed [, fnProgress]] */) {
            var fns = arguments

            /**
             * 创建一个新的Deferred ,
             * @type {Function}
             */
            return Deferred(function(defer){

              // each
              // resolve
              // reject
              // progress
              $.each(tuples, function(i, tuple){
                var listener = tuple[1]
                var fn = $.isFunction(fns[i]) && fns[i]

                // 调用 done/fail/preogress , 添加回调函数
                deferred[listener](
                  function(){
                    var returned = fn && fn.apply(this, arguments)

                    // 如果返回值是promise , 那么生成一个新的promise , 继续执行
                    if (returned && $.isFunction(returned.promise)) {

                      returned.promise()
                        .done(defer.resolve)
                        .fail(defer.reject)
                        .progress(defer.notify)

                    } else {
                      var context =
                          this === promise
                            ? defer.promise()
                            : this,
                          values = fn
                            ? [returned]
                            : arguments

                      defer[tuple[0] + "With"](context, values)
                    }
                  }
                )
              })

              fns = null
            }).promise()
          },

          /**
           * 为obj对象附加promise的功能 , obj==null , 返回一个纯的promise对象
           * @param  {Object} obj
           * @return {Promise}
           */
          promise: function(obj) {
            return obj != null ? $.extend( obj, promise ) : promise
          }
        },

        deferred = {}

    //
    // 为deferred对象添加切换状态的方法
    //
    // Deferred
    // resolve      - 状态 --> "resolve" , 上下文固定为promise或调用对象
    // resolveWith  - 状态 --> "reject"  , (contenxt , args) => void
    // reject       - 状态 --> "reject"  , 上下文固定为promise或调用对象
    // rejectWith   - 状态 --> "reject"  , (contenxt , args) => void
    // notify       -
    // notifyWith   -
    // ( Promise 只有以下方法 , 不可改变状态 , 只能对状态进行操作 )
    // state    -
    // done     -
    // fail     -
    // progress -
    // then     -
    // alway    -
    $.each(tuples, function(i, tuple){
      var
          action      = tuple[0], // 操作名称
          listener    = tuple[1], // 添加回调函数的接口 ( done , fail , progress )
          list        = tuple[2], // 回调函数管理器
          stateString = tuple[3]  // 状态

      // 向promise添加接口
      promise[listener] = list.add

      if (stateString) {
        // 添加三个预处理函数
        // 1. 处理状态的回调函数
        // 2. 互斥操作 -- 调用rejected ,  resolve不能被调用 ; 调用resolve , rejected不能被调用
        // 3. 锁定 progress ( 清除)
        list.add(
          function(){
            state = stateString
          },
          // 0 ^ 1 = 1
          // 1 ^ 1 = 0
          tuples[i^1][2].disable,
          tuples[2][2].lock
        )
      }

      deferred[action] = function(){
        deferred[action + "With"](
          this === deferred
            ? promise
            : this,
            arguments
        )

        return this
      }

      deferred[action + "With"] = list.fireWith
    })

    // 包装为promise
    promise.promise(deferred)

    // 如果有处理函数 , 则调用处理函数来处理Deferred
    if (func) func.call(deferred, deferred)

    return deferred
  }

  /**
   * [when description]
   * @param  {[type]} sub [description]
   * @return {[type]}     [description]
   */
  $.when = function(sub) {
    var resolveValues = slice.call(arguments),
        len = resolveValues.length,
        i = 0,
        remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
        deferred = remain === 1 ? sub : Deferred(),
        progressValues, progressContexts, resolveContexts,
        updateFn = function(i, ctx, val){
          return function(value){
            ctx[i] = this
            val[i] = arguments.length > 1 ? slice.call(arguments) : value
            if (val === progressValues) {
              deferred.notifyWith(ctx, val)
            } else if (!(--remain)) {
              deferred.resolveWith(ctx, val)
            }
          }
        }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for ( ; i < len; ++i ) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  /**
   * [Deferred description]
   * @type {[type]}
   */
  $.Deferred = Deferred
})(Zepto)
