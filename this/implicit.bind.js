/**
 * 隐式绑定 -- 调用对象成员函数时 , 会隐式的将该对象绑定到this
 */
const manager = {
  name: 'manager',
  producer: {
    name: 'producer',
    say: function () {
      console.log(this.name)
    }
  }
}

// this -> producer 对象
// 为什么不是,manager?
// 执行了对象属性引用操作 --> 等价于
// const temp = maanger.producer
// temp.say() // this->temp
manager.producer.say() // 'producer'

console.log('--------------------------------------------------------------------')
//
// 隐式丢失
//
function say() {
  console.log(this.name)
}

const obj = {
  name: 'obj',
  say: say
}

const fn = obj.say

global.name = 'global'

obj.say() // 执行隐式绑定 'obj'
fn()      // 执行默认绑定,丢失了隐式绑定 'global'


// 作为回调函数时丢失
!(function (callback) {
  callback()
})(obj.say)