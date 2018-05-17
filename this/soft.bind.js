/**
 * 软绑定
 * 如果this为window或undefined,那么会使用指定的ctx绑定到this
 */
function softBind(fn, ctx, ...args) {
  if (typeof fn !== "function") {
    throw new TypeError(
      "bind - what is trying to be bound is not callable"
    );
  }

  const bound = function bound() {
    return fn.apply(
      this === global || typeof this === 'undefined'
        ? ctx
        : this,
      args.concat(Array.prototype.slice(arguments))
    )
  }

  // Object.create: 避免修改到fn.prototype
  bound.prototype = Object.create(fn.prototype)

  return bound
}

//
// test
//
var obj1 = { name: 'obj1' }
var obj2 = { name: 'obj2' }
var obj3 = { name: 'obj3' }

function foo() {
  console.log(this.name)
}

const bound = softBind(foo, obj1)

obj2.bound = bound
obj3.bound = bound

bound()       // obj1 , 使用默认绑定的情况下 , 用之前指定的ctx对象绑定this
obj2.bound()  // obj2
obj3.bound()  // boj3

