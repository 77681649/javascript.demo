/**
 * DEMO bind函数的curry
 */
const add = (a, b) => a + b
const twoAdd = add.bind(null, 2)

console.log(twoAdd(2))
console.log(twoAdd(3))

