/**
 * 比较不同this绑定方式的优先级
 */

function fn(name) {
  this.name = name
}

const objA = {
  fn: fn
}

const objB = {}



//
// ----------------------------------- 显示绑定 > 隐式绑定
//
objA.fn('a');
console.log(objA.name); // a

// fn this指向objB而不是objA
objA.fn.call(objB, 'b')
console.log(objA.name)  // a
console.log(objB.name)  // b



//
// ------------------------------------ new绑定 > 隐式绑定
//
// fn this指向新创建的对象
const objC = new objA.fn('c') // c
console.log(objC.name)



//
// --------------------- new绑定 显式绑定
//
function foo(something) {
  this.a = something;
}

var obj1 = {};
var bar = foo.bind(obj1);

// this->obj1
// -> "2"
bar(2);
console.log(obj1.a); 

// this->新的对象
// baz->新的对象
var baz = new bar(3);

// -> "2"
console.log(obj1.a);

// -> "3"
console.log(baz.a);