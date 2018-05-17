/**
 * DEMO 模拟构造函数
 */
function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(`Hello,I'm ${this.name}.`)
}

function createInstance(Class, ...args) {
  // 1. 创建一个新对象
  // 2. 绑定Class的原型
  let instance = Object.create(Class.prototype)

  // 3. 调用函数,实现实例的构造 ( 将instance绑定到this )
  let result = Person.apply(instance, args)

  // 4. 如果没有返回,默认返回instance
  if (!result) {
    result = instance
  }

  return result
}

const instanceA = new Person('instanceA')
const instanceB = createInstance(Person, 'instanceB')

console.log('instanceA:')
console.log(instanceA.constructor)
instanceA.say()

console.log('instanceB:')
console.log(instanceA.constructor)
instanceB.say()

