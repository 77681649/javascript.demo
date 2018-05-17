/**
 * 隐式强制转换
 */


// 隐式强制转换,优先室友valueOf的值作为强制转换的原始值 , 如果没有vaeluOf就使用toString()
var obj = Object.create({
  valueOf: function () {
    return '1010'
  }
})
console.log(+obj)

var obj = Object.create({
  toString: function () {
    return '1010'
  }
})
console.log(+obj)

// 没有toString,valueOf时,进行强制转换将抛出异常TypeError
var obj = Object.create(null)
console.log(+obj)