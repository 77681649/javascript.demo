/**
 * 默认绑定 DEMO
 */
const obj = {
  name: 'obj',
  say: function () {
    console.log(this.name)
  }
}

global.name = 'global'

const say = obj.say

// 非严格模式下 this -> global对象
// 严格模式 this -> undefined
say() // 'global'
