/**
 * mixin 继承
 */
const mixin = (function () {
  // Object.create(null) 可能没有hasOwnProperty方法
  const hasOwnProperty = (obj) => Object.prototype.hasOwnProperty.call(obj)

  /**
   * 实现多重mixin
   */
  return function mixin(target, ...sources) {
    sources.forEach(sources)
  }
})()

//
// mixin 继承
//
mixin({
  wheels: 4
}, Person)

//
// 寄生继承
//
const Person = {
  say: function () {
    console.log(`I'm ${this.name}.`)
  }
}

function Car() {
  // 寄生继承 -- 创建一个要继承的对象
  const car = Object.create(Person)

  car.wheels = 4

  return car
}