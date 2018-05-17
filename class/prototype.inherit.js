/**
 * 原型 继承
 */
function inherit(Class, SuperClass) {
  function f(...args) {
    Object.setPrototypeOf(Class.prototype, new SuperClass(...args))

    return new Class(...args)
  }

  f.prototype = Class.prototype

  return f
}

function Person(name) {
  this.name = name
}

Person.prototype.say = function () {
  console.log(`I'm ${this.name}`)
}

function Woman(name) {
  this.male = 'woman'
}

Woman.prototype.cry = function () {
  console.log('cry')
}

const woman = (new inherit(Woman, Person))('aha')

woman.say()
woman.cry()

console.log(woman.__proto__.constructor)
console.log(woman)
console.log(woman instanceof Woman)
console.log(woman instanceof Person)