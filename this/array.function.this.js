/**
 * 箭头函数 this
 */

var foo = {
  name: 'a',
  fn: function () {
    // this->foo|obj

    return () => {
      // this->继承外层函数调用的this绑定
      // this->foo|obj
      console.log(this.name)
    }
  }
}

var obj = {
  name: 'haha'
}

foo.fn()()
foo.fn.apply(obj)()

