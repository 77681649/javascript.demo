/**
 * 间接引用导致 上下文对象丢失 , 从而导致this->global
 */
var objA = {
  name: 'obA',
  foo: function () {
    console.log(this.name)
  }
}

var objB = {
  name: 'objB'
}

// 以下代码等价于
// const fn = objB.foo = objA.foo
// fn()
// 所以,实际上是一个间接引用函数的变量执行了函数调用 , 而不是objA,objB
// -> 'undefined'
!(objB.foo = objA.foo)()