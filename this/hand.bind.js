/**
 * 硬绑定
 */
function bind(fn, ctx, ...args) {
  if (typeof fn !== "function") {
    throw new TypeError(
      "bind - what is trying to be bound is not callable"
    );
  }

  const NOP = function () { }
  const bound = function () {
    return fn.apply(
      // 判断是否执行new运算符,如果使用new调用bound, this肯定是NOP的实例
      this instanceof NOP
        ? this
        : ctx,
      args.concat(Array.prototype.slice.call(arguments))  // 拼接参数
    )
  }

  // 目的:
  // 1. 确保new bound时能获得fn的原型
  // 2. 确保能判断是否是new bound ( instance NOP 说明,是基于bound创建的实例 )
  NOP.prototype = fn.prototype  // 创造一个空函数,用来暴露fn的原型
  bound.prototype = new NOP()   // bound的原型继承NOP,

  // 返回一个包装函数
  return bound
}

const obj = { name: 'a' }

function foo(name) {
  this.name = name
}

const bound = bind.call(foo, obj)

bound('A')
console.log(obj.name)

const instance = new bound('B')

console.log(obj.name)
console.log(instance.name)

