//
// 格式化浮点数
// 小数超过一位时 , 保留二位小数 , 如果第三位不为零 , 也需要保留
// 其他情况 , 不用处理
//
const test = (re, str) => console.log(str, re.test(str))
const RE = /(\.\d{1,2}[1-9]?)\d*/
const toFiexed = function (num) {
  return String(num).replace(RE,'$1')
}

console.log(toFiexed('1.2'))
console.log(toFiexed('1.9123123'))
console.log(toFiexed('1.610000023123'))