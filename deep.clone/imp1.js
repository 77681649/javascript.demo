/**
 * 使用JSON.parse实现深拷贝
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}


// 正常拷贝
var obj = { a: 1, b: 2, c: [] }
var clonedObj = deepClone(obj)
clonedObj.b = 100
clonedObj.c.push(10)

console.log(obj)
console.log(clonedObj)


// 无法还原 Date , Map , Set RegExp
var obj = {
  date: new Date(),
  map: new Map(),
  set: new Set(),
  regExp: /123/
}
var clonedObj = deepClone(obj)

console.log(obj)
console.log(clonedObj)


// 无法处理循环嵌套
var x = { a: 1 }
var y = { b: 1, x: x }
x.y = y

var obj = { a: 1, nested: x }
var clonedObj = deepClone(obj)

console.log(obj)
console.log(clonedObj)